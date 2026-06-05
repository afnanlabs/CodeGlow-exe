export type HighlightColor = 'yellow' | 'red' | 'green' | 'blue';

export interface SerializedRange {
	startLine: number;
	startCharacter: number;
	endLine: number;
	endCharacter: number;
}

export interface HighlightEntry {
	id: string;
	filePath: string;
	range: SerializedRange;
	color: HighlightColor;
}

export type HighlightMap = Record<string, HighlightEntry[]>;

export function generateId(): string {
	return `codeglow-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
