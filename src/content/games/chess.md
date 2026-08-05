---
title: "Chess"
h1: "Play Chess Online — Free Against Computer or a Friend"
draft: false

seo:
  title: "Play Chess Online Free — No Sign Up | SnackArcade"
  description: "Play chess free in your browser against the computer or a friend on the same device. Legal move highlighting, full rules and beginner tips. No download."
  targetKeywords:
    - play chess online
    - chess vs computer
    - chess no sign up
    - 2 player chess same computer
    - chess for beginners
  noindexOverride: false

media:
  cover: ../../assets/games/chess/cover.png
  coverAlt: "Chess board at the starting position with all pieces set up for a game"
  aspectRatio: [16, 9]

source:
  sourceType: self_hosted
  bundlePath: games-src/chess
  entryFile: index.html
  bundleFileCount: 20
  bundleBytes: 249494

taxonomy:
  primaryCategory: card-board
  categories:
    - card-board
    - 2-player
  tags:
    - classic
    - strategy
    - two-player
    - no-download
    - brain-training
    - open-source
    - no-signup
    - mobile-friendly
  mechanics:
    - piece-movement
    - checkmate
    - opening-theory

content:
  intro: >-
    Chess is the oldest strategy game on the internet and still one of the best two-player
    experiences you can have in a browser tab. This version lets you play against a
    computer opponent or against a friend on the same device, with legal moves highlighted
    and the rules enforced for you. No account, no download, no waiting for an opponent —
    just open the board and move. If you have never played before, the rules below take
    about five minutes to learn, and the computer opponent gives you a safe place to
    practise.

  about:
    - >-
      Chess has been played in some form for over a thousand years and is played by
      hundreds of millions of people today. The goal is simple: trap the opponent's king
      so it cannot escape capture. Every piece moves differently, and the depth of the game
      comes from combining those simple movements into plans that unfold over many turns.
    - >-
      This browser version combines two well-known open-source components: the chessboard
      interface from chessboard.js by Chris Oakman, released under the MIT licence, and the
      move validation engine from chess.js by Jeff Hlywa, released under the BSD-2-Clause
      licence. Together they give you a board that highlights legal moves, rejects illegal
      ones and understands every rule, from castling to en passant.
    - >-
      Because everything runs locally in your browser, there is no account to create and no
      server to wait for. You can play the computer for as long as you like, or set up a
      two-player game on one screen and pass the device back and forth. It is the fastest
      way to get from "wanting to play chess" to actually moving pieces.

  howToPlay:
    - step: "Set up the board."
      detail: >-
        White starts on the bottom two rows and Black on the top two. Rooks go in the
        corners, then knights, bishops, and the queen on her own colour, with the king in
        the last square.
    - step: "Move a piece."
      detail: >-
        Click a piece to see its legal moves highlighted, then click a highlighted square to
        move there. The game refuses illegal moves, so you can learn by trying.
    - step: "Capture the opponent's pieces."
      detail: >-
        Move onto a square occupied by an enemy piece to capture it and remove it from the
        board. You cannot capture your own pieces and you cannot move through pieces.
    - step: "Checkmate to win."
      detail: >-
        A king is in check when it is attacked. If the king is in check and has no legal
        escape — no safe square, no block, no capture of the attacker — it is checkmate and
        the game is over.
    - step: "Play against the computer or a friend."
      detail: >-
        Choose the computer opponent for a solo game at your own pace, or play two-player
        on the same device and take turns moving.

  controls:
    - action: "Select a piece"
      desktop: "Click a piece"
      mobile: "Tap a piece"
    - action: "Move a piece"
      desktop: "Click a highlighted destination square"
      mobile: "Tap a highlighted destination square"
    - action: "See legal moves"
      desktop: "Highlighted squares appear when a piece is selected"
      mobile: "Highlighted squares appear when a piece is selected"
    - action: "Undo a move"
      desktop: "Click the Undo button"
      mobile: "Tap the Undo button"
    - action: "Restart the game"
      desktop: "Click the New Game button"
      mobile: "Tap the New Game button"
    - action: "Play against the computer"
      desktop: "Choose Computer from the game mode selector"
      mobile: "Choose Computer from the game mode selector"
    - action: "Play two player"
      desktop: "Choose Two Player from the game mode selector"
      mobile: "Choose Two Player from the game mode selector"
    - action: "Fullscreen"
      desktop: "Click the fullscreen button above the board"
      mobile: "Tap the fullscreen button above the board"
    - action: "Exit fullscreen"
      desktop: "Escape key"
      mobile: "Tap the fullscreen button again"

  tips:
    - title: "Control the centre early"
      body: >-
        The four central squares give your pieces the most freedom and restrict your
        opponent's. Opening moves like pushing the king's pawn or the queen's pawn fight
        for the centre from the very first turn.
    - title: "Develop pieces before moving pawns"
      body: >-
        Bring out your knights and bishops early, castle your king to safety, and only then
        start an attack. Beginners who move the same piece twice or push too many pawns
        fall behind on development.
    - title: "Never leave the king exposed"
      body: >-
        Castling early tucks the king behind a wall of pawns and connects your rooks. A
        king stuck in the centre is the most common target of a quick checkmate.
    - title: "Think before you capture"
      body: >-
        Every capture is also a move of your own piece to a possibly dangerous square. Check
        whether the opponent can recapture something bigger before you take their pawn.
    - title: "Look for checks and threats after every move"
      body: >-
        After each of your moves and each of your opponent's, ask: is anything hanging, is
        anyone in check, is there a mate threat? Answering that question every turn prevents
        most blunders.
    - title: "Trade pieces when you are ahead"
      body: >-
        If you have captured more material than your opponent, exchanging pieces simplifies
        the position and makes your advantage easier to convert into a win.

  features:
    - "Play against the computer or a friend on the same device"
    - "Legal moves highlighted so beginners learn by doing"
    - "Full rule enforcement including castling and en passant"
    - "Runs entirely in your browser with no download or account"
    - "Open source components credited on this page"

  faq:
    - q: "Is chess free to play here?"
      a: >-
        Yes, completely. This page is free to play with no payment, no sign-up and no premium
        tier. The open-source components are credited with links to their repositories.
    - q: "Can I play chess against the computer?"
      a: >-
        Yes. The game includes a computer opponent, so you can practise alone without waiting
        for another player or creating an account.
    - q: "Can two people play on the same computer?"
      a: >-
        Yes. Choose the two-player mode and both players share the same board, taking turns
        and passing the device back and forth.
    - q: "Do I need to know the rules to start?"
      a: >-
        No. Legal moves are highlighted when you select a piece, and illegal moves are
        rejected, so you can learn the movement rules by trying. The guide above explains
        the basics first.
    - q: "What chess rules are enforced?"
      a: >-
        The engine understands all standard rules including castling, en passant, promotion
        and checkmate. It is the widely used open-source chess.js engine.
    - q: "Can I play chess on my phone?"
      a: >-
        Yes. Tap a piece and tap a highlighted destination to move. The board works in both
        portrait and landscape on mobile browsers.
    - q: "What other board games are on this site?"
      a: >-
        If you enjoy head-to-head strategy, Four in a Row is a quicker two-player game on
        the same category page, and Klondike Solitaire offers a solo card challenge.

info:
  developer: "Chris Oakman & Jeff Hlywa"
  released: "2013"
  genre:
    - Board
    - Strategy
  players: MultiPlayer
  technology: "HTML5 / JavaScript"
  platform:
    - Desktop
    - Tablet
    - Mobile browser
  avgSessionMinutes: 20

license:
  license: MIT
  licenseUrl: "https://github.com/oakmac/chessboardjs/blob/master/LICENSE.md"
  author: "Chris Oakman"
  authorUrl: "https://github.com/oakmac"
  sourceUrl: "https://github.com/oakmac/chessboardjs"
  assetsLicense: "Board UI MIT (chessboard.js); move engine BSD-2-Clause (chess.js by Jeff Hlywa); piece images are the standard Wikipedia SVG set distributed with chessboard.js under MIT"
  attributionRendered: "Board: chessboard.js by Chris Oakman (MIT) · Engine: chess.js by Jeff Hlywa (BSD-2-Clause)"
  verifiedAt: 2026-08-04

ratings:
  count: 0

publishedAt: 2026-08-04
updatedAt: 2026-08-04
---

Chess rewards the player who asks the right question after every single move: what changed
on the board since last turn? The rules are simple, the board is honest, and every game is
a conversation of threats and replies that you can join in five minutes and study for a
lifetime.
