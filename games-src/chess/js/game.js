/**
 * Chess — playable assembly built on two MIT/BSD open-source components:
 *   - chessboard.js  (board UI, MIT)  https://github.com/oakmac/chessboardjs
 *   - chess.js       (move engine, BSD-2-Clause) https://github.com/jhlywa/chess.js
 *
 * The code in THIS file is original to this site and is released under the
 * same permissive spirit (MIT).
 */
import { Chess, WHITE, BLACK } from './chess.js';

/* ------------------------------------------------------------------ *
 *  Simple computer opponent
 * ------------------------------------------------------------------ */

// Piece values used by the shallow search.
const PIECE_VALUE = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

// A small piece-square table for each piece to reward central control.
const PST = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  n: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  b: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  r: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  q: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  k: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
};

/** Evaluate the position from White's point of view. */
function evaluateBoard(game) {
  let score = 0;
  const board = game.board();
  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      const square = board[r][c];
      if (!square) continue;
      const { type, color } = square;
      const base = PIECE_VALUE[type] ?? 0;
      // PST rows are written from White's side (rank 0 = 8th rank).
      const pstRow = color === WHITE ? 7 - r : r;
      const pst = PST[type]?.[pstRow]?.[c] ?? 0;
      const sign = color === WHITE ? 1 : -1;
      score += sign * (base + pst);
    }
  }
  return score;
}

/** Simple negamax search with a shallow depth. */
function search(game, depth, alpha, beta, colorSign) {
  if (game.isCheckmate()) {
    // Losing side to move: very bad for the side that just moved.
    return -100000 + (100 - depth);
  }
  if (game.isDraw() || game.isStalemate()) return 0;
  if (depth === 0) return colorSign * evaluateBoard(game);

  let best = -Infinity;
  const moves = game.moves({ verbose: true });
  // Order captures first for a modest speed-up.
  moves.sort((a, b) => ((b.captured ? PIECE_VALUE[b.captured] : 0) + (b.promotion ? 800 : 0)) -
    ((a.captured ? PIECE_VALUE[a.captured] : 0) + (a.promotion ? 800 : 0)));

  for (const move of moves) {
    game.move(move);
    const value = -search(game, depth - 1, -beta, -alpha, -colorSign);
    game.undo();
    if (value > best) best = value;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

/** Pick the engine's move for the side to move. */
export function engineMove(game, depth = 2) {
  const colorSign = game.turn() === WHITE ? 1 : -1;
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;
  moves.sort((a, b) => ((b.captured ? PIECE_VALUE[b.captured] : 0) + (b.promotion ? 800 : 0)) -
    ((a.captured ? PIECE_VALUE[a.captured] : 0) + (a.promotion ? 800 : 0)));

  let bestMove = moves[0];
  let bestValue = -Infinity;
  for (const move of moves) {
    game.move(move);
    const value = -search(game, depth - 1, -Infinity, Infinity, -colorSign);
    game.undo();
    if (value > bestValue) {
      bestValue = value;
      bestMove = move;
    }
  }
  return bestMove;
}

/* ------------------------------------------------------------------ *
 *  Game controller
 * ------------------------------------------------------------------ */

const game = new Chess();
let mode = 'computer'; // 'computer' | 'two'
let engineThinking = false;
let history = [];

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const movesEl = document.getElementById('moves');
const modeEl = document.getElementById('mode');
const newGameBtn = document.getElementById('new-game');
const undoBtn = document.getElementById('undo');

const board = window.Chessboard('board', {
  draggable: true,
  position: 'start',
  pieceTheme: 'img/chesspieces/wikipedia/{piece}.png',
  onDragStart,
  onDrop,
  onSnapEnd: () => board.position(game.fen()),
});

function onDragStart(source, piece) {
  if (engineThinking) return false;
  // No moving the opponent's pieces.
  if (game.isGameOver()) return false;
  if ((game.turn() === WHITE && piece.search(/^b/) !== -1) ||
      (game.turn() === BLACK && piece.search(/^w/) !== -1)) {
    return false;
  }
  // In computer mode, only allow dragging when it is the human's turn.
  if (mode === 'computer' && game.turn() !== WHITE) return false;

  const legal = game.moves({ square: source, verbose: true }).map((m) => m.to);
  highlightLegalMoves(legal);
  return legal.length > 0;
}

function onDrop(source, target) {
  removeHighlights();
  // Ignore drops onto the same square.
  if (source === target) return 'snapback';

  try {
    const move = game.move({ from: source, to: target, promotion: 'q' });
    if (!move) return 'snapback';
    history.push(move);
    updateStatus();
    renderMoves();
    if (mode === 'computer' && !game.isGameOver()) {
      scheduleEngine();
    }
  } catch {
    return 'snapback';
  }
  return undefined;
}

/** Highlight the legal destination squares for a selected piece. */
function highlightLegalMoves(squares) {
  removeHighlights();
  for (const sq of squares) {
    $(`[data-square="${sq}"]`).addClass('highlight-square');
  }
}

function removeHighlights() {
  $('.highlight-square').removeClass('highlight-square');
}

function scheduleEngine() {
  engineThinking = true;
  statusEl.textContent = 'Computer is thinking…';
  setTimeout(() => {
    const move = engineMove(game, 2);
    engineThinking = false;
    if (move) {
      game.move(move);
      history.push(move);
      board.position(game.fen());
      updateStatus();
      renderMoves();
    }
  }, 150);
}

function updateStatus() {
  if (game.isCheckmate()) {
    statusEl.textContent = `Checkmate — ${game.turn() === WHITE ? 'Black' : 'White'} wins!`;
  } else if (game.isStalemate()) {
    statusEl.textContent = 'Stalemate — draw.';
  } else if (game.isThreefoldRepetition() || game.isInsufficientMaterial()) {
    statusEl.textContent = 'Draw.';
  } else {
    const turn = game.turn() === WHITE ? 'White' : 'Black';
    const check = game.inCheck() ? ' (check!)' : '';
    statusEl.textContent = `${turn} to move${check}`;
  }
}

function renderMoves() {
  const moves = game.history();
  const lines = [];
  for (let i = 0; i < moves.length; i += 2) {
    const white = moves[i] ?? '';
    const black = moves[i + 1] ?? '';
    lines.push(`${Math.floor(i / 2) + 1}. ${white.padEnd(7)} ${black}`);
  }
  movesEl.textContent = lines.join('\n');
}

function resetGame() {
  game.reset();
  history = [];
  board.position('start');
  removeHighlights();
  updateStatus();
  renderMoves();
}

function undoMove() {
  if (engineThinking) return;
  // Undo two plies in computer mode (engine + human), one in two-player.
  if (mode === 'computer' && game.history().length >= 2) {
    game.undo();
    game.undo();
  } else if (mode === 'two' && game.history().length >= 1) {
    game.undo();
  } else if (game.history().length >= 1) {
    game.undo();
  }
  board.position(game.fen());
  removeHighlights();
  updateStatus();
  renderMoves();
}

modeEl.addEventListener('change', (e) => {
  mode = e.target.value;
  resetGame();
});
newGameBtn.addEventListener('click', resetGame);
undoBtn.addEventListener('click', undoMove);

// Add the small CSS class for legal-move dots.
const style = document.createElement('style');
style.textContent = `
  .highlight-square { box-shadow: inset 0 0 0 4px rgba(251, 191, 36, 0.65); }
`;
document.head.appendChild(style);

updateStatus();
