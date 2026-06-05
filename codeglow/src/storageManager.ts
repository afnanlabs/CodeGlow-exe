import * as vscode from 'vscode';
import { HighlightMap } from './types';

const STORAGE_KEY = 'codeglow.highlights';

export class StorageManager {
	constructor(private readonly context: vscode.ExtensionContext) {}

	load(): HighlightMap {
		return this.context.workspaceState.get<HighlightMap>(STORAGE_KEY) ?? {};
	}

	async save(map: HighlightMap): Promise<void> {
		await this.context.workspaceState.update(STORAGE_KEY, map);
	}
}
