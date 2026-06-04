# 4. UI/UX Design Brief

## 4.1 Design Philosophy

CodeGlow must feel like a native VS Code feature — not a third-party add-on. Every interaction must follow VS Code UX patterns. The extension should be invisible when not in use and immediately accessible when needed.

- No custom panels, sidebars, or webviews in V1/V2.
- No modals, dialogs, or popups beyond VS Code's native Quick Pick and `showInformationMessage`.
- Zero configuration required out of the box.
- The only visual output is the colored background decoration on code.

## 4.2 Native VS Code Experience Principles

| Principle              | Implementation                                                                    |
| ---------------------- | --------------------------------------------------------------------------------- |
| Use platform patterns  | `showQuickPick` for all user choices — consistent with built-in VS Code menus     |
| Minimal chrome         | No icons on status bar, no custom views, no dedicated panel                       |
| Progressive disclosure | Commands only appear in context menu and palette — not in visible UI at all times |
| Non-destructive        | Highlights can be removed; original code is never modified                        |
| Silent success         | Applying a highlight requires no confirmation — the visual result is the feedback |
| Helpful failure        | Errors and empty states always show a clear message via `showInformationMessage`  |

## 4.3 Context Menu Behavior

Commands are added to the `editor/context` menu contribution point. They appear in the context menu under a "CodeGlow" group, separated from built-in items by a separator.

```json
"contributes": {
  "menus": {
    "editor/context": [
      { "command": "codeglow.highlight", "group": "codeglow@1" },
      { "command": "codeglow.removeHighlight", "group": "codeglow@2" },
      { "command": "codeglow.changeColor", "group": "codeglow@3" }
    ]
  }
}
```

The group string `"codeglow@N"` places all three commands together and separates them from VS Code's built-in context menu items.

## 4.4 Command Palette Behavior

All three commands appear in the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) prefixed with `"CodeGlow:"` for easy discovery.

- `"CodeGlow: Highlight Selection"`
- `"CodeGlow: Remove Highlight"`
- `"CodeGlow: Change Highlight Color"`

## 4.5 Color Picker (Quick Pick)

The Quick Pick menu is triggered by `showQuickPick()`. It is a native VS Code dropdown that appears at the top-center of the editor window. No custom UI is required.

- Title: `"Select Highlight Color"`
- Placeholder: `"Choose a color for this highlight"`
- 4 items, each with a codicon circle icon and a descriptive label.
- Pressing Escape cancels with no effect.

## 4.6 Visual Design of Highlights

| Color  | Background RGBA         | Opacity Rationale                         | Intended Semantic Use    |
| ------ | ----------------------- | ----------------------------------------- | ------------------------ |
| Yellow | `rgba(255,235,59,0.35)` | Bright but readable through syntax colors | Primary flow, key logic  |
| Red    | `rgba(244,67,54,0.30)`  | Noticeable, not alarming                  | Error handling, risk     |
| Green  | `rgba(76,175,80,0.30)`  | Positive, calm                            | Valid path, admin logic  |
| Blue   | `rgba(33,150,243,0.30)` | Neutral, informational                    | Cleanup, utilities, info |

Opacity is set to `0.30–0.35` so that syntax coloring, cursor highlights, and search highlights remain visible through the CodeGlow decoration. Full-opacity fills would obscure readability.

## 4.7 Accessibility Considerations

- All colors chosen have sufficient contrast against both light and dark VS Code themes.
- Highlights are supplemental to — not a replacement for — comments. Users who cannot distinguish colors can still read the comment text.
- All commands are fully accessible via keyboard (Command Palette + Enter).
- No hover-only interactions exist in V1/V2.
- Screen reader compatibility: VS Code's decoration API does not expose custom decorations to the accessibility tree; this is a platform limitation, not a CodeGlow deficiency.

## 4.8 Dark Theme vs Light Theme

The RGBA values chosen work in both VS Code dark and light themes. Because the opacity is below `0.4`, the underlying token colors remain dominant, and the highlight acts as a subtle tint rather than a solid block.

No theme-specific overrides are needed for V1/V2.
