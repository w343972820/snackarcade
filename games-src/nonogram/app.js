/**
 * Nonogram — playable game assembled on the Nonogram library by Zhou Qi (MIT).
 * The puzzle selection and wiring in this file are original to this site (MIT).
 *
 * Interaction: click = fill a cell, right-click = mark a cell empty,
 * click the round controller button (bottom-right) to switch the brush,
 * click the arrow controller to refresh/reset the puzzle.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   *  Puzzle definitions. Grids use 1 = filled, 0 = empty.
   * ------------------------------------------------------------------ */
  var PUZZLES = [
    {
      name: 'Heart (5×5)',
      grid: [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
      ],
    },
    {
      name: 'Smiley (7×7)',
      grid: [
        [0, 1, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [0, 1, 1, 1, 1, 1, 0],
      ],
    },
    {
      name: 'Fish (8×8)',
      grid: [
        [0, 0, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 1, 0, 1, 1, 1],
        [0, 0, 1, 1, 0, 0, 0, 1],
        [0, 1, 1, 1, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 0, 1],
        [0, 1, 1, 1, 0, 0, 0, 1],
        [0, 0, 1, 0, 0, 0, 1, 1],
        [0, 0, 1, 0, 0, 0, 1, 0],
      ],
    },
    {
      name: 'Mushroom (10×10)',
      grid: [
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
        [1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
        [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
        [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
      ],
    },
    {
      name: 'Flag (10×10)',
      grid: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      ],
    },
    {
      name: 'Duck (12×12)',
      grid: [
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1],
        [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
        [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      ],
    },
  ];

  /* ------------------------------------------------------------------ *
   *  Hint computation — turn a 0/1 grid into row and column hints.
   * ------------------------------------------------------------------ */
  function lineHints(line) {
    var hints = [];
    var run = 0;
    for (var i = 0; i < line.length; i += 1) {
      if (line[i] === 1) {
        run += 1;
      } else if (run > 0) {
        hints.push(run);
        run = 0;
      }
    }
    if (run > 0) hints.push(run);
    return hints;
  }

  function gridHints(grid) {
    var rows = grid.map(lineHints);
    var cols = [];
    for (var c = 0; c < grid[0].length; c += 1) {
      var column = [];
      for (var r = 0; r < grid.length; r += 1) column.push(grid[r][c]);
      cols.push(lineHints(column));
    }
    return { row: rows, column: cols };
  }

  /* ------------------------------------------------------------------ *
   *  Wiring
   * ------------------------------------------------------------------ */
  var selectEl = document.getElementById('puzzle-select');
  var newBtn = document.getElementById('new-puzzle');
  var checkBtn = document.getElementById('check');
  var statusEl = document.getElementById('status');
  var currentGame = null;
  var currentHints = null;

  // Populate the dropdown.
  PUZZLES.forEach(function (puzzle, index) {
    var option = document.createElement('option');
    option.value = String(index);
    option.textContent = puzzle.name;
    selectEl.appendChild(option);
  });

  /** Build a fresh nonogram.Game for the selected puzzle. */
  function startPuzzle() {
    var puzzle = PUZZLES[Number(selectEl.value)];
    var hints = gridHints(puzzle.grid);
    currentHints = hints;
    statusEl.textContent = '';

    currentGame = new nonogram.Game(
      hints.row,
      hints.column,
      'board',
      {
        theme: {
          filledColor: '#0ebeff',
          correctColor: '#47cf73',
          wrongColor: '#ff3c41',
          isMeshed: true,
          boldMeshGap: 3,
        },
        onSuccess: function () {
          statusEl.textContent = 'Solved! Well done.';
        },
      }
    );
  }

  /** Verify the current board against the hints. */
  function checkBoard() {
    if (!currentGame) return;
    var rowsOk = true;
    var colsOk = true;
    for (var r = 0; r < currentGame.hints.row.length; r += 1) {
      if (!currentGame.isLineCorrect('row', r)) rowsOk = false;
    }
    for (var c = 0; c < currentGame.hints.column.length; c += 1) {
      if (!currentGame.isLineCorrect('column', c)) colsOk = false;
    }
    if (rowsOk && colsOk) {
      statusEl.textContent = 'All lines match the clues — puzzle complete!';
    } else {
      statusEl.textContent = 'Some lines do not match yet. Keep going!';
    }
  }

  selectEl.addEventListener('change', startPuzzle);
  newBtn.addEventListener('click', startPuzzle);
  checkBtn.addEventListener('click', checkBoard);

  startPuzzle();
})();
