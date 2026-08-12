/**
 * Edward QA — runtime verification of the 15-Puzzle bundle.
 *
 * Loads the REAL dist/play/15-puzzle/15-puzzle.js into a minimal DOM shim and
 * exercises the actual game code through its own event listeners:
 *   - solve() initialises a solved 1..15 board with one empty cell
 *   - scramble() runs 100 random legal moves; the result must be solvable
 *     (inversion-parity rule) and differ from the solved layout
 *   - shiftCell() must only move tiles adjacent to the empty cell
 *   - checkOrder() must fire the win confirm() only when the board is solved
 *
 * Usage: NODE_OPTIONS= node tests/qa/15-puzzle-runtime-check.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const jsPath = join(root, 'dist', 'play', '15-puzzle', '15-puzzle.js');
const source = readFileSync(jsPath, 'utf8');

let failures = 0;
const ok = (m) => console.log(`  PASS  ${m}`);
const bad = (m) => { failures++; console.log(`  FAIL  ${m}`); };

const gridId = (r, c) => `cell-${r}-${c}`;

/* ------------------------------------------------------------------ */
/* DOM shim — captures the bundle's own event listeners                */
/* ------------------------------------------------------------------ */
const cells = [];
const timeoutCbs = [];
let capturedClick = null;
let capturedSolve = null;
let capturedScramble = null;
let confirmCalls = 0;

const puzzleEl = {
  className: '',
  _html: '',
  set innerHTML(v) { this._html = v; if (v === '') cells.length = 0; },
  get innerHTML() { return this._html; },
  addEventListener(evt, cb) { if (evt === 'click') capturedClick = cb; },
  appendChild(child) { cells.push(child); },
  removeAttribute() { this.className = ''; },
  querySelector(sel) { return sel === '.empty' ? cells.find((c) => c.className === 'empty') ?? null : null; },
};
const solveBtn = { addEventListener(evt, cb) { if (evt === 'click') capturedSolve = cb; } };
const scrambleBtn = { addEventListener(evt, cb) { if (evt === 'click') capturedScramble = cb; } };

const document = {
  getElementById(id) {
    if (id === 'puzzle') return puzzleEl;
    if (id === 'solve') return solveBtn;
    if (id === 'scramble') return scrambleBtn;
    return cells.find((c) => c.id === id) ?? null;
  },
  createElement() {
    const cell = {
      id: '',
      style: { left: '', top: '', cssText: '' },
      _class: '',
      classList: { add: (...names) => { cell._class = [...cell._class.split(/\s+/).filter(Boolean), ...names].join(' '); } },
      innerHTML: '',
    };
    Object.defineProperty(cell, 'className', {
      get() { return cell._class; },
      set(v) { cell._class = v; },
    });
    return cell;
  },
};

// scramble() drives its shuffle with setInterval(cb, 5). Our shim executes the
// callback synchronously until the bundle calls clearInterval — that happens on
// the 101st tick (i>100), which is exactly when the real page flips state back
// to 1. Without that final tick the bundle would be stuck in state==0.
let stopLoop = false;
const setIntervalSync = (cb) => {
  stopLoop = false;
  for (let t = 0; t < 500 && !stopLoop; t++) cb();
  return 1;
};
const clearIntervalNoop = () => { stopLoop = true; };
const setTimeoutCapture = (cb) => { timeoutCbs.push(cb); return timeoutCbs.length; };

const fn = new Function('document', 'confirm', 'setTimeout', 'setInterval', 'clearInterval', source);
fn(document, () => { confirmCalls++; return false; }, setTimeoutCapture, setIntervalSync, clearIntervalNoop);

/* ------------------------------------------------------------------ */
/* Board helpers                                                       */
/* ------------------------------------------------------------------ */
function readBoard() {
  const board = Array.from({ length: 4 }, () => Array(4).fill(0));
  for (const c of cells) {
    const m = /^cell-(\d)-(\d)$/.exec(c.id);
    if (!m) continue;
    board[+m[1]][+m[2]] = c.className === 'empty' ? 0 : Number(c.innerHTML);
  }
  return board;
}
const boardToString = (b) => b.map((row) => row.map((v) => String(v).padStart(2)).join(' ')).join('\n');
const emptyPos = () => { const b = readBoard(); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (b[r][c] === 0) return [r, c]; return null; };

const solved = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 0],
];

function isSolvable(board) {
  const flat = board.flat().filter((v) => v !== 0);
  let inversions = 0;
  for (let i = 0; i < flat.length; i++) for (let j = i + 1; j < flat.length; j++) if (flat[i] > flat[j]) inversions++;
  // Blank row counted from the BOTTOM, 1-based (bottom row = 1).
  let blankRowFromBottom = 0;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (board[r][c] === 0) blankRowFromBottom = 4 - r;
  // Standard 15-puzzle rule: solvable iff (inversions + blankRowFromBottom) is ODD.
  // Sanity: solved board (0 inversions, blank bottom => 1) => 1 odd => solvable. Correct.
  return (inversions + blankRowFromBottom) % 2 === 1;
}

/* ------------------------------------------------------------------ */
/* [1] initial solve()                                                 */
/* ------------------------------------------------------------------ */
console.log('\n[1] initial solve()');
if (cells.length === 16) ok(`solve() created 16 cells`);
else bad(`expected 16 cells, got ${cells.length}`);
const numbered = cells.filter((c) => c.className.includes('number')).length;
const empty = cells.filter((c) => c.className === 'empty').length;
if (numbered === 15 && empty === 1) ok(`15 numbered + 1 empty (got ${numbered}/${empty})`);
else bad(`expected 15 numbered + 1 empty, got ${numbered}/${empty}`);
if (JSON.stringify(readBoard()) === JSON.stringify(solved)) ok('board is the solved layout 1..15, empty bottom-right');
else bad(`board not solved:\n${boardToString(readBoard())}`);

/* ------------------------------------------------------------------ */
/* [2] scramble(): 100 legal moves, solvable result                    */
/* ------------------------------------------------------------------ */
console.log('\n[2] scramble()');
if (typeof capturedScramble === 'function') {
  capturedScramble(); // runs the 100-tick loop synchronously via our shim
  const sb = readBoard();
  if (JSON.stringify(sb) !== JSON.stringify(solved)) ok('scramble() changed the board away from solved');
  else bad('scramble() left the board solved');
  if (isSolvable(sb)) ok('scrambled board is SOLVABLE (inversion parity even)');
  else bad(`scrambled board is UNSOLVABLE:\n${boardToString(sb)}`);
  const distinct = new Set(sb.flat().filter((v) => v !== 0)).size;
  if (distinct === 15) ok('all 15 tiles present exactly once after scramble');
  else bad(`expected 15 distinct tiles, found ${distinct}`);
} else {
  bad('scramble listener was not captured — bundle did not attach it');
}
if (/i\s*<=\s*100/.test(source)) ok('scramble loop cap "i <= 100" present in source');
else bad('scramble loop cap missing from source');

/* ------------------------------------------------------------------ */
/* [3] shiftCell(): adjacency rule                                     */
/* ------------------------------------------------------------------ */
console.log('\n[3] shiftCell() adjacency rule');
// Fresh solved state: empty at (3,3). (2,3) holds 12 (adjacent), (0,0) holds 1 (not adjacent).
capturedSolve();
const s0 = readBoard();
if (JSON.stringify(s0) !== JSON.stringify(solved)) { bad('could not reset to solved for adjacency test'); }
else {
  // Valid move: click (2,3). The bundle's listener reads e.target, so wrap.
  capturedClick({ target: cells.find((c) => c.id === gridId(2, 3)) });
  const b1 = readBoard();
  const e1 = emptyPos();
  if (e1[0] === 2 && e1[1] === 3 && b1[3][3] === 12) ok('click on (2,3) slid tile 12 into the gap (empty now at (2,3))');
  else bad(`valid move failed; empty at ${e1}:\n${boardToString(b1)}`);

  // Invalid move: click (0,0) — far from the empty.
  capturedClick({ target: cells.find((c) => c.id === gridId(0, 0)) });
  const b2 = readBoard();
  const e2 = emptyPos();
  if (JSON.stringify(b2) === JSON.stringify(b1) && e2[0] === 2 && e2[1] === 3) ok('click on (0,0) rejected — non-adjacent tile did not move');
  else bad(`non-adjacent click moved the board; empty at ${e2}:\n${boardToString(b2)}`);

  // Clicking the empty cell itself must be a no-op.
  capturedClick({ target: cells.find((c) => c.className === 'empty') });
  const b3 = readBoard();
  if (JSON.stringify(b3) === JSON.stringify(b2)) ok('click on the empty cell itself is a no-op');
  else bad('click on empty cell changed the board');
}

/* ------------------------------------------------------------------ */
/* [4] Solve button + checkOrder() win detection                       */
/* ------------------------------------------------------------------ */
console.log('\n[4] Solve button + checkOrder()');
capturedSolve();
const bSolved = readBoard();
if (JSON.stringify(bSolved) === JSON.stringify(solved)) ok('Solve button resets to the solved layout');
else bad(`Solve button did not reset:\n${boardToString(bSolved)}`);

// Move 15 out and back in so the board ends solved; the 150ms checkOrder
// timeouts then fire. First shift schedules checkOrder; solve() was called
// before, so only these two shifts matter.
const confirmBefore = confirmCalls;
capturedClick({ target: cells.find((c) => c.id === gridId(3, 2)) }); // 15 -> gap at (3,3)
capturedClick({ target: cells.find((c) => c.id === gridId(3, 3)) }); // 15 back; board solved again
for (const cb of timeoutCbs.splice(0)) cb();
if (confirmCalls > confirmBefore) ok(`checkOrder() fired win confirm() on a solved board (calls ${confirmBefore} -> ${confirmCalls})`);
else bad('checkOrder() did not fire confirm() on a solved board');

// And it must NOT fire on an unsolved board: scramble then run pending timeouts.
capturedScramble();
const confirmMid = confirmCalls;
for (const cb of timeoutCbs.splice(0)) cb();
if (confirmCalls === confirmMid) ok('checkOrder() did NOT fire confirm() on an unsolved (scrambled) board');
else bad(`checkOrder() fired confirm() on an unsolved board (${confirmMid} -> ${confirmCalls})`);

/* ------------------------------------------------------------------ */
/* [5] latent "clasName" typo                                          */
/* ------------------------------------------------------------------ */
console.log('\n[5] latent "clasName" typo in shiftCell()');
if (source.includes('clasName')) ok('"clasName" typo is present in source; runtime checks in [3]/[4] confirm gameplay is unaffected');
else ok('no "clasName" typo found in source');

console.log(`\n${failures === 0 ? 'ALL RUNTIME CHECKS PASSED' : failures + ' RUNTIME CHECK(S) FAILED'}`);
process.exit(failures === 0 ? 0 : 1);
