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

	async applyHighlight(editor: vscode.TextEditor): Promise<void> {
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

		this.highlightMap[filePath] ??= [];
		this.highlightMap[filePath].push(entry);

		this.applyDecorationsForFile(editor);
		await this.saveHighlights();
	}

	async removeHighlight(editor: vscode.TextEditor): Promise<void> {
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

		this.applyDecorationsForFile(editor);
		await this.saveHighlights();
	}

	async changeHighlightColor(editor: vscode.TextEditor): Promise<void> {
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
		this.applyDecorationsForFile(editor);
		await this.saveHighlights();
	}

	restoreForDocument(document: vscode.TextDocument): void {
		const filePath = this.getFilePath(document);
		const editor = vscode.window.visibleTextEditors.find(
			visibleEditor => this.getFilePath(visibleEditor.document) === filePath,
		);

		if (editor) {
			this.applyDecorationsForFile(editor);
		}
	}

	restoreForEditor(editor: vscode.TextEditor | undefined): void {
		if (!editor) {
			return;
		}

		this.applyDecorationsForFile(editor);
	}

	restoreForAllOpenEditors(): void {
		vscode.window.visibleTextEditors.forEach(editor => this.applyDecorationsForFile(editor));
	}

	updateRangesForDocument(event: vscode.TextDocumentChangeEvent): void {
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
				if (change.range.start.line < highlight.range.startLine) {
					highlight.range.startLine = Math.max(0, highlight.range.startLine + lineDelta);
					highlight.range.endLine = Math.max(0, highlight.range.endLine + lineDelta);
					didUpdateRanges = true;
				}
			}
		}

		this.restoreForDocument(event.document);

		if (didUpdateRanges) {
			void this.saveHighlights();
		}
	}

	private applyDecorationsForFile(editor: vscode.TextEditor): void {
		const filePath = this.getFilePath(editor.document);
		const groupedRanges = this.createGroupedRanges();

		for (const highlight of this.highlightMap[filePath] ?? []) {
			const range = this.deserializeRange(highlight.range, editor.document);

			if (range) {
				groupedRanges[highlight.color].push(range);
			}
		}

		for (const color of highlightColors) {
			editor.setDecorations(this.decorationProvider.getDecorationType(color), groupedRanges[color]);
		}
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

	private deserializeRange(range: SerializedRange, document: vscode.TextDocument): vscode.Range | undefined {
		if (range.endLine < range.startLine) {
			return undefined;
		}

		const lastLine = document.lineCount - 1;

		if (lastLine < 0 || range.startLine > lastLine) {
			return undefined;
		}

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

	private getLineDelta(change: vscode.TextDocumentContentChangeEvent): number {
		const removedLines = change.range.end.line - change.range.start.line;
		const insertedLines = (change.text.match(/\r\n|\r|\n/g) ?? []).length;

		return insertedLines - removedLines;
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
