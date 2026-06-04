# 2. Technical Architecture Document

## 2.1 Technology Decisions

| Decision Area             | Choice & Rationale                                                       |
| :------------------------ | :----------------------------------------------------------------------- |
| **Language**              | TypeScript — type safety, VS Code API alignment, better tooling          |
| **Platform**              | VS Code Extension — native integration, no web layer needed              |
| **Backend**               | None — all logic runs inside the extension host process                  |
| **Database**              | None — VS Code `workspaceState` (key-value) is sufficient                |
| **React / WebView**       | None — color picker via Quick Pick input, no UI component library needed |
| **Authentication**        | None — local single-user extension                                       |
| **Cloud**                 | None — local workspace storage only                                      |
| **External npm packages** | None — only `@types/vscode` devDependency                                |

---

## 2.2 VS Code APIs Required

| API                                         | Usage in CodeGlow                                                 |
| :------------------------------------------ | :---------------------------------------------------------------- |
| `vscode.commands`                           | Register all extension commands (highlight, remove, change color) |
| `vscode.window.showQuickPick`               | Present color selection menu to user                              |
| `vscode.TextEditorDecorationType`           | Create and apply colored background decorations                   |
| `vscode.window.activeTextEditor`            | Get current editor, selection, and document reference             |
| `vscode.workspace.onDidOpenTextDocument`    | Trigger highlight restoration when a file opens                   |
| `vscode.ExtensionContext.workspaceState`    | Persist and retrieve highlight data per workspace                 |
| `vscode.window.onDidChangeActiveTextEditor` | Re-apply decorations when user switches tabs                      |
| `menus` contribution point                  | Register right-click context menu items in editor context         |
| `commands` contribution point               | Register commands in `package.json` for Command Palette           |

---

## 2.3 Extension Architecture

### Module Breakdown

| File                    | Module Name        | Responsibility                                                      |
| :---------------------- | :----------------- | :------------------------------------------------------------------ |
| `extension.ts`          | Entry Point        | `activate()`, `deactivate()`, register commands and event listeners |
| `highlightManager.ts`   | HighlightManager   | Core logic: apply, remove, change, restore highlights               |
| `decorationProvider.ts` | DecorationProvider | Create and cache `TextEditorDecorationType` objects per color       |
| `storageManager.ts`     | StorageManager     | Read/write highlight data to `workspaceState`                       |
| `colorPicker.ts`        | ColorPicker        | Show Quick Pick menu, return selected color                         |
| `types.ts`              | Types              | Shared TypeScript interfaces and type definitions                   |
| `package.json`          | Manifest           | Commands, menus, activation events, engine version                  |

### Dependency Graph

```text
extension.ts
├── highlightManager.ts
│   ├── decorationProvider.ts
│   ├── storageManager.ts
│   └── colorPicker.ts
└── types.ts (shared across all modules)
```
