import * as vscode from 'vscode';
import { HighlightColor, HighlightEntry, HighlightMap, SerializedRange } from './types';

const STORAGE_KEY = 'codeglow.highlights';
const HIGHLIGHT_COLORS: readonly HighlightColor[] = ['yellow', 'red', 'green', 'blue'];

export class StorageManager {
	constructor(private readonly context: vscode.ExtensionContext) {}

	load(): HighlightMap {
		try {
			const storedValue = this.context.workspaceState.get<unknown>(STORAGE_KEY);

			return this.validateHighlightMap(storedValue);
		} catch (error) {
			this.warn('CodeGlow: Failed to load stored highlights. Resetting to an empty highlight map.', error);
			return {};
		}
	}

	async save(map: HighlightMap): Promise<void> {
		await this.context.workspaceState.update(STORAGE_KEY, map);
	}

	private validateHighlightMap(value: unknown): HighlightMap {
		if (value === undefined) {
			return {};
		}

		if (!this.isRecord(value)) {
			this.warn('CodeGlow: Stored highlights had an invalid shape and were ignored.');
			return {};
		}

		const highlightMap: HighlightMap = {};

		for (const [filePath, entries] of Object.entries(value)) {
			if (!Array.isArray(entries)) {
				this.warn(`CodeGlow: Stored highlights for ${filePath} were not an array and were ignored.`);
				continue;
			}

			const validEntries = entries.filter((entry): entry is HighlightEntry =>
				this.isHighlightEntry(entry, filePath),
			);

			if (validEntries.length > 0) {
				highlightMap[filePath] = validEntries;
			}
		}

		return highlightMap;
	}

	private isHighlightEntry(value: unknown, expectedFilePath: string): value is HighlightEntry {
		if (!this.isRecord(value)) {
			this.warn(`CodeGlow: Dropped a malformed highlight entry for ${expectedFilePath}.`);
			return false;
		}

		const isValid =
			typeof value.id === 'string' &&
			value.id.length > 0 &&
			typeof value.filePath === 'string' &&
			value.filePath === expectedFilePath &&
			this.isSerializedRange(value.range) &&
			this.isHighlightColor(value.color);

		if (!isValid) {
			this.warn(`CodeGlow: Dropped a malformed highlight entry for ${expectedFilePath}.`);
		}

		return isValid;
	}

	private isSerializedRange(value: unknown): value is SerializedRange {
		if (!this.isRecord(value)) {
			return false;
		}

		const { startLine, startCharacter, endLine, endCharacter } = value;

		return (
			this.isNonNegativeInteger(startLine) &&
			this.isNonNegativeInteger(startCharacter) &&
			this.isNonNegativeInteger(endLine) &&
			this.isNonNegativeInteger(endCharacter) &&
			(endLine > startLine || (endLine === startLine && endCharacter >= startCharacter))
		);
	}

	private isHighlightColor(value: unknown): value is HighlightColor {
		return HIGHLIGHT_COLORS.includes(value as HighlightColor);
	}

	private isNonNegativeInteger(value: unknown): value is number {
		return typeof value === 'number' && Number.isInteger(value) && value >= 0;
	}

	private isRecord(value: unknown): value is Record<string, unknown> {
		return typeof value === 'object' && value !== null && !Array.isArray(value);
	}

	private warn(...values: unknown[]): void {
		const runtimeGlobal = globalThis as typeof globalThis & {
			console?: { warn: (...data: unknown[]) => void };
		};

		runtimeGlobal.console?.warn(...values);
	}
}
