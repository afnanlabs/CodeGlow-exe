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
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
		const randomValue = Math.floor(Math.random() * 16);
		const value = character === 'x' ? randomValue : (randomValue & 0x3) | 0x8;

		return value.toString(16);
	});
}
