# V1. Product Requirements Document (PRD)

## 1.1 Overview

**Product Name:** CodeGlow  
**Type:** Visual Studio Code Extension  
**Language:** TypeScript  
**Scope:** Local, single-user, no backend  
**Version Covered:** V1 (MVP) + V2 (Highlight Management)

CodeGlow is a VS Code extension that allows developers to manually highlight arbitrary code regions with colored backgrounds and persist those highlights across editor sessions. The goal is to preserve the visual connection between code comments/explanations and the exact lines they describe.

## 1.2 Problem Statement

Developers and students frequently annotate code using standard comments. However, comments alone do not visually identify the exact code region they describe. When revisiting a file days or weeks later, the reader cannot easily tell which block of code a comment was referring to.

CodeGlow bridges this gap by letting users paint specific code regions with persistent color. The color acts as a visual anchor — the comment explains, the highlight points.

## 1.3 Product Philosophy

CodeGlow is NOT a note-taking app, documentation tool, or AI assistant. It is a persistent visual highlighter for source code inside VS Code.

Developers already write explanations using native language syntax:

```
// Single-line explanation

/* Multi-line explanation */
```

CodeGlow's sole responsibility is:

> "Visually bind existing comments to the code they explain."

## 1.4 Target Audience

- Programming students learning new codebases
- Self-taught developers studying open-source projects
- Technical educators preparing annotated walkthroughs
- Documentation writers mapping logic to explanations
- Developers performing code reviews

## 1.5 Feature Requirements

### V1 — MVP Features (Marketplace Release)

| ID  | Feature               | Description                                                                                                                                                                        | Priority |
| --- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| F1  | Manual Code Selection | User selects any arbitrary region of code in any language or file type.                                                                                                            | P0       |
| F2  | Highlight Command     | User triggers highlighting via right-click context menu or Command Palette.                                                                                                        | P0       |
| F3  | Color Selection       | User picks from 4 colors: Yellow, Red, Green, Blue.                                                                                                                                | P0       |
| F4  | Visual Highlighting   | Selected region receives a colored background decoration.                                                                                                                          | P0       |
| F5  | Persistence           | Highlights are auto-saved immediately upon creation. No manual save.                                                                                                               | P0       |
| F6  | Session Restoration   | Highlights are restored on VS Code restart, project reopen, and file reopen.                                                                                                       | P0       |
| F7  | Highlight Tracking    | Highlights automatically adjust their ranges when code is edited, preserving their association with the intended code region during normal insertions, deletions, and line shifts. | P0       |

### V2 — Highlight Management Features

| ID  | Feature              | Description                                                         | Priority |
| --- | -------------------- | ------------------------------------------------------------------- | -------- |
| F8  | Unlimited Highlights | Multiple highlights per file, each independently managed.           | P1       |
| F9  | Remove Highlight     | User removes a single highlight via right-click or Command Palette. | P1       |
| F10 | Edit Highlight Color | User changes an existing highlight's color without recreating it.   | P1       |

## 1.6 Explicit Non-Goals

The following are permanently out of scope and must never be added without a full spec revision.

- Hover notes or popup annotations
- Embedded text notes or rich-text editors
- AI-powered features of any kind
- Team collaboration or shared highlights
- Authentication or user accounts
- Cloud sync or remote storage
- WebView panels
- React or web application components
- Backend services or REST APIs
- Databases

## 1.7 Success Criteria

The product is considered complete for V1 when a user can:

1. Select any code region in any file.
2. Apply one of 4 highlight colors.
3. Close VS Code completely.
4. Reopen VS Code and the project.
5. See all highlights restored exactly as created.

V2 is complete when users can also:

6. Create multiple independent highlights in one file.
7. Remove any individual highlight without affecting others.
8. Change a highlight's color in-place.
9. Insert or remove lines above an existing highlight.
10. Observe that the highlight moves with the underlying code and remains attached to the intended region.

## 1.8 Constraints & Assumptions

#### Assumptions

- Highlights should survive normal code editing operations, including line insertions, deletions, and content modifications that shift code locations.
- Large-scale refactors that fundamentally rewrite, move, or restructure code may cause highlights to lose accuracy. Full semantic tracking is outside the scope of V1/V2.
- Single-user, single-machine usage only.

### Constraints

- All storage is local to the workspace via VS Code's built-in `workspaceState` API.
- No external npm dependencies beyond VS Code engine types.

Project coompleteed
Created File Structure

```text
src/
  extension.ts           ← entry point
  types.ts               ← shared interfaces
  highlightManager.ts    ← core business logic
  decorationProvider.ts  ← decoration type cache
  storageManager.ts      ← workspaceState read/write
  colorPicker.ts         ← Quick Pick wrapper
```
