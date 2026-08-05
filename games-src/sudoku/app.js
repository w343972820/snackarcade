/**
 * Sudoku — playable game assembled on the sudoku.js engine (MIT).
 * The interface code in this file is original to this site (MIT).
 *
 * sudoku.js represents a board as an 81-character string where '.' is empty.
 * Rows are A-I and columns 1-9, so index = rowIndex * 9 + colIndex.
 */
(function () {
  'use strict';

  var boardEl = document.getElementById('board');
  var statusEl = document.getElementById('status');
  var difficultyEl = document.getElementById('difficulty');
  var newGameBtn = document.getElementById('new-game');
  var checkBtn = document.getElementById('check');
  var solveBtn = document.getElementById('solve');
  var clearBtn = document.getElementById('clear');
  var eraseBtn = document.getElementById('erase');

  /** Current puzzle string (with '.' for blanks). */
  var puzzle = '';
  /** Solution string for the current puzzle. */
  var solution = '';
  /** Cells the player has filled (not part of the original givens). */
  var filled = {};
  /** Currently selected cell index (0-80). */
  var selected = null;
  /** True after the player asked for the solution. */
  var solved = false;

  /** Build the 9x9 grid of <div class="cell"> elements. */
  function buildBoard() {
    boardEl.innerHTML = '';
    for (var i = 0; i < 81; i += 1) {
      var cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = String(i);
      cell.addEventListener('click', function () {
        selectCell(Number(this.dataset.index));
      });
      boardEl.appendChild(cell);
    }
  }

  /** Reset all per-puzzle state and re-render. */
  function newPuzzle() {
    puzzle = window.sudoku.generate(difficultyEl.value);
    solution = window.sudoku.solve(puzzle);
    filled = {};
    selected = null;
    solved = false;
    statusEl.textContent = '';
    render();
  }

  /** Paint the board from the current state. */
  function render() {
    var cells = boardEl.children;
    for (var i = 0; i < 81; i += 1) {
      var value = puzzle[i];
      var isGiven = value !== '.';
      var text = '';
      var cls = 'cell';

      if (solved) {
        text = solution[i];
      } else if (isGiven) {
        text = value;
      } else if (filled[i] !== undefined) {
        text = filled[i];
      }

      if (i === selected) cls += ' selected';
      if (selected !== null && filled[i] === undefined && !isGiven) {
        // highlight peers sharing the same number as the selected cell
        var selValue = getCellValue(selected);
        if (selValue && getCellValue(i) === selValue) cls += ' same';
      }
      if (isGiven) cls += ' given';
      if (!isGiven && filled[i] !== undefined) cls += ' hint';
      if (!solved && !isGiven && filled[i] !== undefined && filled[i] !== solution[i]) {
        cls += ' error';
      }

      cells[i].className = cls;
      cells[i].textContent = text;
    }
  }

  /** Read the displayed value of a cell (given, filled, or solution when solved). */
  function getCellValue(i) {
    if (solved) return solution[i];
    if (puzzle[i] !== '.') return puzzle[i];
    return filled[i] !== undefined ? filled[i] : null;
  }

  /** Move the selection highlight to cell i. */
  function selectCell(i) {
    selected = i;
    render();
  }

  /** Write a digit (or erase) into the selected cell. */
  function inputDigit(d) {
    if (selected === null || solved) return;
    var i = selected;
    if (puzzle[i] !== '.') return; // givens cannot be edited
    if (d === null || d === '') {
      delete filled[i];
    } else {
      filled[i] = d;
    }
    render();
  }

  /** Validate the current board against the solution. */
  function checkBoard() {
    var wrong = 0;
    for (var i = 0; i < 81; i += 1) {
      if (puzzle[i] === '.' && filled[i] !== undefined && filled[i] !== solution[i]) {
        wrong += 1;
      }
    }
    if (wrong === 0) {
      // check completeness
      var complete = true;
      for (var j = 0; j < 81; j += 1) {
        if (getCellValue(j) === null) { complete = false; break; }
      }
      if (complete) {
        statusEl.textContent = 'Perfect — puzzle solved!';
      } else {
        statusEl.textContent = 'Everything so far is correct. Keep going!';
      }
    } else {
      statusEl.textContent = wrong + ' incorrect cell' + (wrong > 1 ? 's' : '') + ' highlighted in red.';
    }
    render();
  }

  /** Reveal the solution (marks the game as solved). */
  function solveBoard() {
    solved = true;
    selected = null;
    statusEl.textContent = 'Solution shown.';
    render();
  }

  /** Clear all player-entered digits (keep the givens). */
  function clearBoard() {
    filled = {};
    solved = false;
    statusEl.textContent = '';
    render();
  }

  // ---- Wiring ----
  buildBoard();
  newGameBtn.addEventListener('click', newPuzzle);
  checkBtn.addEventListener('click', checkBoard);
  solveBtn.addEventListener('click', solveBoard);
  clearBtn.addEventListener('click', clearBoard);
  eraseBtn.addEventListener('click', function () { inputDigit(null); });
  difficultyEl.addEventListener('change', newPuzzle);

  // Numpad digit buttons.
  var digitButtons = document.querySelectorAll('.numpad button[data-n]');
  for (var k = 0; k < digitButtons.length; k += 1) {
    digitButtons[k].addEventListener('click', function () {
      inputDigit(this.dataset.n);
    });
  }

  // Keyboard support.
  document.addEventListener('keydown', function (e) {
    if (/^[1-9]$/.test(e.key)) {
      inputDigit(e.key);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      inputDigit(null);
    } else if (e.key === 'ArrowUp' && selected !== null && selected >= 9) {
      selectCell(selected - 9);
    } else if (e.key === 'ArrowDown' && selected !== null && selected <= 71) {
      selectCell(selected + 9);
    } else if (e.key === 'ArrowLeft' && selected !== null && selected % 9 > 0) {
      selectCell(selected - 1);
    } else if (e.key === 'ArrowRight' && selected !== null && selected % 9 < 8) {
      selectCell(selected + 1);
    }
  });

  // Start with a fresh puzzle.
  newPuzzle();
})();
