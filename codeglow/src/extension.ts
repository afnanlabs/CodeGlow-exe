import * as vscode from "vscode";
import { showColorPicker } from "./colorPicker";
import { DecorationProvider } from "./decorationProvider";
import { HighlightManager } from "./highlightManager";
import { StorageManager } from "./storageManager";

export function activate(context: vscode.ExtensionContext): void {
  const decorationProvider = new DecorationProvider();
  const storageManager = new StorageManager(context);
  const highlightManager = new HighlightManager(
    decorationProvider,
    storageManager,
    showColorPicker,
  );

  const disposeDecorations = { dispose: () => decorationProvider.disposeAll() };
  const highlightCommand = vscode.commands.registerCommand(
    "codeglow.highlight",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        await highlightManager.applyHighlight(editor);
      }
    },
  );
  const removeHighlightCommand = vscode.commands.registerCommand(
    "codeglow.removeHighlight",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        await highlightManager.removeHighlight(editor);
      }
    },
  );
  const changeColorCommand = vscode.commands.registerCommand(
    "codeglow.changeColor",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        await highlightManager.changeHighlightColor(editor);
      }
    },
  );
  const openDocumentListener = vscode.workspace.onDidOpenTextDocument(
    (document) => {
      highlightManager.restoreForDocument(document);
    },
  );
  const activeEditorListener = vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      highlightManager.restoreForEditor(editor);
    },
  );
  const documentChangeListener = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      highlightManager.updateRangesForDocument(event);
    },
  );

  context.subscriptions.push(
    disposeDecorations,
    highlightCommand,
    removeHighlightCommand,
    changeColorCommand,
    openDocumentListener,
    activeEditorListener,
    documentChangeListener,
  );

  highlightManager.restoreForAllOpenEditors();
}

export function deactivate(): void {}
