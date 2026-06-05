import * as vscode from 'vscode';
import { showColorPicker } from './colorPicker';
import { DecorationProvider } from './decorationProvider';
import { HighlightManager } from './highlightManager';
import { StorageManager } from './storageManager';

export function activate(context: vscode.ExtensionContext): void {
	const decorationProvider = new DecorationProvider();
	const storageManager = new StorageManager(context);
	const highlightManager = new HighlightManager(decorationProvider, storageManager, showColorPicker);

	context.subscriptions.push(
		{ dispose: () => decorationProvider.disposeAll() },
		vscode.commands.registerCommand('codeglow.applyHighlight', () => highlightManager.applyHighlight()),
		vscode.commands.registerCommand('codeglow.removeHighlight', () => highlightManager.removeHighlight()),
		vscode.commands.registerCommand('codeglow.changeHighlightColor', () => highlightManager.changeHighlightColor()),
		vscode.workspace.onDidOpenTextDocument(document => highlightManager.restoreForDocument(document)),
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				highlightManager.restoreForEditor(editor);
			}
		}),
		vscode.workspace.onDidChangeTextDocument(event => highlightManager.handleDocumentChange(event)),
	);

	highlightManager.restoreForAllOpenEditors();
}

export function deactivate(): void {}
