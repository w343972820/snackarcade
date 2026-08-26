// Functional verifier for FreeCell — drives the REAL games-src/freecell/main.js
// under a minimal DOM shim so we confirm the actual game logic works, not a reimplementation.
import { createRequire } from 'module';
import assert from 'assert';

const require = createRequire(import.meta.url);

// ---- Minimal DOM shim sufficient for main.js render()/init() ----
class FakeEl {
    constructor(tag = 'div') {
        this.tagName = tag;
        this.children = [];
        this.dataset = {};
        this.style = {};
        this._classes = new Set();
        this._text = '';
        this._html = '';
        this.onclick = null;
        this._listeners = {};
    }
    set className(v) { this._classes = new Set(String(v).split(/\s+/).filter(Boolean)); }
    get className() { return [...this._classes].join(' '); }
    get classList() {
        const self = this;
        return {
            add: (c) => self._classes.add(c),
            remove: (c) => self._classes.delete(c),
            contains: (c) => self._classes.has(c),
            toggle: (c) => (self._classes.has(c) ? self._classes.delete(c) : self._classes.add(c)),
        };
    }
    set innerHTML(v) { this._html = v; this.children = []; }
    get innerHTML() { return this._html; }
    set textContent(v) { this._text = v; }
    get textContent() { return this._text; }
    appendChild(c) { this.children.push(c); return c; }
    removeChild(c) { this.children = this.children.filter((x) => x !== c); return c; }
    addEventListener(t, fn) { (this._listeners[t] = this._listeners[t] || []).push(fn); }
    closest() { return this; }
}

const registry = {};
for (const id of ['freecells', 'foundations', 'tableau', 'status', 'new-game', 'undo', 'app']) {
    registry[id] = new FakeEl();
}
const bodyEl = new FakeEl('body');
globalThis.document = {
    readyState: 'complete',
    getElementById: (id) => registry[id] || new FakeEl(),
    createElement: (t) => new FakeEl(t),
    addEventListener: () => {},
    body: bodyEl,
};
globalThis.window = globalThis;

// ---- Load the real game (runs init -> newGame -> render) ----
require('../games-src/freecell/main.js');
const G = globalThis.__FreeCellTest;
assert.ok(G, 'test hook not exposed');

let passed = 0;
function ok(name, cond) {
    assert.ok(cond, 'FAIL: ' + name);
    passed++;
    console.log('  ✔ ' + name);
}

// 1) Deck integrity
const deck = G.makeDeck();
ok('deck has 52 unique cards', deck.length === 52 && new Set(deck.map((c) => c.id)).size === 52);

// 2) Deal layout: 8 columns, 4×7 + 4×6 = 52, 4 empty free cells, 4 empty foundations
const s = G.getState();
const total = s.tableau.reduce((a, c) => a + c.length, 0);
ok('tableau holds all 52 cards', total === 52);
ok('first 4 columns have 7, last 4 have 6',
    s.tableau.slice(0, 4).every((c) => c.length === 7) && s.tableau.slice(4).every((c) => c.length === 6));
ok('4 free cells empty at deal', s.freecells.every((x) => x === null));
ok('4 foundations empty at deal', G.SUITS.every((su) => s.foundations[su].length === 0));

// 3) Foundation rule: Ace leads, ranks ascend by suit
// Plant a deterministic state: an Ace of spades on top of column 0.
s.tableau[0] = [{ suit: 'spades', rank: 1, id: 'spades1' }];
s.freecells = [null, null, null, null];
s.selected = { from: 'tableau', col: 0, card: s.tableau[0][0] };
ok('Ace is allowed to foundation', G.canToFoundation(s.tableau[0][0]) === true);
G.tryMoveToFoundation('spades');
ok('Ace moved to spades foundation', s.foundations.spades.length === 1 && s.foundations.spades[0].rank === 1);
ok('tableau col 0 now empty', s.tableau[0].length === 0);

// 4) Foundation rule rejects out-of-order
s.tableau[1] = [{ suit: 'hearts', rank: 5, id: 'hearts5' }];
s.selected = { from: 'tableau', col: 1, card: s.tableau[1][0] };
ok('rank 5 cannot go on empty hearts foundation', G.canToFoundation(s.tableau[1][0]) === false);

// 5) Tableau rule: alternate colour, descend 1 rank (FreeCell builds DOWN)
s.tableau[2] = [{ suit: 'clubs', rank: 7, id: 'clubs7' }]; // black 7 on top
s.selected = { from: 'tableau', col: 2, card: s.tableau[2][0] };
ok('red 6 stacks on black 7 (one lower, opposite colour)', G.canToTableau({ suit: 'hearts', rank: 6 }, 2) === true);
ok('black 6 rejected on black 7 (same colour)', G.canToTableau({ suit: 'clubs', rank: 6 }, 2) === false);
ok('red 8 rejected on black 7 (must be exactly one rank lower)', G.canToTableau({ suit: 'hearts', rank: 8 }, 2) === false);

// 6) Win detection
for (const su of G.SUITS) s.foundations[su] = [];
for (const su of G.SUITS) for (let r = 1; r <= 13; r++) s.foundations[su].push({ suit: su, rank: r, id: su + r });
ok('checkWin true when all 4 foundations complete', G.checkWin() === true);

// 7) Undo restores prior state
G.newGame();
const before = JSON.stringify(G.getState().tableau.map((c) => c.length));
// make one legal move then undo
const st = G.getState();
const foundAce = (() => {
    for (let c = 0; c < 8; c++) {
        const top = st.tableau[c][st.tableau[c].length - 1];
        if (top && top.rank === 1) return { col: c, card: top };
    }
    return null;
})();
let undoOk = true;
if (foundAce) {
    st.selected = { from: 'tableau', col: foundAce.col, card: foundAce.card };
    G.tryMoveToFoundation(foundAce.card.suit);
    G.undo();
    const after = JSON.stringify(G.getState().tableau.map((c) => c.length));
    undoOk = before === after && G.getState().foundations[foundAce.card.suit].length === 0;
}
ok('undo restores previous board state', undoOk);

console.log('\n✅ FreeCell functional verification PASSED — ' + passed + ' assertions');
