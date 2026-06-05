/* TASK 1 : Testing Basic Actions & Colors
Paste this block of text into your test file to test applying, changing colors, and removing highlights.
========================================================================
TESTING BLOCK: APPLY, CHANGE COLOR, & REMOVE
========================================================================

1. Select this sentence completely. Open the Command Palette (Ctrl+Shift+P), 
   run "Apply Highlight", and verify it changes color.
   
2. Select this word: [SPECTACULAR]. Run "Change Highlight Color", 
   input a new color (like 'red' or '#00FF00'), and then highlight it 
   to see if the color updated. --- YES HERE first i changed the color to Red -> then Green and it worked perfectly fine.
     
3. [Click your cursor directly inside this sentence], run "Remove Highlight", 
   and ensure the background styling disappears completely. 
   this worked i literally colored this by yellow by selecting the whole sentence [Click your cursor directly inside this sentence] adn then just by clicking inside the higlighted part i pressed ctrl + shift + p and remove  highlight and it got removed

*/

// TASK 2 : Testing Persistence
// Paste this code block, highlight the specific markers, save, close, and reopen the file.
// ========================================================================
// TESTING BLOCK: PERSISTENCE (SAVE & REOPEN)
// ========================================================================

function checkPersistence() {
  // 1. Highlight the word 'CRITICAL_ERROR' below:
  const status = "CRITICAL_ERROR";

  // 2. Highlight the phrase 'flagged for review' below:
  console.log("This security instance has been flagged for review.");

  // ACTION REQUIRED:
  // Save this file as 'test.js', close the tab, and open it again.
  // EXPECTED: Both highlights should still be active when the file reopens.
}
// Output : Yes I saved the file and after-wards reopened it and still all the highlights were there

// TASK 3 : testing Highlight Tracking (Position Updates)
// Paste this code block, highlight the designated target text, and then follow the typing directions to see if the highlight accurately follows the code changes.

// TASK 3
// ========================================================================
// TESTING BLOCK: HIGHLIGHT TRACKING (EDITING TEXT)
// ========================================================================

function trackChanges() {
  console.log("Setup lines above the target...");

  // original position

  // 1. Highlight ONLY the text inside the brackets: [TARGET_HIGHLIGHT]
  const coreModule = "modified_TARGET_HIGHLIGHT";

  // 2. TEST LINE BREAKS: Put your cursor at the very beginning of line 8
  //    (where console.log is) and press Enter 3 or 4 times.
  //    -> The highlight on TARGET_HIGHLIGHT should move down cleanly.

  // 3. TEST INLINE EDITS: Click right before the 'T' in TARGET_HIGHLIGHT
  //    and type "modified_".
  //    -> The highlight should stay attached to the original string text.
  //   ❌ Character-level tracking
}
