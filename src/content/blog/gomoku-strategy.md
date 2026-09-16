---
title: "Gomoku Strategy: How to Win at Five in a Row"
seo:
  title: "Gomoku Strategy: Open Threes & Double Threats | SnackArcade"
  description: "Learn Gomoku strategy: why an open three is the strongest shape on the board, how double threats win games, and when to block a four instead of making one."
  keywords: ["gomoku strategy", "how to win gomoku", "five in a row strategy", "gomoku open three", "caro strategy", "gomoku tips"]
relatedGameSlugs: ["gomoku"]
author: "SnackArcade Team"
draft: false
publishedAt: 2026-09-16
updatedAt: 2026-09-16
---

# Gomoku Strategy: How to Win at Five in a Row

Gomoku looks like the simplest board game ever invented: place a stone, make five in a row. It is also, according to the players who take it seriously, not simple at all. The reason is that the board is enormous and the shapes that win games are specific — there are exactly four of them, and most casual players never learn their names. This guide covers the shapes, the threat ladder and the defensive order of operations, and you can test all of it on the [free Gomoku board](/games/gomoku/) against a friend on one screen.

## Why Gomoku Is Not Just Bigger Tic Tac Toe

If you have read our [Tic Tac Toe strategy guide](/blog/tic-tac-toe-strategy/), you already know that game has eight winning lines and can be solved completely. Gomoku has a different order of magnitude:

| | Tic Tac Toe | Gomoku (classic 15×15) | Gomoku (20×20, this version) |
|---|---|---|---|
| Squares | 9 | 225 | 400 |
| Winning lines of five | 8 | **572** | **1,152** |
| Games solved? | Yes — always a draw | First player holds a large advantage | Same character |

That gap changes everything. In Tic Tac Toe the board runs out of space, so the game collapses into a draw. In Gomoku the board never runs out of space — there are 1,152 separate ways to make five on our grid — so the game is decided entirely by who builds a threat that cannot be answered. Nobody wins by filling the board. Somebody wins by creating two problems at once.

## The Board: Classic Size vs This Version

Gomoku is traditionally played on a 15×15 grid. Competitive rule sets (the tournament version is called renju) also add forbidden shapes for the first player — double threes, double fours and overlines of six or more — to keep the game balanced, because otherwise the player who moves first has a large and well-documented advantage.

This version is deliberately simpler. It plays on a **20×20 grid of squares**, uses **X and O marks** instead of stones, gives the first move to X, and has **no forbidden moves at all** — a line of five **or more** wins. Everything below applies to both sizes; the tactics are identical, there are just more places to put them. If you want the formalised competitive version with all its restrictions, that is renju, which is a different (and much fussier) game.

## Every Square Is Not Worth the Same

This is the single most useful table in this guide. Count how many five-length lines pass through a single square:

| Square | Lines of five through it | Verdict |
|---|---|---|
| Centre of the board | **20** | Maximum possible — all four directions, all five offsets |
| Mid-edge square | 8 | Roughly a third of the centre's value |
| Corner | **3** | Barely worth occupying |
| Typical inner square | 12–20 | This is where the game is actually played |

On our 20×20 board there are 144 squares that reach the maximum of 20 lines — a whole central region, not a single magic square. So the opening rule is not "take the centre" as it is in Tic Tac Toe; it is "fight for the middle third of the board". Stones placed in the outer two files contribute so little that playing there early is effectively passing your turn.

## Five or More Wins — and Why Overlines Matter

In this version, a run of **five or more** in a line wins. That matters more than it sounds: in renju, a run of six or more (an *overline*) is actually **forbidden** for the first player, because overlines make certain attacks unbeatable. With no forbidden shapes here, a simple practical consequence follows: when you have a choice between extending a four and starting a new line, extending is always safe — you cannot accidentally over-extend yourself into a foul.

## The Open Three Is the Strongest Shape on the Board

Four shapes decide every Gomoku game. Learn their names and you can read any position.

- An **open two** is two marks in a line with both ends empty. It threatens nothing yet.
- An **open three** is three marks in a line with **both ends empty**. This is the strongest shape in the game.
- A **closed three** is three in a line with one end blocked.
- An **open four** is four in a line with both ends empty. This wins immediately.

An **open four cannot be blocked.** It offers two different squares that complete five, and your opponent only gets one move. That is why an open four is not a threat, it is a win. And because an open three converts into an open four in a single move, an open three is a threat your opponent **must** answer right now: ignore it and they lose.

## The Threat Ladder

Every winning sequence in Gomoku climbs the same ladder:

```
open two  →  open three  →  open four  →  five in a row
                ↑
        opponent must respond here
```

The ladder tells you where to focus. Moves that build an open two are cheap and can be ignored by your opponent. Moves that create an **open three** transfer the burden: your opponent has to spend their turn dealing with it, and every turn they spend reacting is a turn you spend building the next shape.

This is the strategic heart of the game, and it is why passive play loses. A player who only blocks never builds; a player who only builds gets hit by an open three they never answered.

## Why a Closed Three Is Almost Worthless

Take the same three marks and block one end, and the shape collapses in value. A closed three can only become a **closed four** — four marks with one end blocked and one end open. That single open end is a target, and your opponent kills the line by playing it.

Compare:

| Shape | What it becomes next move | Is it forcing? |
|---|---|---|
| Open three `_XXX_` | An open four (two ways to five) | **Yes** — opponent must respond now |
| Closed three `OXXX_` | A closed four (one way to five) | No — opponent blocks the open end and is fine |

So the practical rule is blunt: **never spend a move creating a closed three**, and when you are defending, a closed three can usually wait while you handle anything open.

## Double Threats: The Fork of Gomoku

If your opponent defends correctly, a single open three will always be answered. That means the way to actually win is to create **two threats in one move** — a double three, or a three and a four at once. Your opponent can only answer one of them, and the other becomes an open four and then five.

The geometry of a double threat is worth internalising: a single move creates two threats when it lands on a square that belongs to two different lines that each already hold two of your marks. Because a central square sits on up to 20 potential lines, the middle of the board is where double threats live — a stone placed there can complete shapes in several directions at once. This is the concrete reason the centre is worth so much: not because it is "central", but because it multiplies your ability to threaten two things simultaneously.

## Defence: The Order of Operations

Defending badly loses games faster than attacking badly. When it is your turn, check in this order and stop at the first thing that applies:

1. **Can I make five?** Play it and win.
2. **Can my opponent make five on their next move?** Block the square that completes it.
3. **Can my opponent make an open four?** That means they have an open three — block it now, at one of its two ends.
4. **Do I have a double threat available?** Play it; your opponent must respond and you keep the initiative.
5. Otherwise, build.

Steps 1 and 2 are mechanical and you should never get them wrong. Step 3 is where most casual games are lost: players block the visible three *after* it has already been extended, which is too late — an open four cannot be stopped.

The computer opponent in our [two-player Gomoku game](/games/gomoku/) follows essentially this list, which makes it a useful training partner: it will take a five if you leave one, and it will punish an open three that you ignore.

## The Opening

Gomoku openings are about claiming central space efficiently, and there is a natural asymmetry: the first player can always maintain the initiative by forcing responses, while the second player is always reacting. Casual games between evenly matched players usually end in favour of whoever played first, which is exactly why the formal renju rules handicap Black.

Practically, in the opening:

- Play toward the middle third. Stones in the outer files are wasted.
- Build shapes that can grow in **two** directions rather than one. A diagonal pair with open space on both diagonals is worth more than a horizontal pair against the edge.
- Do not chase a single line. If your opponent can see your plan, they can block it; develop two shapes at a distance and let them choose which to defend.
- Expect to spend the first several moves on structure, not on threats. The first forcing shape usually appears around move six or seven.

If you want the same "build a line, read the threats" thinking on a much smaller canvas, the [Four in a Row strategy guide](/blog/four-in-a-row-strategy/) is the same lesson compressed, and the [Reversi strategy guide](/blog/reversi-strategy/) makes a similar point about how positional value beats immediate material.

## Five Habits That Win Games

1. **Name the shape before you play it.** Is it an open two, an open three, a closed three? If it is closed, do not play it.
2. **Defend in the right order.** Five first, then their four-in-waiting, then their open three.
3. **Play the middle third.** Check any candidate move against the line-count table — outer squares simply do not pay.
4. **Hunt double threats.** Ask "does this move threaten two things?" not "does this move build my line?"
5. **Keep two shapes alive.** One line is easy to block; two lines at a distance force your opponent to guess.

For players coming from the classic board games, our [Checkers strategy guide](/blog/checkers-strategy/) covers the same principle — some squares are worth more than others — in a game where mobility, not line length, is the currency. And if you prefer a deeper, slower board game, the [free chess board](/games/chess/) is the next step up.

## Frequently Asked Questions

**Does five in a row have to be exactly five?** Not in this version — five **or more** wins. Some formal rule sets (renju) make an overline of six or more a foul for the first player, but there are no forbidden shapes here.

**How big is the board?** Gomoku is traditionally 15×15. This version uses a 20×20 grid of squares, which makes the game slightly more open and gives the first player even more room to build.

**Can the second player win?** Yes, against imperfect play — the second player wins by out-building rather than by force. But the first player has a real structural advantage, which is why competitive variants handicap the opening.

**What is the strongest move in the game?** There is no single square, but the strongest **shape** is the open three, and the strongest **region** is the central third of the board, where a stone can sit on up to 20 potential lines of five.

**How do I stop losing to open threes?** Respond to them immediately, on the move they appear. Blocking a three after your opponent has extended it into an open four is too late — the open four cannot be stopped.

**Is there a computer opponent?** Yes. Choose Player vs Computer on the [Gomoku grid](/games/gomoku/) and you can play as X or as O. It blocks fours and threes, so it is a good test of whether your threats are genuinely forcing.

## Play It

Gomoku rewards the small number of habits above more than it rewards any clever tactic — which makes it a genuinely good game to practise rather than read about. Open the [Gomoku board](/games/gomoku/) and try naming every shape you create; when you can see an open three coming two moves before it arrives, you have learned the game. If you want to see everything else on the site, the [full games library](/all-games/) has it all.
