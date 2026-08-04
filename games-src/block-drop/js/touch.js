/**
 * Touch controls for Block Drop.
 *
 * ADDED BY SNACKARCADE — this file is not part of the upstream project. It is
 * purely additive: it maps touch gestures onto the exact same `keyPress()`
 * entry point the keyboard handler already uses, and it does not modify, wrap
 * or override any upstream game logic.
 *
 * Upstream author and licence: see LICENSE.md in this folder.
 * Recorded in games-src/manifest.json under "modifications".
 *
 * Gestures:
 *   swipe left / right  -> move
 *   swipe down          -> soft drop (one row)
 *   flick down (fast)   -> hard drop
 *   tap                 -> rotate
 */
(function () {
  'use strict';

  var canvas = document.querySelector('canvas');
  if (!canvas || typeof window.keyPress !== 'function') {
    return;
  }

  /** Minimum px travelled before a gesture counts as a swipe, not a tap. */
  var SWIPE_THRESHOLD = 24;
  /** A downward swipe faster than this (px per ms) is treated as a hard drop. */
  var FLICK_VELOCITY = 0.6;
  /** Horizontal repeat distance: one column step per this many px dragged. */
  var STEP_PX = 28;

  var startX = 0;
  var startY = 0;
  var startTime = 0;
  var lastStepX = 0;
  var moved = false;

  /**
   * Sends a control action into the game and repaints immediately, mirroring
   * what js/controller.js does for keyboard input.
   * @param {string} action One of: left, right, down, rotate, drop.
   * @returns {void}
   */
  function send(action) {
    window.keyPress(action);
    if (typeof window.render === 'function') {
      window.render();
    }
  }

  canvas.addEventListener(
    'touchstart',
    function (event) {
      var touch = event.changedTouches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      lastStepX = touch.clientX;
      startTime = Date.now();
      moved = false;
      event.preventDefault();
    },
    { passive: false }
  );

  canvas.addEventListener(
    'touchmove',
    function (event) {
      var touch = event.changedTouches[0];
      var dx = touch.clientX - lastStepX;
      var totalY = touch.clientY - startY;

      // Horizontal dragging moves the piece one column per STEP_PX travelled,
      // so a long drag slides several columns the way players expect.
      while (Math.abs(dx) >= STEP_PX) {
        send(dx > 0 ? 'right' : 'left');
        lastStepX += dx > 0 ? STEP_PX : -STEP_PX;
        dx = touch.clientX - lastStepX;
        moved = true;
      }

      // Slow downward drag = soft drop, one row per STEP_PX.
      if (totalY > STEP_PX && Math.abs(touch.clientX - startX) < STEP_PX) {
        send('down');
        startY = touch.clientY;
        moved = true;
      }

      event.preventDefault();
    },
    { passive: false }
  );

  canvas.addEventListener(
    'touchend',
    function (event) {
      var touch = event.changedTouches[0];
      var dx = touch.clientX - startX;
      var dy = touch.clientY - startY;
      var elapsed = Math.max(1, Date.now() - startTime);
      var velocityY = dy / elapsed;

      if (dy > SWIPE_THRESHOLD && velocityY >= FLICK_VELOCITY && Math.abs(dx) < SWIPE_THRESHOLD) {
        send('drop');
      } else if (!moved && Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
        send('rotate');
      }

      event.preventDefault();
    },
    { passive: false }
  );

  // Stop the page rubber-banding behind the board while playing on iOS.
  canvas.style.touchAction = 'none';
})();
