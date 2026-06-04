# CodeGlow

**Tagline:** Highlight code the way you think about it.

**Description:** A VS Code extension that provides persistent manual code highlighting and annotations for learning, reviewing, documenting, and explaining code.

---

# Overview

CodeGlow is a Visual Studio Code extension that allows developers to manually highlight arbitrary regions of code and associate those highlights with notes or explanations.

Unlike syntax highlighting, which is determined by language rules, CodeGlow enables user-driven highlighting based on the developer's current understanding, learning goals, documentation needs, or review workflow.

The purpose of the extension is to preserve the relationship between explanations and the exact code they describe.

---

# Problem Statement

Developers and students frequently write comments, notes, and explanations while learning or reviewing code.

However, comments alone do not clearly identify the exact code region being explained.

As files grow and explanations accumulate, it becomes difficult to determine:

- Which code block a note refers to.
- Which logic path was being discussed.
- Which part of a larger example was considered important.
- What the original learning context was during later review.

This problem becomes especially noticeable when revisiting code days, weeks, or months later.

The explanation may still exist, but the visual connection between the explanation and the intended code has been lost.

CodeGlow solves this problem by allowing users to create persistent visual links between code regions and their associated explanations.

---

# Goals

CodeGlow should enable users to:

- Highlight arbitrary code regions.
- Assign colors to highlighted regions.
- Persist highlights across sessions.
- Attach notes or explanations to highlighted code.
- Quickly understand previously studied or documented code.
- Improve educational, review, and documentation workflows.

---

# Desired Workflow

1. Select any code region.
2. Open the context menu or use a keyboard shortcut.
3. Choose a highlight color.
4. The selected code becomes highlighted.
5. Optionally attach a note or explanation.
6. Reopen the project later and retain all highlights and notes.

---

# Example Use Case: Promise Chain

```javascript
fetchData()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    console.log("Done");
  });
```

Visual organization:

- Yellow → Success flow
- Red → Error handling
- Blue → Cleanup logic

The colors allow explanations to remain visually connected to the exact code being discussed.

---

# Example Use Case: Conditional Logic

```javascript
if (user.isAdmin) {
  showAdminPanel();
} else {
  showUserPanel();
}
```

Visual organization:

- Green → Admin branch
- Orange → User branch

This makes it easier to understand and explain each execution path independently.

---

# Current Limitation in VS Code

Visual Studio Code provides syntax highlighting, search highlighting, diagnostics highlighting, and extension-based pattern highlighting.

However, most existing solutions are pattern-driven rather than user-driven.

Typical highlighting systems:

- Highlight keywords
- Highlight matching text
- Highlight search results
- Highlight diagnostics

CodeGlow focuses on a different use case:

> Highlight this specific code because I want to explain, learn, review, or remember it.

rather than:

> Highlight all code matching a predefined pattern.

---

# Proposed Solution

CodeGlow introduces a persistent annotation layer inside Visual Studio Code.

The extension allows users to manually select code regions and associate those regions with visual highlights and explanatory notes.

The experience should feel similar to highlighting text in:

- PDF readers
- Word processors
- Research tools
- Annotation software

while remaining fully integrated into the VS Code editing experience.

---

# Success Criteria

A user should be able to:

- Highlight any code region.
- Choose from multiple colors.
- Save highlights automatically.
- Restore highlights after reopening VS Code.
- Attach explanatory notes.
- Instantly identify which explanation belongs to which code region.

---

# Target Audience

- Programming students
- Self-taught developers
- Technical educators
- Coding bootcamp instructors
- Documentation writers
- Developers performing code reviews

---

# Product Type

Visual Studio Code Extension

This is not a web application, note-taking platform, or documentation tool.

CodeGlow is designed to operate directly inside the VS Code editor and enhance the code-reading and learning experience through persistent visual annotations.

## Desired Solution

A VS Code capability that supports:

- Manual selection-based highlighting
- Multiple highlight colors
- Persistent highlights across sessions
- Visual code annotation workflows
- Educational and documentation-focused code review
- Arbitrary region highlighting independent of language syntax

The experience should feel similar to highlighting text in a document, PDF, or annotation tool while remaining integrated within the code editor.

# Non-Goals

CodeGlow is not intended to be:

- A note-taking application
- A documentation platform
- A collaborative whiteboard
- A code editor replacement
- An AI-powered learning assistant

Its primary purpose is to provide persistent visual highlighting and annotations directly within the VS Code editor.

### RATING

HACK:
"Developed and published a VS Code extension enabling persistent manual code highlighting and annotations for educational code review workflows" → 8–9/10 recruiter interest.

IDEA:

#### Rating the idea alone

7.5/10

Why not higher?

Real problem.
Clear target users.
Technically feasible.
But it's still a niche productivity tool, not a massive innovation.

##### Rating after building a working MVP

8.5/10

If it includes:

Multiple colors
Persistent highlights
Notes/annotations
VS Code marketplace publication
GitHub repository with documentation

That's a solid project for an IT student.

#### Rating after building and publishing a polished version

9/10

If you add:

Sidebar navigation
Hover notes
Export/import annotations
Team/workspace sharing
Good UI/UX

Then it becomes a standout resume project because it demonstrates:

TypeScript ❎
VS Code Extension API
State management
UX design
Real-world product thinking
Software distribution

# CodeGlow Development Roadmap

## Product Philosophy

CodeGlow is a Visual Studio Code extension that enables developers to manually highlight arbitrary code regions and persist those highlights across sessions.

The purpose of CodeGlow is not to replace comments or become a note-taking system.

Developers already use:

```js
// Explanation

/*
Multi-line explanation
*/
```

to document code.

The problem is that comments do not always visually identify the exact code section they are describing.

CodeGlow solves this problem by creating a persistent visual connection between code and the explanations that developers already write.

CodeGlow's responsibility is:

> Visually bind existing comments to the code they explain.

Not:

> Replace comments with a custom annotation system.

Visual Example : [![Code-Glow-example.png](https://i.postimg.cc/PfznQP1R/Code-Glow-example.png)](https://postimg.cc/hhjYS4yL)

---

# Version 1 (MVP)

## Goal

Deliver the first stable and publishable marketplace release.

## Features

### Feature 1 — Manual Code Selection

Users can select any arbitrary region of code regardless of language, syntax, or content.

### Feature 2 — Highlight Command

Users can apply highlights through:

- Right-click context menu
- Command Palette

### Feature 3 — Color Selection

Available colors:

- Yellow
- Red
- Green
- Blue

### Feature 4 — Visual Highlighting

Selected code receives a persistent background decoration using the chosen color.

### Feature 5 — Persistence

Highlights are automatically saved.

No manual save action is required.

### Feature 6 — Session Restoration

Highlights are restored automatically when:

- VS Code restarts
- A project is reopened
- A file is reopened

## Success Criteria

A user should be able to:

1. Select code.
2. Apply a highlight color.
3. Close VS Code.
4. Reopen VS Code.
5. Continue working with all highlights preserved.

## Release Outcome

Version 1 is considered complete when the extension is stable enough to be published on the VS Code Marketplace.

---

# Version 2

## Goal

Improve highlight management without changing the core workflow.

## Features

### Feature 7 — Unlimited Highlights

Users can create multiple highlights within the same file.

Example:

- Yellow → Promise Resolution
- Red → Error Handling
- Green → Validation Logic
- Blue → Cleanup Logic

### Feature 8 — Remove Highlight

Users can remove individual highlights.

Access:

- Right-click menu
- Command Palette

### Feature 9 — Edit Highlight Color

Users can change an existing highlight color without recreating the highlight.

Example:

Yellow → Red

while preserving the original highlighted region.

## Success Criteria

Users can fully manage highlights after creation.

---

✅ Feature 1 — Manual Code Selection
✅ Feature 2 — Highlight Command
✅ Feature 3 — Color Selection
✅ Feature 4 — Visual Highlighting
✅ Feature 5 — Persistence
✅ Feature 6 — Session Restoration
✅ Feature 7 — Unlimited Highlights
✅ Feature 8 — Remove Highlight
✅ Feature 9 — Edit Highlight Color

---

# Explicitly Out of Scope

The following features are intentionally excluded from the product vision:

- Hover Notes
- Popup Notes
- Embedded Notes
- Annotation Editors
- Rich Text Notes
- Note Databases
- Documentation Management Systems

Reason:

VS Code already supports comments.

Developers naturally document code using existing language comment syntax.

CodeGlow focuses exclusively on visual code highlighting and highlight management.

Keeping the scope narrow ensures a simple, fast, and focused user experience.

---

# Technical Challenge

## Highlight Position Tracking

Problem:

A highlight created at one location may become inaccurate after code modifications.

Example:

A highlight originally stored at line 50 may shift to line 70 after edits.

### Future Solution

Use VS Code document change events to track and update highlight ranges dynamically.

This challenge does not block the initial marketplace release but must be considered during implementation.

---

# Final Product Vision

CodeGlow should feel like using a highlighter on a textbook.

Developers write explanations using comments.

CodeGlow visually marks the exact code being discussed.

Nothing more.

Nothing less.

---

# Technical Stack

## VS Code APIs

- Text Decorations API
- Commands API
- Context Menus API
- Tree View API (V3)
- Workspace Storage API

## Core Components

- package.json
- Extension Commands
- Color Picker Menu
- Decoration Manager
- Persistence Layer
- Highlight Storage
- Publish Pipeline

---

# Release Plan

Version 1 → Marketplace Release

Version 2 → Notes & Annotation Release
