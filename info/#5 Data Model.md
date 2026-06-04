# 5. Data Model / Storage Schema Document

## 5.1 Core TypeScript Interfaces

### HighlightColor

```ts
type HighlightColor = "yellow" | "red" | "green" | "blue";
```

### SerializedRange

VS Code `Range` objects cannot be directly JSON-serialized. A plain object representation is stored instead.

```ts
interface SerializedRange {
  startLine: number; // 0-indexed line number
  startCharacter: number; // 0-indexed character offset
  endLine: number; // 0-indexed line number
  endCharacter: number; // 0-indexed character offset
}
```

### HighlightEntry

A single highlight. Represents one highlighted region in one file.

```ts
interface HighlightEntry {
  id: string; // UUID v4 — unique identifier
  filePath: string; // Absolute file URI, e.g. "file:///home/user/project/main.ts"
  range: SerializedRange; // The highlighted region
  color: HighlightColor; // The selected color key
}
```

### HighlightMap

The top-level storage structure. A dictionary keyed by file URI, containing all highlights for that file.

```ts
type HighlightMap = Record<string, HighlightEntry[]>;
//                          ^ filePath   ^ highlights for that file
```

## 5.2 Storage Design

### Storage API

```ts
context.workspaceState.get<HighlightMap>("codeglow.highlights");
context.workspaceState.update("codeglow.highlights", highlightMap);
```

### Storage Key

```text
codeglow.highlights
```

### Example Stored Value

```json
{
  "file:///home/dev/project/src/index.ts": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "filePath": "file:///home/dev/project/src/index.ts",
      "range": {
        "startLine": 10,
        "startCharacter": 2,
        "endLine": 14,
        "endCharacter": 4
      },
      "color": "yellow"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "filePath": "file:///home/dev/project/src/index.ts",
      "range": {
        "startLine": 20,
        "startCharacter": 0,
        "endLine": 24,
        "endCharacter": 7
      },
      "color": "red"
    }
  ],
  "file:///home/dev/project/src/utils.ts": [
    {
      "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "filePath": "file:///home/dev/project/src/utils.ts",
      "range": {
        "startLine": 5,
        "startCharacter": 0,
        "endLine": 9,
        "endCharacter": 1
      },
      "color": "green"
    }
  ]
}
```

## 5.3 ID Generation

Each `HighlightEntry` requires a unique ID. A simple UUID v4 implementation using `Math.random()` is sufficient for a local, single-user extension. No external `uuid` library is required.

```ts
function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
```

## 5.4 Range Conversion Utilities

Helpers to convert between VS Code's `Range` class and the plain `SerializedRange` interface:

```ts
function serializeRange(range: vscode.Range): SerializedRange {
  return {
    startLine: range.start.line,
    startCharacter: range.start.character,
    endLine: range.end.line,
    endCharacter: range.end.character,
  };
}

function deserializeRange(r: SerializedRange): vscode.Range {
  return new vscode.Range(
    r.startLine,
    r.startCharacter,
    r.endLine,
    r.endCharacter,
  );
}
```

## 5.5 In-Memory State

`HighlightManager` maintains a single in-memory copy of the `HighlightMap`. All operations (apply, remove, change color) update both the in-memory map and `workspaceState` synchronously.

### In-Memory Decoration Cache

The `DecorationProvider` maintains a `Record<HighlightColor, vscode.TextEditorDecorationType>` that maps color names to their decoration objects. These are created once on activation and never recreated.

## 5.6 Storage Capacity

VS Code's `workspaceState` has no documented hard limit on stored data size. A typical `HighlightEntry` is approximately 200 bytes of JSON. Thousands of highlights would be well within any reasonable limit.

## 5.7 Configuration Settings (package.json)

No user-configurable settings are required for V1/V2. The extension works out of the box. No `contributes.configuration` section is needed.
