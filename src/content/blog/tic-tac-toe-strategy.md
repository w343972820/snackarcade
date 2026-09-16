---
title: "Tic Tac Toe Strategy: Why You Never Have to Lose"
seo:
  title: "Tic Tac Toe Strategy: Win, or Never Lose | SnackArcade"
  description: "Tic Tac Toe solved: why the centre sits on four winning lines, why a corner opening leaves your opponent one safe reply, and how forks actually win."
  keywords: ["tic tac toe strategy", "how to win tic tac toe", "tic tac toe fork", "tic tac toe best opening", "noughts and crosses strategy"]
relatedGameSlugs: ["tic-tac-toe"]
author: "SnackArcade Team"
draft: false
publishedAt: 2026-09-16
updatedAt: 2026-09-16
---

# Tic Tac Toe Strategy: Why You Never Have to Lose

Tic Tac Toe gets dismissed as a children's game, and there is a reason: the game is small enough to be solved completely, and when it was solved, the answer was that nobody has to lose. But "solvable" is not the same as "trivial". The gap between a player who knows the game is a draw and a player who can actually hold that draw against a determined opponent is exactly the gap this guide closes — and you can test every claim here on the [free Tic Tac Toe board](/games/tic-tac-toe/) against the computer or a friend.

## The Grid Is Not Nine Equal Squares

Most players see nine identical squares. They are not identical. Each square belongs to a different number of winning lines, and that number is the whole foundation of the game's strategy.

There are eight ways to win: three rows, three columns, and two diagonals. Count how many of those eight pass through each square:

| Square | Winning lines it sits on | Why it matters |
|---|---|---|
| Centre | **4** (middle row, middle column, both diagonals) | The single most valuable square on the board |
| Corner | **3** (one row, one column, one diagonal) | The next best — a corner threatens along two axes at once |
| Edge | **2** (one row, one column) | The weakest squares; they do the least work |

This is arithmetic, not opinion. A mark in the centre is part of four potential three-in-a-rows; a mark on the top-middle edge is part of only two. Every piece of strategy below follows from that table.

## Perfect Play Always Ends in a Draw

We ran an exhaustive search over the whole game — 549,946 reachable positions and 255,168 distinct ways a game can play out — and the result is unambiguous: with both sides playing perfectly, the final score is a draw. X moving first cannot force a win, and O cannot force one either.

That single fact reorganises how you should think about the game. You are not trying to play cleverly and hope; you are trying to be the player who does not make the mistake. In practice, the winner of a casual game is almost always the person who *avoided* an error, not the person who found a brilliant move.

## A Corner Opening Leaves Your Opponent One Safe Reply

Here is where the theory becomes practical. If X opens in a corner, how many of O's eight possible replies still hold a draw? The search says: exactly one. The centre. Play anywhere else — either edge or either of the other two corners — and X can force a win against perfect defence.

| X's opening move | Safe replies available to O |
|---|---|
| Corner | **1 of 8** (the centre only) |
| Centre | 4 of 8 (the four corners) |
| Edge | 4 of 8 |

A corner opening is therefore not "aggressive" in the usual sense. It is a filter: it converts a game with eight escape routes into a game with one, and casual opponents will pick the wrong door roughly seven times out of eight. That is why the corner is the strongest practical opening even though it never wins against a perfect opponent.

## If They Open in a Corner, Your Only Good Reply Is the Centre

Facing a corner opening, do not look for your own attack. Play the centre. That is the one reply the search leaves standing, and once the centre is yours the position is genuinely balanced.

The mistake to avoid is playing the opposite corner. It looks symmetric and inviting — the board appears to mirror itself — but symmetry here is a trap, because X has the move and you do not. X's next move will create a two-mark line with an open end, and you will spend the rest of the game reacting.

## If They Open in the Centre, Take a Corner, Not an Edge

Against a centre opening, four replies hold the draw: all four corners. The four edges all lose. The reason is the same table from earlier — a corner sits on three lines and gives you two directions to build in, while an edge sits on two and gives you one.

This is the single most common mistake among casual players: they answer a centre opening with an edge because it "looks tidy" next to the centre. It is not tidy; it is the losing move.

## The Fork Is the Only Way to Win

Against a careful opponent, you cannot win by building one line. They will see it and block it. You win by creating **two threats at once** — a position where you have two different lines each needing one more mark, so your opponent can only block one of them.

That is called a fork, and it is mathematically the only winning mechanism in the game. Everything else is preparation for it.

Forks are easy to understand once you see the geometry: a fork square is one that lies on two different lines that each already contain one of your marks. Because the centre sits on four lines, it is the most powerful fork square on the board — a single move there can complete two threats simultaneously. This is why the centre matters even when it is not part of your apparent plan.

## Threats, Open Twos and Dead Twos

Before you can fork, you have to be able to read a position. Three terms do most of the work.

- An **open two** is two of your marks in a line with both ends empty. It threatens nothing yet — your opponent can still block either end.
- A **live threat** is two of your marks in a line with one empty square that completes it. Your opponent must play that square now.
- A **dead two** is two of your marks in a line where the completing square is already taken by your opponent. It is no longer a threat at all.

The gap between an open two and a live threat is where games are decided. Adding a third mark to an open two turns it into a live threat, and two live threats at once is a fork. If you can do that in one move, you have won.

## How to Block Without Thinking

Blocking is mechanical, and you should not spend thought on it. After every single move — yours and theirs — scan the board for any line where your opponent has two marks and the completing square is empty. If one exists, that square is your move. No exceptions, no cleverness.

The only time you override this rule is when you have a fork available: if your move creates two live threats of your own, your opponent has to defend and you can ignore their single threat for one turn. The search confirms this is the only legitimate exception.

## Three Habits That Beat Casual Players

1. **Open in a corner.** It gives you a 7-in-8 chance of facing a losing reply, and it never hurts you against perfect play.
2. **Answer a corner opening with the centre, and a centre opening with a corner.** Memorise these two replies and you will stop losing in the first three moves.
3. **Look for the fork, not the line.** Ask "does this move create two threats?" rather than "does this move build my line?" The second question is how beginners play; the first is how the game is actually won.

Together these three habits cover the entire practical difference between a player who loses casually and a player who only ever draws.

## Practising Against the Computer

The human opponent in the room is a poor training partner because they make unpredictable mistakes — you learn nothing from a win you did not earn. Our [two-player Tic Tac Toe game](/games/tic-tac-toe/) also includes a computer opponent that plays a solid heuristic game, and that is a much better sparring partner: it will punish the edge opening, it will take the centre when you offer it, and it will fork you the moment your defence slips.

Play ten games against it. If you lose even one, you have found a gap in your blocking routine. If you draw ten in a row, you have genuinely learned the game.

## Tic Tac Toe as a Teaching Game

There is a reason this game survives in classrooms. Nine squares is small enough for a child to hold the whole position in their head, which means it teaches planning and blocking without any memory burden. The lessons transfer directly: the idea that some squares are worth more than others, that a threat must be answered, and that sometimes the correct ambition is not to win but to avoid losing.

If your child can reliably beat you, they are not lucky — they have noticed the centre, and you should teach them the corner opening next. When they outgrow the grid, the natural next steps are [Gomoku](/games/gomoku/), the same idea on a 15×15 board, and the [Four in a Row strategy guide](/blog/four-in-a-row-strategy/), which is the same lesson with gravity added. If they want a game with real positional depth, the [Checkers strategy guide](/blog/checkers-strategy/) is the next step up, and it teaches the same discipline about square value on a much larger board.

## Frequently Asked Questions

**Is Tic Tac Toe solved?** Yes, completely. Perfect play from both sides always produces a draw — verified by exhaustive search over all 255,168 possible games.

**What is the best first move?** A corner. With perfect play it draws like any other opening, but it leaves your opponent only one safe reply out of eight, while an edge opening leaves them four.

**Can the second player ever win?** Not against correct play. O's goal is to hold the draw, and the way to do that is to take the centre when X opens in a corner, or take a corner when X opens in the centre.

**What is a fork?** A move that creates two winning threats at once. Your opponent can only block one, so a fork wins the game. It is the only way to beat a player who defends correctly.

**Why do I keep losing when I play well?** Usually one of two things: an edge opening, or failing to block a live threat on the move it appears. Both are covered above.

**Does X always go first?** Yes, X moves first in this version and in the standard game. That first-move advantage is exactly why the opening choice matters as much as it does.

## Play It

The game only takes three minutes, which makes it the perfect thing to actually practise rather than read about. Open the [Tic Tac Toe board](/games/tic-tac-toe/) and try the corner opening against the computer — then try the edge opening and feel the difference. If you want the same line-building instinct on a bigger canvas, our [free chess board](/games/chess/) is the deeper version of the same idea, and the [chess basics guide](/blog/chess-basics-for-beginners/) covers the shared principles of centre control and tempo. Still deciding what to play next? The [full games library](/all-games/) lists everything on the site.
