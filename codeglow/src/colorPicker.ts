import * as vscode from 'vscode';
import { HighlightColor } from './types';

interface HighlightColorPickItem extends vscode.QuickPickItem {
	color: HighlightColor;
}

const colorOptions: HighlightColorPickItem[] = [
	{ label: 'Yellow', color: 'yellow' },
	{ label: 'Red', color: 'red' },
	{ label: 'Green', color: 'green' },
	{ label: 'Blue', color: 'blue' },
];

export async function showColorPicker(): Promise<HighlightColor | undefined> {
	const selected = await vscode.window.showQuickPick(colorOptions, {
		title: 'Select Highlight Color',
		placeHolder: 'Choose a color for this highlight',
	});

	return selected?.color;
}
