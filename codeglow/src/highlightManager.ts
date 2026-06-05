import * as vscode from 'vscode';
import { DecorationProvider } from './decorationProvider';
import { StorageManager } from './storageManager';
import { HighlightColor, HighlightEntry, HighlightMap, SerializedRange, generateId } from './types';

type ColorPicker = () => Promise<HighlightColor | undefined>;

const highlightColors: HighlightColor[] = ['yellow', 'red', 'green', 'blue'];

export class HighlightManager {
	private highlightMap: HighlightMap;

	constructor(
		private readonly decorationProvider: DecorationProvider,
		private readonly storageManager: StorageManager,
		private readonly showColorPicker: ColorPicker,
	) {
		this.highlightMap = this.storageManager.load();
	}

	async applyHighlight(): Promise<void> {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		if (editor.selection.isEmpty) {
			vscode.window.showInformationMessage('Please select a code region before applying a highlight.');
			return;
		}

		const color = await this.showColorPicker();

		if (!color) {
			return;
		}

		const filePath = this.getFilePath(editor.document);
		const entry: HighlightEntry = {
			id: generateId(),
			filePath,
			range: this.serializeRange(editor.selection),
			color,
		};

		if (!this.highlightMap[filePath]) {
			this.highlightMap[filePath] = [];
		}

		this.highlightMap[filePath].push(entry);
		this.restoreForEditor(editor);
		await this.saveHighlights();
	}

	async removeHighlight(): Promise<void> {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const filePath = this.getFilePath(editor.document);
		const match = this.findHighlightAtPosition(filePath, editor.selection.active);

		if (!match) {
			vscode.window.showInformationMessage('No highlight found at the current cursor position.');
			return;
		}

		this.highlightMap[filePath].splice(match.index, 1);

		if (this.highlightMap[filePath].length === 0) {
			delete this.highlightMap[filePath];
		}

		this.restoreForEditor(editor);
		await this.saveHighlights();
	}

	async changeHighlightColor(): Promise<void> {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const filePath = this.getFilePath(editor.document);
		const match = this.findHighlightAtPosition(filePath, editor.selection.active);

		if (!match) {
			vscode.window.showInformationMessage('No highlight found at the current cursor position.');
			return;
		}

		const color = await this.showColorPicker();

		if (!color) {
			return;
		}

		match.entry.color = color;
		this.restoreForEditor(editor);
		await this.saveHighlights();
	}

	restoreForDocument(document: vscode.TextDocument): void {
		vscode.window.visibleTextEditors
			.filter(editor => this.getFilePath(editor.document) === this.getFilePath(document))
			.forEach(editor => this.restoreForEditor(editor));
	}

	restoreForEditor(editor: vscode.TextEditor): void {
		const filePath = this.getFilePath(editor.document);
		const highlights = this.highlightMap[filePath] ?? [];
		const groupedRanges = this.createGroupedRanges();

		for (const highlight of highlights) {
			const range = this.toVsCodeRange(highlight.range, editor.document);

			if (range) {
				groupedRanges[highlight.color].push(range);
			}
		}

		for (const color of highlightColors) {
			editor.setDecorations(this.decorationProvider.getDecorationType(color), groupedRanges[color]);
		}
	}

	restoreForAllOpenEditors(): void {
		vscode.window.visibleTextEditors.forEach(editor => this.restoreForEditor(editor));
	}

	async handleDocumentChange(event: vscode.TextDocumentChangeEvent): Promise<void> {
		const filePath = this.getFilePath(event.document);
		const highlights = this.highlightMap[filePath];

		if (!highlights || highlights.length === 0) {
			return;
		}

		let didUpdateRanges = false;

		for (const change of event.contentChanges) {
			const lineDelta = this.getLineDelta(change);

			if (lineDelta === 0) {
				continue;
			}

			for (const highlight of highlights) {
				const startsBeforeHighlightLine = change.range.start.line < highlight.range.startLine;
				const startsBeforeHighlightOnSameLine =
					change.range.start.line === highlight.range.startLine &&
					change.range.start.character <= highlight.range.startCharacter;

				if (startsBeforeHighlightLine || startsBeforeHighlightOnSameLine) {
					highlight.range.startLine = Math.max(0, highlight.range.startLine + lineDelta);
					highlight.range.endLine = Math.max(0, highlight.range.endLine + lineDelta);
					didUpdateRanges = true;
				}
			}
		}

		if (!didUpdateRanges) {
			return;
		}

		this.restoreForDocument(event.document);
		await this.saveHighlights();
	}

	private getFilePath(document: vscode.TextDocument): string {
		return document.uri.toString();
	}

	private serializeRange(range: vscode.Range): SerializedRange {
		return {
			startLine: range.start.line,
			startCharacter: range.start.character,
			endLine: range.end.line,
			endCharacter: range.end.character,
		};
	}

	private findHighlightAtPosition(
		filePath: string,
		position: vscode.Position,
	): { entry: HighlightEntry; index: number } | undefined {
		const highlights = this.highlightMap[filePath];

		if (!highlights) {
			return undefined;
		}

		for (let index = highlights.length - 1; index >= 0; index -= 1) {
			const highlight = highlights[index];
			const range = new vscode.Range(
				highlight.range.startLine,
				highlight.range.startCharacter,
				highlight.range.endLine,
				highlight.range.endCharacter,
			);

			if (range.contains(position)) {
				return { entry: highlight, index };
			}
		}

		return undefined;
	}

	private createGroupedRanges(): Record<HighlightColor, vscode.Range[]> {
		return {
			yellow: [],
			red: [],
			green: [],
			blue: [],
		};
	}

	private toVsCodeRange(range: SerializedRange, document: vscode.TextDocument): vscode.Range | undefined {
		if (range.endLine < range.startLine) {
			return undefined;
		}

		const lastLine = Math.max(document.lineCount - 1, 0);
		const startLine = this.clamp(range.startLine, 0, lastLine);
		const endLine = this.clamp(range.endLine, 0, lastLine);

		if (endLine < startLine) {
			return undefined;
		}

		const startCharacter = this.clamp(range.startCharacter, 0, document.lineAt(startLine).text.length);
		const endCharacter = this.clamp(range.endCharacter, 0, document.lineAt(endLine).text.length);

		if (startLine === endLine && endCharacter < startCharacter) {
			return undefined;
		}

		return new vscode.Range(startLine, startCharacter, endLine, endCharacter);
	}

	private getLineDelta(change: vscode.TextDocumentContentChangeEvent): number {
		const removedLines = change.range.end.line - change.range.start.line;
		const newLines = (change.text.match(/\r\n|\r|\n/g) ?? []).length;

		return newLines - removedLines;
	}

	private clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	}

	private async saveHighlights(): Promise<void> {
		try {
			await this.storageManager.save(this.highlightMap);
		} catch {
			vscode.window.showErrorMessage('Failed to save highlight. Please try again.');
		}
	}
}
