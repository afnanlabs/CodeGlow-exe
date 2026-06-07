// ========================================================================
// 🛡️ GROUP 1: BOUNDARY & CRASH PROTECTION
// ========================================================================

// 📌 TEST A — Exact End Position Cursor Detection ✅
// Goal: Verify boundary tracking fix: range.contains(position) || position.isEqual(range.end)
// Steps:
// 1. Highlight ONLY the string: END_CURSOR_TEST
// 2. Click your mouse cursor EXACTLY on the right side of the last character 'T' (after 'T' but before the closing quote).
// 3. Right Click -> CodeGlow → Remove Highlight
// Expected:
// ✅ Highlight removed cleanly. (Passes the exact-end boundary check).

const message = "END_CURSOR_TEST";

// 📌 TEST B — Overlapping Deletion Removal ❎
// Goal: Verify deleted code blocks are cleanly purged instead of turning into zombie highlights.
// Steps:
// 1. Highlight ONLY the word: DELETE_ME
// 2. Select the entire line: const second = "DELETE_ME";
// 3. Hit the Delete or Backspace key to remove the whole line.
// Expected:
// ✅ Highlight disappears permanently. No floating backgrounds, ghost markers, or negative-range crashes.

function deleteTest() {
  const first = "SAFE_LINE";

  // Yes when i deleted the whole line but still ghost markes are there

  const third = "SAFE_LINE";
}

// 📌 TEST C — Persistence After Deletion ❎
// Goal: Ensure deleted highlights are wiped from storage, not just the screen.
// Steps:
// 1. Right after running TEST B, save this file (Ctrl + S).
// 2. Close the Extension Host window completely.
// 3. Relaunch (F5) and reopen 'audit-v3.js'.
// Expected:
// ✅ The deleted highlight never returns.

// 📌 TEST D — Corrupted Range Protection
// Goal: Verify structural type-guards prevent corrupted data structures from crashing rendering loop.
// Steps:
// 1. Apply a brand new highlight somewhere in this file and save.
// 2. Close VS Code entirely.
// 3. Open your global state storage location (Mementos/Settings).
// 4. Break the coordinates manually to: "startLine": -999 or "startLine": "abc".
// 5. Fire up VS Code (F5).
// Expected:
// ✅ Extension boots smoothly, ignores the poisoned node, and logs no fatal runtime exceptions.

// ========================================================================
// 🎨 GROUP 2: SCALE & RE-RENDERING SANITY
// ========================================================================

// 📌 TEST E — Multiple Color Decoration Cleanup ✅
// Goal: Verify stale decoration layers are completely disposed of when updated or deleted.
// Steps:
// 1. Highlight "YELLOW" -> Yellow, "RED" -> Red, "GREEN" -> Green, "BLUE" -> Blue.
// 2. Put cursor inside "GREEN" -> Right Click -> CodeGlow → Remove Highlight.
// 3. Put cursor inside "RED" -> Right Click -> CodeGlow → Change Highlight Color -> Blue.
// Expected:
// ✅ Green decoration object is completely freed. Red turns Blue seamlessly without leaving ugly color layering underneath.

const yellowWord = "YELLOW";
const redWord = "RED";
const greenWord = "GREEN";
const blueWord = "BLUE";

// 📌 TEST F — Massive Highlight Performance Test ✅
// Goal: Confirm optimized document parsing without typing lag or token drops.
// Steps:
// 1. Highlight 20 to 30 of the entries listed below using various colors.
// 2. Scroll up and down quickly, close the tab, and reopen it.
// Expected:
// ✅ 0ms frame lag, no missing highlight nodes, and all instances pop back up on restore.

const test_1 = "TEST_1";
const test_11 = "TEST_11";
const test_21 = "TEST_21";
const test_2 = "TEST_2";
const test_12 = "TEST_12";

const test_22 = "TEST_22";
const test_3 = "TEST_3";
const test_13 = "TEST_13";
const test_23 = "TEST_23";
const test_4 = "TEST_4";
const test_14 = "TEST_14";
const test_24 = "TEST_24";
const test_5 = "TEST_5";
const test_15 = "TEST_15";
const test_25 = "TEST_25";
const test_6 = "TEST_6";
const test_16 = "TEST_16";
const test_26 = "TEST_26";
const test_7 = "TEST_7";
const test_17 = "TEST_17";
const test_27 = "TEST_27";
const test_8 = "TEST_8";
const test_18 = "TEST_18";
const test_28 = "TEST_28";
const test_9 = "TEST_9";
const test_19 = "TEST_19";
const test_29 = "TEST_29";
const test_10 = "TEST_10";
const test_20 = "TEST_20";
const test_30 = "TEST_30";

// 📌 TEST G — Undo / Redo Tracking Sync ❎
// Goal: Check if content-change listeners evaluate natural editor rollbacks gracefully.
// Steps:
// 1. Highlight the string: UNDO_TEST
// 2. Place cursor on the blank line directly above it and hit Enter 5 times. Confirm highlight moves down.
// 3. Press Ctrl + Z exactly 5 times.
// Expected:
// ✅ The highlight moves back up synchronously to its precise original position without breaking tracking limits.

const target = "UNDO_TEST";

// 📌 TEST H — Empty Workspace Mode ✅✅
// Steps: 1. Click File → New Window to spawn a fresh instance.
// 2. Do NOT open any workspace folder or project directory.
// 3. Create a quick scratch file, type const test = "EMPTY_WORKSPACE";, and apply a highlight.
// Expected: * ✅ No workspace storage path crash. Global storage path fallbacks kick in smoothly.

// 📌 TEST I — Bundle Package Verification ✅
// Steps: 1. Open your development terminal in your root directory (CodeGlow-exe).
// 2. Execute the compilation step:

// Bash
// npm run compile
// (Verify: 0 structural errors generated).
// 3. Run the bundling utility to generate your direct plugin installer binary:

// Bash
// npm run package
// Expected: * ✅ Generates a clean compilation and outputs: DONE Packaged: codeglow-0.0.1.vsix with no packaging block errors.

// 📌 TEST J — Marketplace Asset Validation Checklist ✅
// Verify the following file trees exist in your root distribution directory before release gating:

// Required files: README.md, LICENSE, .vscodeignore, package.json, icon.png

// Required package.json Keys: ```json
// "publisher", "version", "description", "keywords", "license", "repository", "icon"

// Expected: * ✅ Zero warnings thrown when validated via vsce package.

/*
TEST A: Exact End Position Cursor Detection✅
TEST B: Overlapping Deletion Removal ✅
TEST C: Persistence After Removal ✅
TEST D: Corrupted Range Protection ✅
TEST E: Multiple Color Cleanup ✅
TEST F: Same File Massive Highlight Test ✅
TEST G: Undo/Redo Tracking ✅
TEST H: Empty Workspace ✅
TEST I: Package Verification ✅
TEST J: Marketplace Readiness ✅
*/
