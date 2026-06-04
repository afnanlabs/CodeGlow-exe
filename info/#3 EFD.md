# 3. Extension Flow Document

## 3.1 Extension Activation Flow

1. **VS Code loads** the extension when the user opens any text file (`activationEvent: onLanguage:*` or `*`).
2. `activate(context)` is called.
3. **DecorationProvider** creates and caches the 4 `TextEditorDecorationType` objects.
4. **StorageManager** initializes and reads the stored highlight map from `workspaceState`.
5. **HighlightManager** is instantiated and references both providers.
6. **Three commands** are registered: `codeglow.highlight`, `codeglow.removeHighlight`, and `codeglow.changeColor`.
7. **Two event listeners** are registered: `onDidOpenTextDocument` and `onDidChangeActiveTextEditor`.
8. **Highlights are restored** for any editors already open at activation time.

---

## 3.2 Apply Highlight Workflow

### Happy Path

9. User selects a code region using mouse or keyboard.
10. User right-clicks $\rightarrow$ selects **"CodeGlow: Highlight Selection"** from the context menu.
11. **ColorPicker** displays a Quick Pick menu with 4 color options.
12. User selects a color (e.g., Yellow).
13. **HighlightManager** reads the current selection range from the active editor.
14. A new `HighlightEntry` is created: `{ id, filePath, range, color }`.
15. The decoration is applied immediately to the editor via `setDecorations()`.
16. The new entry is appended to the in-memory highlights map and saved to `workspaceState`.
17. The colored background appears on the selected code.

### Empty State — No Selection

- If no text is selected when the command is triggered, show an information message:
  > "CodeGlow: Please select a code region before applying a highlight."
- Do not open the color picker. Return early.

### Error State — Storage Failure

- If `workspaceState.update()` fails, show an error message:
  > "CodeGlow: Failed to save highlight. Please try again."
- The decoration is still visible in the current session even if storage failed.

---

## 3.3 Remove Highlight Workflow

### Happy Path

18. User places cursor anywhere within a highlighted region.
19. User right-clicks $\rightarrow$ selects **"CodeGlow: Remove Highlight"** OR uses the Command Palette.
20. **HighlightManager** scans the highlights for the current file to find which entry contains the cursor position.
21. The matching highlight's decoration range is cleared from the editor.
22. The entry is removed from the in-memory map and `workspaceState` is updated.
23. The highlight background disappears from the code.

### Edge State — Cursor Not Inside Any Highlight

- Show an information message:
  > "CodeGlow: No highlight found at the current cursor position."
- No changes are made.

---

## 3.4 Change Highlight Color Workflow

24. User places cursor inside an existing highlight.
25. User triggers **"CodeGlow: Change Highlight Color"**.
26. **HighlightManager** finds the highlight at the cursor position.
27. **ColorPicker** shows the Quick Pick menu.
28. User selects a new color.
29. Old decoration is disposed and the region is re-decorated with the new color type.
30. The entry's color field is updated in memory and saved to `workspaceState`.

### Edge State — No Highlight at Cursor

- Same message as Remove Highlight edge state:
  > "CodeGlow: No highlight found at the current cursor position."

---

## 3.5 Session Restoration Flow

31. VS Code starts and extension activates.
32. **StorageManager** reads the highlight map from `workspaceState`.
33. For each open editor, **HighlightManager** checks if that file's URI exists in the map.
34. If highlights exist for the file, `setDecorations()` is called for each color group.
35. All stored highlights are visually restored.

> **Note:** Restoration is also triggered by `onDidOpenTextDocument`, so highlights apply when a tab is opened after activation.

---

## 3.6 Context Menu Visibility Rules

| Menu Item                            | Visibility Condition                                                               |
| :----------------------------------- | :--------------------------------------------------------------------------------- |
| **CodeGlow: Highlight Selection**    | Always visible in editor context menu when text is selected (`editorHasSelection`) |
| **CodeGlow: Remove Highlight**       | Always visible in editor context menu                                              |
| **CodeGlow: Change Highlight Color** | Always visible in editor context menu                                              |

- **Assumption:** All 3 commands are visible in the context menu at all times. _Remove_ and _Change Color_ show a message if no highlight is found at the cursor. This is simpler than conditional `when` clauses and avoids confusing users with disappearing menu items.

---

## 3.7 Quick Pick Color Menu

The color picker is a standard `vscode.window.showQuickPick()` call with the following options:

| Label                     | Description         | Color Key |
| :------------------------ | :------------------ | :-------- |
| `$(circle-filled)` Yellow | Highlight in Yellow | `yellow`  |
| `$(circle-filled)` Red    | Highlight in Red    | `red`     |
| `$(circle-filled)` Green  | Highlight in Green  | `green`   |
| `$(circle-filled)` Blue   | Highlight in Blue   | `blue`    |

- If the user dismisses the picker (presses `Escape`), the operation is cancelled. No decoration is applied or changed.
