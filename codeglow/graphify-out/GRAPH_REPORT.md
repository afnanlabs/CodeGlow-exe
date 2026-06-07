# Graph Report - .  (2026-06-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 115 nodes · 168 edges · 20 communities (15 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `96c01ce8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 15|Community 15]]

## God Nodes (most connected - your core abstractions)
1. `HighlightColor` - 9 edges
2. `SerializedRange` - 8 edges
3. `compilerOptions` - 7 edges
4. `CodeGlow Logo` - 6 edges
5. `HighlightEntry` - 5 edges
6. `scripts` - 4 edges
7. `repository` - 3 edges
8. `contributes` - 3 edges
9. `generateId()` - 3 edges
10. `engines` - 2 edges

## Surprising Connections (you probably didn't know these)
- `CodeGlow Logo` --references--> `codeglow.highlight`  [EXTRACTED]
  media/icon.png → README.md
- `CodeGlow Logo` --references--> `codeglow.removeHighlight`  [EXTRACTED]
  media/icon.png → README.md
- `CodeGlow Logo` --references--> `codeglow.changeColor`  [EXTRACTED]
  media/icon.png → README.md
- `CodeGlow Logo` --references--> `Intelligent Range Tracking`  [EXTRACTED]
  media/icon.png → README.md
- `CodeGlow Logo` --references--> `Persistent Highlights`  [EXTRACTED]
  media/icon.png → README.md

## Import Cycles
- None detected.

## Communities (20 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (24): activationEvents, categories, description, devDependencies, @types/vscode, typescript, @vscode/vsce, displayName (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.21
Nodes (4): colorOptions, HighlightColorPickItem, showColorPicker(), HighlightColor

### Community 4 - "Community 4"
Cohesion: 0.22
Nodes (9): CodeGlow Logo, CodeGlow UI Preview, codeglow.changeColor, codeglow.highlight, codeglow.removeHighlight, Intelligent Range Tracking, Persistent Highlights, activate (+1 more)

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (8): compilerOptions, lib, module, outDir, rootDir, strict, target, exclude

### Community 7 - "Community 7"
Cohesion: 0.50
Nodes (4): contributes, commands, menus, editor/context

## Knowledge Gaps
- **39 isolated node(s):** `recommendations`, `name`, `displayName`, `description`, `version` (+34 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `HighlightColor` connect `Community 2` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `recommendations`, `name`, `displayName` to the rest of the system?**
  _39 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._