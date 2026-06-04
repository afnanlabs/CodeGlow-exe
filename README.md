# CodeGlow

> Highlight code the way you think about it.

CodeGlow is a VS Code extension that lets you manually highlight code regions with persistent colors.

Unlike syntax highlighting, CodeGlow highlights are created by you and remain available across editor sessions.

![CodeGlow Example](./info/codeglow-example.png)

---

## Features

- 🎨 Highlight any code selection
- 💾 Automatic persistence
- 🔄 Restore highlights on restart
- 📍 Highlight tracking during code edits
- 🟨 Yellow, 🟥 Red, 🟩 Green, 🟦 Blue highlights
- ♾️ Multiple highlights per file
- 🗑️ Remove highlights
- 🔁 Change highlight colors

---

## Commands

| Command                          | Description                |
| -------------------------------- | -------------------------- |
| CodeGlow: Highlight Selection    | Highlight selected code    |
| CodeGlow: Remove Highlight       | Remove highlight at cursor |
| CodeGlow: Change Highlight Color | Change highlight color     |

Commands are available through:

- Right-click Context Menu
- Command Palette (`Ctrl+Shift+P`)

---

## Installation

### Marketplace

Search for:

```text
CodeGlow
```

in the VS Code Extensions Marketplace.

### VSIX

```bash
code --install-extension codeglow-x.x.x.vsix
```

---

## Usage

1. Select code.
2. Right-click.
3. Choose **CodeGlow: Highlight Selection**.
4. Pick a color.

That's it.

Highlights are saved automatically.

---

## Built With

- TypeScript
- VS Code Extension API
- Workspace State Persistence

---

## License

MIT
