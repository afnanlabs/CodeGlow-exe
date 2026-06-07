// ========================================================================
// 🧪 GROUP 1: BASIC ACTIONS & COLORS
// ========================================================================

// 📌 TEST 1 — Apply Highlight
// Steps:
// 1. Select the exact text: return a + b;
// 2. Right Click
// 3. CodeGlow → Apply Highlight
// 4. Choose Yellow
// Expected: Yellow background appears.

function add(a, b) {
  return a + b;
}

// 📌 TEST 2 — Multiple Highlights
// Steps:
// 1. Highlight text "NEW_TARGET_WORD" below -> Right Click -> CodeGlow → Apply Highlight -> Blue ✅
// 2. Highlight text "return a * b;" below -> Right Click -> CodeGlow → Apply Highlight -> Green ✅
// 3. Highlight text "throw new Error..." below -> Right Click -> CodeGlow → Apply Highlight -> Red ✅
// Expected: All 4 highlights visible simultaneously.

// 📌 TEST 3 — Remove Highlight
// Steps:
// 1. Put cursor inside: TARGET_WORD (Do not select text)
// 2. Right Click
// 3. CodeGlow → Remove Highlight
// Expected: Only blue highlight disappears. Others remain. ✅

// 📌 TEST 7 — Enter Above Highlight ✅
// Steps:
// 1. (Re-apply Blue highlight to TARGET_WORD if you removed it in Test 3)
// 2. Put cursor here: on the comment line directly above TARGET_WORD.
// 3. Press: Enter, Enter, Enter
// Expected: Highlight moves down 3 lines.

// 📌 TEST 8 — Backspace Above Highlight ✅
// Steps:
// 1. Delete the 3 new lines you just created in Test 7.
// Expected: Highlight moves back up.

// 📌 TEST 9 — Same Line Enter Bug ✅
// Steps:
// 1. Put cursor before: TARGET_WORD on the same line.
// 2. Press: Enter
// Expected: Highlight should remain visible. No disappearance.

// 📌 TEST 10 — Character Edit Inside Highlight ❎
// Steps:
// 1. Change: TARGET_WORD to NEW_TARGET_WORD
// Expected: Highlight remains stable or expands. No crash or disappearing.

// 📌 TEST 12 — No Selection ✅
// Steps:
// 1. Place cursor somewhere (No selection)
// 2. Right Click -> CodeGlow → Apply Highlight
// Expected: Error message: "Please select a code region before applying a highlight."

// TARGET_WORD

// 📌 TEST 4 — Change Color ✅
// Steps:
// 1. Cursor inside: return a * b;
// 2. Right Click -> CodeGlow → Change Highlight Color
// 3. Select Red
// Expected: Green becomes Red. Range remains identical.

function multiply(a, b) {
  return a * b;
}

// ========================================================================
// 🧪 GROUP 2: PERSISTENCE & EDGE CASES
// ========================================================================

// 📌 TEST 5 — Persistence
// Steps:
// 1. Create several highlights.
// 2. Save file.
// 3. Close Extension Host.
// 4. Start again (F5).
// Expected: All highlights restored.

// 📌 TEST 11 — Escape Color Picker ✅
// Steps:
// 1. Select the word "divide" below.
// 2. Right Click -> CodeGlow → Apply Highlight
// 3. Press ESC
// Expected: No highlight created. No error shown.

// 📌 TEST 13 — Cursor Outside Highlight ✅
// Steps:
// 1. Put cursor inside the word "Error" below (Unhighlighted line).
// 2. Right Click -> CodeGlow → Remove Highlight
// Expected: Error message: "No highlight found at the current cursor position."

// TEST BLOCK B

function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");
  }

  return a / b;
}

/*
Here is the clean list of all tasks by number and title based on your checklist:

* **TEST 1:** Apply Highlight ✅
* **TEST 2:** Multiple Highlights ✅
* **TEST 3:** Remove Highlight ✅
* **TEST 4:** Change Color ✅
* **TEST 5:** Persistence ✅
* **TEST 6:** Switch Tabs ✅
* **TEST 7:** Enter Above Highlight ✅
* **TEST 8:** Backspace Above Highlight✅
* **TEST 9:** Same Line Enter Bug ✅
* **TEST 10:** Character Edit Inside Highlight ❎ [V1 Expected means past]
* **TEST 11:** Escape Color Picker ✅
* **TEST 12:** No Selection ✅
* **TEST 13:** Cursor Outside Highlight ✅

*/
