import * as vscode from "vscode";
import { HighlightColor } from "./types";

export class DecorationProvider {
  private readonly decorationTypes: Record<
    HighlightColor,
    vscode.TextEditorDecorationType
  >;

  constructor() {
    this.decorationTypes = {
      yellow: vscode.window.createTextEditorDecorationType({
        backgroundColor: "rgba(255,235,59,0.35)",
      }),
      red: vscode.window.createTextEditorDecorationType({
        backgroundColor: "rgba(244,67,54,0.30)",
      }),
      green: vscode.window.createTextEditorDecorationType({
        backgroundColor: "rgba(76,175,80,0.30)",
      }),
      blue: vscode.window.createTextEditorDecorationType({
        backgroundColor: "rgba(33,150,243,0.30)",
      }),
    };
  }

  getDecorationType(color: HighlightColor): vscode.TextEditorDecorationType {
    return this.decorationTypes[color];
  }

  disposeAll(): void {
    Object.values(this.decorationTypes).forEach((decorationType) =>
      decorationType.dispose(),
    );
  }
}
