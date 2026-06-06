# CodeGlow

CodeGlow adds persistent manual code highlights to VS Code. Select any code region, apply a color, and the highlight is restored when the editor or workspace is opened again.

![CodeGlow preview](media/preview.png)

## Features

- Highlight arbitrary code selections in Yellow, Red, Green, or Blue.
- Persist highlights per workspace with VS Code `workspaceState`.
- Restore highlights when documents open, tabs change, or VS Code starts.
- Remove a highlight from the current cursor position.
- Change the color of an existing highlight without recreating it.
- Track highlights through line insertions and deletions above highlighted code.

## Usage

1. Select a code region.
2. Right-click in the editor.
3. Choose **CodeGlow: Apply Highlight**.
4. Pick a color from the list.

To remove or recolor a highlight, place the cursor inside the highlighted region, right-click, and choose the matching CodeGlow command.

## Commands

| Command | Command ID | Description |
| --- | --- | --- |
| CodeGlow: Apply Highlight | `codeglow.highlight` | Applies a selected color to the current selection. |
| CodeGlow: Remove Highlight | `codeglow.removeHighlight` | Removes the highlight under the cursor. |
| CodeGlow: Change Highlight Color | `codeglow.changeColor` | Changes the color of the highlight under the cursor. |

## Installation

### Marketplace

1. Open the Extensions view in VS Code.
2. Search for **CodeGlow**.
3. Select **Install**.

### VSIX

1. Download or build the `.vsix` package.
2. In VS Code, run **Extensions: Install from VSIX...** from the Command Palette.
3. Select the CodeGlow `.vsix` file.

## Notes

CodeGlow uses line-based range tracking. Highlights move when lines are inserted or removed above them. If highlighted lines are deleted, the affected highlights are removed.

## License

MIT
