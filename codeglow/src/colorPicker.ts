import * as vscode from 'vscode';
import { HighlightColor } from './types';

interface HighlightColorPickItem extends vscode.QuickPickItem {
	color: HighlightColor;
}

const colorOptions: HighlightColorPickItem[] = [
	{ label: '$(circle-filled) Yellow', description: 'Highlight in Yellow', color: 'yellow' },
	{ label: '$(circle-filled) Red', description: 'Highlight in Red', color: 'red' },
	{ label: '$(circle-filled) Green', description: 'Highlight in Green', color: 'green' },
	{ label: '$(circle-filled) Blue', description: 'Highlight in Blue', color: 'blue' },
];

export async function showColorPicker(): Promise<HighlightColor | undefined> {
	const selected = await vscode.window.showQuickPick(colorOptions, {
		title: 'Select Highlight Color',
		placeHolder: 'Choose a color for this highlight',
	});

	return selected?.color;
}
