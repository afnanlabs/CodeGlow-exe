# 6. Implementation Plan

## 6.1 Prerequisites

- Node.js (v18 or later) installed

- npm installed

- VS Code installed

- VS Code Extension CLI:

  ```bash
  npm install -g @vscode/vsce yo generator-code
  ```

- Git installed

## 6.2 Project Setup

### Step 1 — Scaffold the Extension

1. Run: `yo code`
2. Select: `New Extension (TypeScript)`
3. Set name: `codeglow`
4. Set identifier: `codeglow`
5. Description: `Persistent manual code highlighting for VS Code`
6. Initialize git: `Yes`
7. Bundle with webpack: `No (keep it simple)`
8. Package manager: `npm`

### Step 2 — Clean Up Scaffold

1. Delete the hello-world sample command from `extension.ts`.
2. Delete the `helloWorld` entry from `package.json` `contributes.commands`.
3. Confirm the project compiles:

   ```bash
   npm run compile
   ```

### Step 3 — Create File Structure

```text
src/
  extension.ts           ← entry point
  types.ts               ← shared interfaces
  highlightManager.ts    ← core business logic
  decorationProvider.ts  ← decoration type cache
  storageManager.ts      ← workspaceState read/write
  colorPicker.ts         ← Quick Pick wrapper
```

## 6.3 Feature Implementation Order

### Phase 1 — Foundation (F1–F4: Select, Command, Color, Decoration)

1. Implement `types.ts` — define `HighlightColor`, `SerializedRange`, `HighlightEntry`, `HighlightMap`.
2. Implement `decorationProvider.ts` — create `DecorationProvider` class, `createDecorationTypes()`, `getDecorationType(color)`.
3. Implement `colorPicker.ts` — `showColorPicker()` returns `Promise<HighlightColor | undefined>`.
4. Implement `storageManager.ts` — `StorageManager` class with `load()` and `save()` methods.
5. Implement `highlightManager.ts` — `HighlightManager` class with `applyHighlight(editor)`.
6. Register `codeglow.highlight` command in `extension.ts`.
7. Add command + context menu entries to `package.json`.
8. Test: select code, right-click, apply highlight, see colored background.

### Phase 2 — Persistence (F5–F6: Save and Restore)

1. Call `storageManager.save()` after every `applyHighlight()`.
2. Call `storageManager.load()` in `activate()` and pass data to `HighlightManager`.
3. Register `onDidOpenTextDocument` listener — call `highlightManager.restoreForDocument(doc)`.
4. Register `onDidChangeActiveTextEditor` listener — call `restoreForEditor(editor)`.
5. Test: apply highlight, close VS Code, reopen, confirm highlight is restored.

### Phase 3 — Highlight Management (F7–F9: Multiple, Remove, Change Color)

1. Confirm multiple highlights work (they should already from Phase 1 — test it).
2. Implement `highlightManager.removeHighlight(editor)` — find highlight at cursor, remove decoration, update storage.
3. Register `codeglow.removeHighlight` command. Add to context menu.
4. Implement `highlightManager.changeHighlightColor(editor)` — find highlight at cursor, show color picker, update decoration and storage.
5. Register `codeglow.changeColor` command. Add to context menu.
6. Test all three management commands.

### Phase 4 — Polish

1. Add all `showInformationMessage()` calls for empty and error states.
2. Review all context menu labels and palette titles for clarity.
3. Confirm all edge states are handled (no selection, cursor outside highlight).
4. Update `README.md` with usage instructions and a screenshot.

## 6.4 package.json Configuration

```json
{
  "activationEvents": ["onStartupFinished"],
  "contributes": {
    "commands": [
      {
        "command": "codeglow.highlight",
        "title": "CodeGlow: Highlight Selection"
      },
      {
        "command": "codeglow.removeHighlight",
        "title": "CodeGlow: Remove Highlight"
      },
      {
        "command": "codeglow.changeColor",
        "title": "CodeGlow: Change Highlight Color"
      }
    ],
    "menus": {
      "editor/context": [
        {
          "command": "codeglow.highlight",
          "group": "codeglow@1"
        },
        {
          "command": "codeglow.removeHighlight",
          "group": "codeglow@2"
        },
        {
          "command": "codeglow.changeColor",
          "group": "codeglow@3"
        }
      ]
    }
  }
}
```

## 6.5 Testing Strategy

### Manual Testing Checklist

| Test Case                              | Expected                    | Pass? |
| -------------------------------------- | --------------------------- | ----- |
| Select 3 lines, apply Yellow highlight | Yellow background visible   | ☐     |
| Apply Red highlight on different lines | Red background visible      | ☐     |
| Apply Green and Blue highlights        | Both visible simultaneously | ☐     |
| Close VS Code, reopen project          | All highlights restored     | ☐     |
| Open a second file, switch back        | Highlights preserved        | ☐     |
| Trigger highlight with no selection    | Info message shown          | ☐     |
| Remove highlight (cursor inside)       | Highlight disappears        | ☐     |
| Remove highlight (cursor outside)      | Info message shown          | ☐     |
| Change Yellow to Red                   | Color updates in-place      | ☐     |
| Dismiss color picker with Escape       | No change, no error         | ☐     |

### Automated Testing

VS Code extensions support Mocha-based integration tests via `@vscode/test-electron`.

For V1 MVP, manual testing is sufficient. Automated tests can be added in V3 if the extension grows.

## 6.6 Debugging Strategy

- Open the project in VS Code.
- Press `F5` to launch the Extension Development Host — a second VS Code window with the extension loaded.
- Set breakpoints in TypeScript source files; the debugger attaches automatically.
- Use `console.log()` freely — output appears in the Debug Console of the host window.
- Use the Developer Tools (`Help > Toggle Developer Tools`) to inspect extension errors.

## 6.7 Packaging

1. Ensure all tests pass and `README.md` is complete.

2. Run:

   ```bash
   vsce package
   ```

3. This produces:

   ```text
   codeglow-1.0.0.vsix
   ```

4. Install locally for final validation:

   ```bash
   code --install-extension codeglow-1.0.0.vsix
   ```

5. Test the installed build from scratch in a fresh VS Code window.

## 6.8 Marketplace Publishing

1. Create a publisher account at `marketplace.visualstudio.com`.

2. Generate a Personal Access Token (PAT) in Azure DevOps with Marketplace (Publish) scope.

3. Login:

   ```bash
   vsce login <publisher-name>
   ```

4. Publish:

   ```bash
   vsce publish
   ```

5. Confirm the listing at `marketplace.visualstudio.com/manage`.

## 6.9 Recommended Development Timeline

| Day | Phase                 | Deliverable                                                            |
| --- | --------------------- | ---------------------------------------------------------------------- |
| 1   | Project Setup         | Scaffolded project, file structure created, compiles cleanly           |
| 2–3 | Phase 1 — Apply       | Highlight command working, color picker functional, decoration visible |
| 4   | Phase 2 — Persistence | Highlights survive VS Code restart and file reopen                     |
| 5   | Phase 3 — Management  | Remove and Change Color commands working                               |
| 6   | Phase 4 — Polish      | All edge states handled, README complete                               |
| 7   | Packaging & Publish   | `.vsix` generated, Marketplace listing live                            |

> Assumption: Developer is working part-time (2–4 hours/day). A full-time developer could complete V1+V2 in 2–3 days.
