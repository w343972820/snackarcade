/* FreeCell Solitaire — SnackArcade build, MIT License
 * Pure vanilla JS. No build step, no dependencies.
 */
(function () {
    'use strict';

    var SUITS = ['spades', 'hearts', 'diamonds', 'clubs'];
    var SYM = { spades: '♠', hearts: '♥', diamonds: '♦', clubs: '♣' };
    var RED = { hearts: true, diamonds: true, spades: false, clubs: false };
    var RANK_LABEL = { 1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: 'J', 12: 'Q', 13: 'K' };

    var state = null;
    var moves = 0;

    function colorOf(suit) { return RED[suit] ? 'red' : 'black'; }

    function makeDeck() {
        var deck = [];
        for (var s = 0; s < SUITS.length; s++) {
            for (var r = 1; r <= 13; r++) {
                deck.push({ suit: SUITS[s], rank: r, id: SUITS[s] + r });
            }
        }
        return deck;
    }

    function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
        return arr;
    }

    function newGame() {
        var deck = shuffle(makeDeck());
        var tableau = [[], [], [], [], [], [], [], []];
        for (var i = 0; i < deck.length; i++) {
            tableau[i % 8].push(deck[i]);
        }
        state = {
            freecells: [null, null, null, null],
            foundations: { spades: [], hearts: [], diamonds: [], clubs: [] },
            tableau: tableau,
            selected: null
        };
        moves = 0;
        render();
        setStatus('New game dealt — 52 cards, good luck!');
    }

    function snapshot() {
        return {
            freecells: state.freecells.slice(),
            foundations: {
                spades: state.foundations.spades.slice(),
                hearts: state.foundations.hearts.slice(),
                diamonds: state.foundations.diamonds.slice(),
                clubs: state.foundations.clubs.slice()
            },
            tableau: state.tableau.map(function (c) { return c.slice(); })
        };
    }

    function pushHistory() {
        state._history = state._history || [];
        state._history.push(snapshot());
        if (state._history.length > 200) state._history.shift();
    }

    function undo() {
        if (!state._history || state._history.length === 0) {
            setStatus('Nothing to undo.');
            return;
        }
        var snap = state._history.pop();
        state.freecells = snap.freecells;
        state.foundations = snap.foundations;
        state.tableau = snap.tableau;
        state.selected = null;
        render();
        setStatus('Move undone.');
    }

    function canToFoundation(card) {
        return state.foundations[card.suit].length === card.rank - 1;
    }

    function canToTableau(card, colIdx) {
        var col = state.tableau[colIdx];
        if (col.length === 0) return true;
        var top = col[col.length - 1];
        return colorOf(top.suit) !== colorOf(card.suit) && top.rank === card.rank + 1;
    }

    function isSelected(card) {
        return state.selected && state.selected.card.id === card.id;
    }

    function selectTableauCard(colIdx, pos) {
        var col = state.tableau[colIdx];
        if (pos !== col.length - 1) {
            if (state.selected) { tryMoveToTableau(colIdx); }
            else { setStatus('You can only pick up the top card of a column.'); }
            return;
        }
        var card = col[pos];
        if (state.selected && state.selected.card.id === card.id) {
            state.selected = null;
        } else {
            state.selected = { from: 'tableau', col: colIdx, card: card };
        }
        render();
    }

    function selectFreeCard(idx) {
        var card = state.freecells[idx];
        if (!card) return;
        if (state.selected && state.selected.card.id === card.id) {
            state.selected = null;
        } else {
            state.selected = { from: 'free', idx: idx, card: card };
        }
        render();
    }

    function removeSelected() {
        var sel = state.selected;
        if (sel.from === 'free') {
            state.freecells[sel.idx] = null;
        } else {
            state.tableau[sel.col].pop();
        }
    }

    function tryMoveToFree(idx) {
        if (!state.selected) return;
        if (state.freecells[idx] !== null) { setStatus('That free cell is occupied.'); return; }
        pushHistory();
        var card = state.selected.card;
        removeSelected();
        state.freecells[idx] = card;
        state.selected = null;
        moves++;
        afterMove();
    }

    function tryMoveToFoundation(suit) {
        if (!state.selected) return;
        var card = state.selected.card;
        if (card.suit !== suit) { setStatus('Foundations are organised by suit.'); return; }
        if (!canToFoundation(card)) { setStatus('Cards go up by rank, starting with the Ace.'); return; }
        pushHistory();
        removeSelected();
        state.foundations[suit].push(card);
        state.selected = null;
        moves++;
        afterMove();
    }

    function tryMoveToTableau(colIdx) {
        if (!state.selected) return;
        var card = state.selected.card;
        if (!canToTableau(card, colIdx)) {
            setStatus('Stack must alternate colour and go down one rank.');
            return;
        }
        pushHistory();
        removeSelected();
        state.tableau[colIdx].push(card);
        state.selected = null;
        moves++;
        afterMove();
    }

    function autoMove(card, from, colOrIdx) {
        if (canToFoundation(card)) {
            pushHistory();
            if (from === 'free') state.freecells[colOrIdx] = null;
            else state.tableau[colOrIdx].pop();
            state.foundations[card.suit].push(card);
            moves++;
            afterMove();
            return true;
        }
        for (var i = 0; i < state.freecells.length; i++) {
            if (state.freecells[i] === null) {
                pushHistory();
                if (from === 'free') state.freecells[colOrIdx] = null;
                else state.tableau[colOrIdx].pop();
                state.freecells[i] = card;
                moves++;
                state.selected = null;
                afterMove();
                return true;
            }
        }
        setStatus('Nowhere obvious to send it — place it yourself.');
        return false;
    }

    function afterMove() {
        render();
        if (checkWin()) {
            showWin();
            return;
        }
        setStatus('Moves: ' + moves);
    }

    function checkWin() {
        for (var s = 0; s < SUITS.length; s++) {
            if (state.foundations[SUITS[s]].length !== 13) return false;
        }
        return true;
    }

    /* ---------- Rendering ---------- */

    function cardEl(card, attrs) {
        var el = document.createElement('div');
        el.className = 'card ' + colorOf(card.suit) + (isSelected(card) ? ' selected' : '');
        el.dataset.zone = attrs.zone;
        if (attrs.col !== undefined) el.dataset.col = attrs.col;
        if (attrs.pos !== undefined) el.dataset.pos = attrs.pos;
        if (attrs.idx !== undefined) el.dataset.idx = attrs.idx;
        if (attrs.suit !== undefined) el.dataset.suit = attrs.suit;
        el.dataset.has = '1';
        el.innerHTML =
            '<div class="card__corner">' + RANK_LABEL[card.rank] +
            '<span class="s">' + SYM[card.suit] + '</span></div>' +
            '<div class="card__pip">' + SYM[card.suit] + '</div>';
        return el;
    }

    function emptySlot(attrs, label) {
        var el = document.createElement('div');
        el.className = 'slot' + (attrs.zone === 'found' ? ' slot--foundation' : '');
        el.dataset.zone = attrs.zone;
        if (attrs.idx !== undefined) el.dataset.idx = attrs.idx;
        if (attrs.col !== undefined) el.dataset.col = attrs.col;
        if (attrs.suit !== undefined) el.dataset.suit = attrs.suit;
        el.dataset.has = '0';
        if (label) {
            var h = document.createElement('span');
            h.className = 'slot__hint';
            h.textContent = label;
            el.appendChild(h);
        }
        return el;
    }

    function render() {
        var freeEl = document.getElementById('freecells');
        var foundEl = document.getElementById('foundations');
        var tabEl = document.getElementById('tableau');
        freeEl.innerHTML = '';
        foundEl.innerHTML = '';
        tabEl.innerHTML = '';

        for (var i = 0; i < 4; i++) {
            var c = state.freecells[i];
            if (c) freeEl.appendChild(cardEl(c, { zone: 'free', idx: i }));
            else freeEl.appendChild(emptySlot({ zone: 'free', idx: i }, 'Free'));
        }

        for (var s = 0; s < SUITS.length; s++) {
            var pile = state.foundations[SUITS[s]];
            var top = pile.length ? pile[pile.length - 1] : null;
            if (top) foundEl.appendChild(cardEl(top, { zone: 'found', suit: SUITS[s] }));
            else foundEl.appendChild(emptySlot({ zone: 'found', suit: SUITS[s] }, SUITS[s].slice(0, 1).toUpperCase()));
        }

        for (var col = 0; col < 8; col++) {
            var column = state.tableau[col];
            var colEl = document.createElement('div');
            colEl.className = 'tableau__col';
            colEl.dataset.zone = 'tableau';
            colEl.dataset.col = col;
            if (state.selected && (state.selected.from === 'tableau') && col !== state.selected.col) {
                var testCard = state.selected.card;
                if (canToTableau(testCard, col)) colEl.classList.add('drop-ok');
            }
            for (var p = 0; p < column.length; p++) {
                var card = column[p];
                var ce = cardEl(card, { zone: 'tableau', col: col, pos: p });
                if (p === column.length - 1) ce.classList.add('moveable');
                colEl.appendChild(ce);
            }
            if (column.length === 0) {
                var ph = emptySlot({ zone: 'tableau', col: col }, '');
                ph.style.height = 'var(--card-h)';
                colEl.appendChild(ph);
            }
            tabEl.appendChild(colEl);
        }
    }

    function setStatus(msg) {
        var el = document.getElementById('status');
        if (el) el.textContent = msg;
    }

    function showWin() {
        var win = document.createElement('div');
        win.className = 'win';
        win.innerHTML = '<div class="win__title">You win!</div>' +
            '<div class="win__sub">Solved in ' + moves + ' moves.</div>';
        var btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = 'Play again';
        btn.onclick = function () { document.body.removeChild(win); newGame(); };
        win.appendChild(btn);
        document.body.appendChild(win);
        setStatus('Solved in ' + moves + ' moves!');
    }

    /* ---------- Events ---------- */

    function onClick(e) {
        var zoneEl = e.target.closest('[data-zone]');
        if (!zoneEl) return;
        var zone = zoneEl.dataset.zone;

        if (zone === 'tableau') {
            var col = +zoneEl.dataset.col;
            if (zoneEl.dataset.has === '1') {
                selectTableauCard(col, +zoneEl.dataset.pos);
            } else {
                tryMoveToTableau(col);
            }
        } else if (zone === 'free') {
            var idx = +zoneEl.dataset.idx;
            if (zoneEl.dataset.has === '1') selectFreeCard(idx);
            else tryMoveToFree(idx);
        } else if (zone === 'found') {
            tryMoveToFoundation(zoneEl.dataset.suit);
        }
    }

    function onDblClick(e) {
        var zoneEl = e.target.closest('[data-zone]');
        if (!zoneEl || zoneEl.dataset.has !== '1') return;
        var zone = zoneEl.dataset.zone;
        if (zone === 'tableau') {
            var col = +zoneEl.dataset.col;
            var c = state.tableau[col][state.tableau[col].length - 1];
            if (c) autoMove(c, 'tableau', col);
        } else if (zone === 'free') {
            var i = +zoneEl.dataset.idx;
            var fc = state.freecells[i];
            if (fc) autoMove(fc, 'free', i);
        }
    }

    function init() {
        document.getElementById('new-game').addEventListener('click', newGame);
        document.getElementById('undo').addEventListener('click', undo);
        document.getElementById('app').addEventListener('click', onClick);
        document.getElementById('app').addEventListener('dblclick', onDblClick);
        newGame();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Test hook: lets the automated verifier drive the real game logic under
    // Node. Harmless in the browser (just attaches an object to globalThis).
    if (typeof globalThis !== 'undefined') {
        globalThis.__FreeCellTest = {
            makeDeck: makeDeck,
            newGame: newGame,
            getState: function () { return state; },
            canToFoundation: canToFoundation,
            canToTableau: canToTableau,
            tryMoveToFoundation: tryMoveToFoundation,
            tryMoveToTableau: tryMoveToTableau,
            tryMoveToFree: tryMoveToFree,
            undo: undo,
            checkWin: checkWin,
            SUITS: SUITS
        };
    }
})();
