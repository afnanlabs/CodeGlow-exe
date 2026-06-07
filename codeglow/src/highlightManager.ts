import * as vscode from 'vscode';
import { DecorationProvider } from './decorationProvider';
import { StorageManager } from './storageManager';
import { HighlightColor, HighlightEntry, HighlightMap, SerializedRange, generateId } from './types';

type ColorPicker = () => Promise<HighlightColor | undefined>;
type CharacterRangeUpdate = { startCharacter: number; endCharacter: number };

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
		const match = this.findHighlightAtPosition(editor.document, filePath, editor.selection.active);

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
		const match = this.findHighlightAtPosition(editor.document, filePath, editor.selection.active);

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
		const editors = vscode.window.visibleTextEditors.filter(
			visibleEditor => this.getFilePath(visibleEditor.document) === filePath,
		);

		for (const editor of editors) {
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
		const removedHighlightIds = new Set<string>();

		for (const change of event.contentChanges) {
			const lineDelta = this.getLineDelta(change);

			for (const highlight of highlights) {
				if (removedHighlightIds.has(highlight.id)) {
					continue;
				}

				if (!this.isValidSerializedRange(highlight.range)) {
					removedHighlightIds.add(highlight.id);
					didUpdateRanges = true;
					continue;
				}

				if (this.changeRemovesHighlightRange(change, highlight.range)) {
					removedHighlightIds.add(highlight.id);
					didUpdateRanges = true;
					continue;
				}

				if (lineDelta === 0) {
					const characterUpdate = this.getCharacterRangeUpdate(change, highlight.range);

					if (!characterUpdate) {
						continue;
					}

					if (
						characterUpdate.startCharacter < 0 ||
						characterUpdate.endCharacter < 0 ||
						characterUpdate.endCharacter <= characterUpdate.startCharacter
					) {
						removedHighlightIds.add(highlight.id);
						didUpdateRanges = true;
						continue;
					}

					highlight.range.startCharacter = characterUpdate.startCharacter;
					highlight.range.endCharacter = characterUpdate.endCharacter;
					didUpdateRanges = true;
					continue;
				}

				if (this.changeStartsBeforeOrAtRangeStart(change, highlight.range)) {
					const nextStartLine = highlight.range.startLine + lineDelta;
					const nextEndLine = highlight.range.endLine + lineDelta;
					const nextCharacters = this.getLineChangeCharacterUpdate(change, highlight.range);

					if (nextStartLine < 0 || nextEndLine < nextStartLine) {
						removedHighlightIds.add(highlight.id);
						didUpdateRanges = true;
						continue;
					}

					if (nextCharacters) {
						if (
							nextCharacters.startCharacter < 0 ||
							nextCharacters.endCharacter < 0 ||
							(nextStartLine === nextEndLine && nextCharacters.endCharacter <= nextCharacters.startCharacter)
						) {
							removedHighlightIds.add(highlight.id);
							didUpdateRanges = true;
							continue;
						}

						highlight.range.startCharacter = nextCharacters.startCharacter;
						highlight.range.endCharacter = nextCharacters.endCharacter;
					}

					highlight.range.startLine = nextStartLine;
					highlight.range.endLine = nextEndLine;
					didUpdateRanges = true;
					continue;
				}

				if (this.changeStartsInsideRange(change, highlight.range)) {
					const nextEndLine = highlight.range.endLine + lineDelta;
					const nextEndCharacter = this.getLineChangeEndCharacterUpdate(change, highlight.range);

					if (nextEndLine < highlight.range.startLine) {
						removedHighlightIds.add(highlight.id);
						didUpdateRanges = true;
						continue;
					}

					if (nextEndCharacter !== undefined) {
						if (
							nextEndCharacter < 0 ||
							(nextEndLine === highlight.range.startLine && nextEndCharacter <= highlight.range.startCharacter)
						) {
							removedHighlightIds.add(highlight.id);
							didUpdateRanges = true;
							continue;
						}

						highlight.range.endCharacter = nextEndCharacter;
					}

					highlight.range.endLine = nextEndLine;
					didUpdateRanges = true;
				}
			}
		}

		if (removedHighlightIds.size > 0) {
			const remainingHighlights = highlights.filter(highlight => !removedHighlightIds.has(highlight.id));

			if (remainingHighlights.length > 0) {
				this.highlightMap[filePath] = remainingHighlights;
			} else {
				delete this.highlightMap[filePath];
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
		if (!this.isValidSerializedRange(range)) {
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
		document: vscode.TextDocument,
		filePath: string,
		position: vscode.Position,
	): { entry: HighlightEntry; index: number } | undefined {
		const highlights = this.highlightMap[filePath];

		if (!highlights) {
			return undefined;
		}

		for (let index = highlights.length - 1; index >= 0; index -= 1) {
			const highlight = highlights[index];
			const range = this.deserializeRange(highlight.range, document);

			if (range && this.rangeContainsPosition(range, position)) {
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
		const insertedLines = change.text.split('\n').length - 1;

		return insertedLines - removedLines;
	}

	private getCharacterRangeUpdate(
		change: vscode.TextDocumentContentChangeEvent,
		range: SerializedRange,
	): CharacterRangeUpdate | undefined {
		if (change.range.start.line !== change.range.end.line || change.text.includes('\n')) {
			return undefined;
		}

		if (range.startLine !== range.endLine || change.range.start.line !== range.startLine) {
			return undefined;
		}

		const removedCharacters = change.range.end.character - change.range.start.character;
		const characterDelta = change.text.length - removedCharacters;

		if (characterDelta === 0) {
			return undefined;
		}

		if (change.range.end.character <= range.startCharacter) {
			return {
				startCharacter: range.startCharacter + characterDelta,
				endCharacter: range.endCharacter + characterDelta,
			};
		}

		if (
			this.isPositionBefore(
				change.range.start.line,
				change.range.start.character,
				range.endLine,
				range.endCharacter,
			)
		) {
			return {
				startCharacter: range.startCharacter,
				endCharacter: range.endCharacter + characterDelta,
			};
		}

		return undefined;
	}

	private getLineChangeCharacterUpdate(
		change: vscode.TextDocumentContentChangeEvent,
		range: SerializedRange,
	): CharacterRangeUpdate | undefined {
		if (change.text.includes('\n') && change.range.start.line === range.startLine) {
			const startCharacter = this.getCharacterAfterLineInsertion(change, range.startCharacter);
			const endCharacter =
				range.endLine === range.startLine
					? this.getCharacterAfterLineInsertion(change, range.endCharacter)
					: range.endCharacter;

			return { startCharacter, endCharacter };
		}

		if (change.range.end.line > change.range.start.line && change.range.end.line === range.startLine) {
			const startCharacter = this.getCharacterAfterLineDeletion(change, range.startCharacter);
			const endCharacter =
				range.endLine === range.startLine
					? this.getCharacterAfterLineDeletion(change, range.endCharacter)
					: range.endCharacter;

			return { startCharacter, endCharacter };
		}

		return undefined;
	}

	private getLineChangeEndCharacterUpdate(
		change: vscode.TextDocumentContentChangeEvent,
		range: SerializedRange,
	): number | undefined {
		if (change.text.includes('\n') && change.range.start.line === range.endLine) {
			return this.getCharacterAfterLineInsertion(change, range.endCharacter);
		}

		if (change.range.end.line > change.range.start.line && change.range.end.line === range.endLine) {
			return this.getCharacterAfterLineDeletion(change, range.endCharacter);
		}

		return undefined;
	}

	private getCharacterAfterLineInsertion(
		change: vscode.TextDocumentContentChangeEvent,
		character: number,
	): number {
		return this.getInsertedTextLastLineLength(change.text) + character - change.range.start.character;
	}

	private getCharacterAfterLineDeletion(
		change: vscode.TextDocumentContentChangeEvent,
		character: number,
	): number {
		return change.range.start.character + character - change.range.end.character;
	}

	private getInsertedTextLastLineLength(text: string): number {
		const lines = text.split('\n');
		return lines[lines.length - 1].length;
	}

	private changeRemovesHighlightRange(
		change: vscode.TextDocumentContentChangeEvent,
		range: SerializedRange,
	): boolean {
		if (change.range.isEmpty) {
			return false;
		}

		return (
			this.isPositionBeforeOrEqual(
				change.range.start.line,
				change.range.start.character,
				range.startLine,
				range.startCharacter,
			) &&
			this.isPositionAfterOrEqual(
				change.range.end.line,
				change.range.end.character,
				range.endLine,
				range.endCharacter,
			)
		);
	}

	private changeStartsBeforeOrAtRangeStart(
		change: vscode.TextDocumentContentChangeEvent,
		range: SerializedRange,
	): boolean {
		if (
			change.range.isEmpty &&
			change.range.start.line === range.startLine &&
			change.range.start.character === range.startCharacter
		) {
			return true;
		}

		return this.isPositionBefore(
			change.range.start.line,
			change.range.start.character,
			range.startLine,
			range.startCharacter,
		);
	}

	private changeStartsInsideRange(
		change: vscode.TextDocumentContentChangeEvent,
		range: SerializedRange,
	): boolean {
		return (
			this.isPositionAfterOrEqual(
				change.range.start.line,
				change.range.start.character,
				range.startLine,
				range.startCharacter,
			) &&
			this.isPositionBefore(
				change.range.start.line,
				change.range.start.character,
				range.endLine,
				range.endCharacter,
			)
		);
	}

	private isPositionBeforeOrEqual(
		line: number,
		character: number,
		targetLine: number,
		targetCharacter: number,
	): boolean {
		return line < targetLine || (line === targetLine && character <= targetCharacter);
	}

	private isPositionBefore(line: number, character: number, targetLine: number, targetCharacter: number): boolean {
		return line < targetLine || (line === targetLine && character < targetCharacter);
	}

	private isPositionAfterOrEqual(
		line: number,
		character: number,
		targetLine: number,
		targetCharacter: number,
	): boolean {
		return line > targetLine || (line === targetLine && character >= targetCharacter);
	}

	private rangeContainsPosition(range: vscode.Range, position: vscode.Position): boolean {
		return range.contains(position) || position.isEqual(range.end);
	}

	private isValidSerializedRange(range: unknown): range is SerializedRange {
		if (typeof range !== 'object' || range === null) {
			return false;
		}

		const candidate = range as Partial<SerializedRange>;

		return (
			Number.isInteger(candidate.startLine) &&
			Number.isInteger(candidate.startCharacter) &&
			Number.isInteger(candidate.endLine) &&
			Number.isInteger(candidate.endCharacter) &&
			candidate.startLine !== undefined &&
			candidate.startCharacter !== undefined &&
			candidate.endLine !== undefined &&
			candidate.endCharacter !== undefined &&
			candidate.startLine >= 0 &&
			candidate.startCharacter >= 0 &&
			candidate.endLine >= 0 &&
			candidate.endCharacter >= 0 &&
			(candidate.endLine > candidate.startLine ||
				(candidate.endLine === candidate.startLine && candidate.endCharacter >= candidate.startCharacter))
		);
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
