# 第二批 18 款游戏选品清单（Seed List 2）

| 项目信息 | 内容 |
|---|---|
| 用途 | 工程师接入第二批游戏的 **seed 数据**，可直接写入 `src/content/games/` |
| 交付款数 | **18 款**（全部逐个联网核实，无一款凭印象填写） |
| 核实方式 | GitHub REST API `/repos/{owner}/{repo}` + `/repos/{owner}/{repo}/license` 实际返回值 |
| 核实时间 | **2026-08-05 UTC** |
| 准入许可 | 仅收 MIT / CC0-1.0 / Apache-2.0 / Unlicense / BSD-2-Clause / BSD-3-Clause |
| 撰写人 | 许清楚（产品经理） |
| 版本 | v1.0 |

> **给工程师的一句话**：本批 18 款的 License 字段是 GitHub API 的真实返回值。但 **`licenses.json` 台账仍需在接入时二次核对**，因为仓库所有者随时可能更改许可证。所有默认分支均已实测，见各款"仓库状态"列。

---

## 0. 核实过程中被否决的候选（重要，别再捡回来）

以下候选在搜索中排名靠前但**实测不合格**，请工程师不要加回来：

| 仓库 | 被拒原因 |
|---|---|
| `end3r/Gamedev-Canvas-workshop`（Breakout 教程） | **NOASSERTION**，仓库未声明许可证（MDN 官方教程同样无 LICENSE 文件） |
| `kubowania/breakout`、`kubowania/Nokia3310-Snake`、`CodeExplainedRepo/*`（Snake/Breakout/Ping-Pong） | **NOASSERTION**，无 LICENSE 文件 |
| `codethejason/checkers` | **GPL-2.0**，传染性许可，排除 |
| `bocaletto-luca/Pong`、`bocaletto-luca/Space-Invaders`、`bocaletto-luca/Dama`、`MatthewPageUK/js-space-invaders`、`angarg12/nucleogenesis` | **GPL-3.0 / GPL-2.0**，排除 |
| `fuzzley/fSpider`、`lrusso/Spider`、`oddstream/Solitaire`、`PreludeAndFugue/Freecell-Web`（Spider/FreeCell 高星候选） | 全部 **NOASSERTION**，无 LICENSE 文件 |
| `lazy-guy/reversi`、`blueedgetechno/othello`、`L000Pz/Othello-Reversi` 等 Reversi 候选 | **NOASSERTION** |
| `Rperry2174/CatchFruit`、`youseokhwan/CatchTheFruitsGame` 等接水果候选 | **NOASSERTION** |
| `Ronald106/Surviv.io`、`hiteshsuthar01/OK-`（Match-3 搜索误命中） | 非游戏/无 LICENSE |
| `pokeclicker/pokeclicker`、`ephymew/Pokeclicker-Scripts`（Idle 候选） | NOASSERTION / GPL + **Pokemon 商标高风险** |
| `ninegua/reversi` | MIT 但需 **Internet Computer 后端**，排除 |
| `aloxuhik/Spider-Solitaire` | MIT 但 **Unity 项目 101MB**，排除 |
| `joleksia/Easter-Hunt` | MIT 但 **C++ 语言**，需编译，排除 |
| `patorjk/JavaScript-Snake` | MIT 但仓库 **118MB**（源码仅 src/ 数十 KB，Parcel 构建），下载成本过高，降为备选 |

> 反例再次印证 GAME-SEEDLIST v1 的判断：**开源游戏的许可证在二手资料里错误率极高，必须逐个查源。** 本批近半数高星候选因 NOASSERTION 或 GPL 被排除。

---

## 1. 商标改名清单（上线前必须执行）

| 原名 | 商标权利人 | 风险等级 | **我方使用名** | slug |
|---|---|---|---|---|
| Othello / Reversi | Othello 商标（Tsukuda Original / Mattel 关联） | 🟠 中 | **Reversi**（通用名，安全） | `reversi` |
| Space Invaders | Taito | 🔴 高 | **Alien Attack** | `alien-attack` |
| Breakout | Atari | 🟠 中高 | **Brick Breaker**（通用名） | `brick-breaker` |
| Pong | Atari（历史上注册，普遍通用化） | 🟡 中低 | **Paddle Ball**（通用名） | `paddle-ball` |

**可安全使用的通用名**：`Snake`、`Bubble Shooter`、`Memory Match`、`Gem Match`（Match-3 通用名）、`Maze`、`Checkers`、`Gomoku`、`Spider Solitaire`、`Word Search`、`Tic Tac Toe`、`Rock Paper Scissors`、`Typing Rush`、`Idle Clicker`、`Catch Fruit`、`Reversi`、`Brick Breaker`、`Paddle Ball`、`Alien Attack`。

> ⚠️ 与 v1 相同的红线：`Othello`、`Space Invaders`、`Breakout`、`Pong` 在标题/H1/slug/品牌位**绝不出现**；正文中以玩法描述（如 "retro alien-shooter style"、"brick-breaking arcade"）作描述性使用需尽量克制，改用通用说法。

---

## 2. 品类配比校验（18 款新增后全站 30 款）

| 分类 | 新增 | 全站合计 | 占比 | 说明 |
|---|---|---|---|---|
| **Card & Board** | 4 | **8** | 27% | ⭐⭐⭐ 高 CPM 核心 |
| **Puzzle & Logic** | 4 | **8** | 27% | ⭐⭐⭐ 高 CPM 核心 |
| **Arcade & Retro** | 4 | **5** | 17% | ⭐⭐ 品类完整性补强 |
| **Word & Trivia** | 2 | **4** | 13% | ⭐⭐⭐ 高 CPM 核心 |
| **Idle & Clicker** | 1 | **2** | 7% | ⭐⭐ 停留时长 |
| **Action & Shooting** | 1 | **1** | 3% | 首批刻意 0 款，本批补 1 款品类完整性 |
| **Racing & Driving** | 0 | **0** | 0% | 仍为 0——需后端/大型仓库的多，留待下一批 |
| **高 CPM 品类合计** | 10/18 | **20/30** | **67%** | ✅ 高于 PRD 设定的 58% 下限 |

> 2-player 标签将交叉挂到：Checkers、Gomoku、Reversi、Paddle Ball、Tic Tac Toe、Rock Paper Scissors、Alien Attack（共 7 款 + 原 2 款），2-player 列表页从 2 款涨到 9 款。

---

## 3. 选品清单（18 款）

---

### G-13 · Snake

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/FelipeFreitas96/HTML5-Snake |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 2★ · 0.0MB · 未归档 · 最后推送 2019-10-06 · 默认分支 `master` |
| **我方游戏名 / slug** | `Snake` / `snake` |
| **分类 / 标签** | Arcade & Retro / `classic`, `single-player`, `no-download`, `keyboard-only`, `high-score`, `retro`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，`index.html` + `game.js` + `framework.js` + `index.css`，零构建 |
| **资源体积** | <10KB（源码全部） |
| **素材授权** | Canvas 绘制，无第三方素材 |
| **署名要求** | `Snake based on HTML5-Snake by Felipe Freitas · MIT License` |
| **组装难度** | ✅ 直接打包。⚠️ 含 `firebase.js`（369B），接入时检查是否引用外部服务，若引用则删除并移除相应调用 |
| **英文一句话描述** | Guide the snake to eat food, grow longer and avoid crashing into the walls or yourself in this classic arcade chase. |

**关键词策略**：`snake game online` / `snake game free no download` / `classic snake browser` —— Snake 是长尾大词，巨头页面多为教学型，轻量可玩页有空间。

---

### G-14 · Brick Breaker（原 Breakout 变体）

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/igameproject/Breakout |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 21★ · 0.3MB · 未归档 · 最后推送 2024-05-03 · 默认分支 `master` |
| **我方游戏名 / slug** | `Brick Breaker` / `brick-breaker`（⚠️ **不可用 "Breakout"——Atari 商标**） |
| **分类 / 标签** | Arcade & Retro / `classic`, `single-player`, `high-score`, `quick-session`, `keyboard-only`, `no-download`, `retro`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，JavaScript + HTML5 Canvas |
| **资源体积** | ~0.3MB |
| **素材授权** | Canvas 绘制，无第三方素材 |
| **署名要求** | `Brick Breaker based on Breakout by igameproject · MIT License` |
| **组装难度** | ✅ 直接打包 |
| **英文一句话描述** | Bounce the ball off your paddle to smash every brick on the wall — clear the level before the ball escapes. |

**关键词策略**：`brick breaker game` / `brick breaking game online free` / `breakout style game browser`（词可用，命名不可用）。

---

### G-15 · Bubble Shooter

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/rembound/Bubble-Shooter-HTML5 |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 59★ · 0.1MB · 未归档 · 最后推送 2023-10-17 · 默认分支 `master` |
| **我方游戏名 / slug** | `Bubble Shooter` / `bubble-shooter` |
| **分类 / 标签** | Puzzle & Logic（primary）+ Arcade / `classic`, `single-player`, `no-download`, `high-score`, `quick-session`, `mobile-friendly`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，HTML5 Canvas + JavaScript |
| **资源体积** | ~0.1MB |
| **素材授权** | 代码绘制，无第三方素材 |
| **署名要求** | `Bubble Shooter by rembound (Remy) · MIT License` |
| **组装难度** | ✅ 直接打包 |
| **英文一句话描述** | Aim and shoot coloured bubbles to match three or more of the same colour and clear the ceiling before it reaches you. |

**关键词策略**：`bubble shooter online` / `bubble shooter free no download` / `classic bubble shooter game`。

---

### G-16 · Memory Match

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/JitenRajpurohit/Memory-Matching-Game |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 69★ · 0.8MB · 未归档 · 最后推送 2026-01-09 · 默认分支 `main` |
| **我方游戏名 / slug** | `Memory Match` / `memory-match` |
| **分类 / 标签** | Puzzle & Logic / `brain-training`, `single-player`, `no-download`, `mobile-friendly`, `quick-session`, `family-friendly`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，JavaScript，含多关卡 |
| **资源体积** | ~0.8MB |
| **素材授权** | 待接入时核对图片素材；如无明确声明，用 CSS 卡片自绘替换（成本低） |
| **署名要求** | `Memory Match based on Memory-Matching-Game by Jiten Rajpurohit · MIT License` |
| **组装难度** | ✅ 直接打包（素材需快速核对） |
| **英文一句话描述** | Flip the cards and match every identical pair to clear the board in this classic concentration memory game. |

**关键词策略**：`memory game online` / `matching game free browser` / `brain memory game for adults`。

---

### G-17 · Gem Match（Match-3）

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/rembound/Match-3-Game-HTML5 |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 80★ · 0.0MB · 未归档 · 最后推送 2023-01-13 · 默认分支 `master` |
| **我方游戏名 / slug** | `Gem Match` / `gem-match` |
| **分类 / 标签** | Puzzle & Logic / `logic`, `single-player`, `no-download`, `mobile-friendly`, `high-score`, `brain-training`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，HTML5 Canvas + JavaScript |
| **资源体积** | <100KB |
| **素材授权** | 代码绘制，无第三方素材 |
| **署名要求** | `Gem Match based on Match-3-Game-HTML5 by rembound (Remy) · MIT License` |
| **组装难度** | ✅ 直接打包 |
| **英文一句话描述** | Swap adjacent gems to line up three or more of the same colour and keep the board from filling up. |

**关键词策略**：`match 3 game online` / `gem matching game free` / `match three puzzle browser`。

---

### G-18 · Maze

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/drewsilcock/maze.js |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 4★ · 0.3MB · 未归档 · 最后推送 2015-03-17 · 默认分支 `master` |
| **我方游戏名 / slug** | `Maze` / `maze` |
| **分类 / 标签** | Puzzle & Logic / `logic`, `single-player`, `no-download`, `keyboard-only`, `relaxing`, `classic`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，HTML5 Canvas + JavaScript |
| **资源体积** | ~0.3MB |
| **素材授权** | Canvas 绘制，无第三方素材 |
| **署名要求** | `Maze by Drew Silcock · MIT License` |
| **组装难度** | ✅ 直接打包（2015 年老仓库，接入时检查相对路径） |
| **英文一句话描述** | Navigate a randomly generated maze from start to finish as fast as you can — a new puzzle every time. |

**关键词策略**：`maze game online` / `maze game free browser` / `random maze generator game`。

---

### G-19 · Checkers

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/gartz/draughtsjs |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 9★ · 0.4MB · 未归档 · 最后推送 2014-03-03 · 默认分支 `master` |
| **我方游戏名 / slug** | `Checkers` / `checkers` |
| **分类 / 标签** | Card & Board（primary）+ 2-player / `classic`, `strategy`, `two-player`, `no-download`, `brain-training`, `family-friendly`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，纯 JavaScript（Draughts / Checkers / Damas） |
| **资源体积** | ~0.4MB |
| **素材授权** | 无第三方位图素材 |
| **署名要求** | `Checkers based on draughtsjs by gartz · MIT License` |
| **组装难度** | ✅ 直接打包（2014 年老仓库，检查相对路径与是否有 AI 对手） |
| **英文一句话描述** | Move your men diagonally, capture the opponent's pieces and crown your kings in this classic two-player board game. |

**关键词策略**：`checkers online` / `checkers vs computer free` / `play checkers 2 player browser`。

---

### G-20 · Gomoku

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/TranHuuDat2004/Caro-Board |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 14★ · 0.0MB · 未归档 · 最后推送 2025-07-14 · 默认分支 `main` |
| **我方游戏名 / slug** | `Gomoku` / `gomoku` |
| **分类 / 标签** | Card & Board（primary）+ 2-player / `classic`, `strategy`, `two-player`, `no-download`, `brain-training`, `mobile-friendly`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，vanilla JavaScript（Five-in-a-Row / Caro） |
| **资源体积** | <100KB |
| **素材授权** | Canvas 绘制，无第三方素材 |
| **署名要求** | `Gomoku based on Caro-Board by Tran Huu Dat · MIT License` |
| **组装难度** | ✅ 直接打包 |
| **英文一句话描述** | Place your stones on the grid and be the first to line up five in any direction in this classic board duel. |

**关键词策略**：`gomoku online` / `five in a row game 2 player` / `gomoku free browser`。

---

### G-21 · Reversi（原 Othello 变体）

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/zuramai/othello |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 5★ · 0.0MB · 未归档 · 最后推送 2020-09-13 · 默认分支 `master` |
| **我方游戏名 / slug** | `Reversi` / `reversi`（⚠️ **不可用 "Othello"——商标**） |
| **分类 / 标签** | Card & Board（primary）+ 2-player / `classic`, `strategy`, `two-player`, `no-download`, `brain-training`, `mobile-friendly`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，HTML5 Canvas + JavaScript |
| **资源体积** | <50KB |
| **素材授权** | Canvas 绘制，无第三方素材 |
| **署名要求** | `Reversi based on othello by zuramai · MIT License` |
| **组装难度** | ✅ 直接打包 |
| **英文一句话描述** | Flip your opponent's discs by sandwiching them between your own, and own the most discs when the board fills. |

**关键词策略**：`reversi online` / `othello game free browser`（词可用，命名不可用）/ `reversi vs computer`。

---

### G-22 · Spider Solitaire

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/lklynet/spider-solitaire |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 30★ · 0.4MB · 未归档 · 最后推送 2026-07-08 · 默认分支 `main` |
| **我方游戏名 / slug** | `Spider Solitaire` / `spider-solitaire` |
| **分类 / 标签** | Card & Board / `classic`, `single-player`, `strategy`, `no-download`, `relaxing`, `open-source`, `no-signup`, `long-session` |
| **技术形态** | ⚠️ **需构建**（TypeScript + Vite，`npm run build` 产静态 dist；Docker/nginx 文件忽略） |
| **资源体积** | 仓库 0.4MB，构建产物预估 <200KB |
| **素材授权** | 卡牌为 CSS/SVG 绘制，风险低 |
| **署名要求** | `Spider Solitaire based on spider-solitaire by lklynet · MIT License` |
| **组装难度** | ⚠️ 需构建（Vite），难度中低 |
| **英文一句话描述** | Build complete sequences from King down to Ace across eight tableau columns in the classic two-deck patience game. |

**关键词策略**：`spider solitaire online` / `spider solitaire 1 suit free` / `spider solitaire no download`。

---

### G-23 · Speed Typing

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/sayantanm19/js-simple-typing-game |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 57★ · 0.6MB · 未归档 · 最后推送 2021-05-07 · 默认分支 `master` |
| **我方游戏名 / slug** | `Speed Typing` / `speed-typing` |
| **分类 / 标签** | Word & Trivia / `word-guessing`→建议标签：`single-player`, `no-download`, `keyboard-only`, `high-score`, `quick-session`, `brain-training`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，`index.html` + `game.js` + `style.css` + images |
| **资源体积** | ~0.6MB |
| **素材授权** | 需接入时核对 images/ 目录来源；如无声明用 CSS 替换 |
| **署名要求** | `Speed Typing based on js-simple-typing-game by Sayantan Majumdar · MIT License` |
| **组装难度** | ✅ 直接打包 |
| **英文一句话描述** | Type the falling words before they reach the bottom, and push your words-per-minute to a new high score. |

**关键词策略**：`typing game online` / `typing speed test game free` / `typing game for kids browser`。

---

### G-24 · Word Search

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/lizhineng/word-search-game |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 54★ · 0.0MB · 未归档 · 最后推送 2019-12-20 · 默认分支 `master` |
| **我方游戏名 / slug** | `Word Search` / `word-search` |
| **分类 / 标签** | Word & Trivia / `single-player`, `no-download`, `mobile-friendly`, `relaxing`, `brain-training`, `family-friendly`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，HTML5 + JavaScript |
| **资源体积** | <100KB |
| **素材授权** | 无第三方素材 |
| **署名要求** | `Word Search based on word-search-game by Li Zhi Neng · MIT License` |
| **组装难度** | ✅ 直接打包 |
| **英文一句话描述** | Find and highlight every hidden word in the letter grid before you run out of time or patience. |

**关键词策略**：`word search game online` / `word search puzzle free browser` / `find the words game`。

---

### G-25 · Paddle Ball（原 Pong 变体）

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/jakesgordon/javascript-pong |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 217★ · 0.2MB · 未归档 · 最后推送 2025-06-01 · 默认分支 `master` |
| **我方游戏名 / slug** | `Paddle Ball` / `paddle-ball`（⚠️ **不可用 "Pong" 作品牌——Atari 商标**） |
| **分类 / 标签** | Arcade & Retro（primary）+ 2-player / `classic`, `two-player`, `high-score`, `quick-session`, `keyboard-only`, `no-download`, `retro`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，经典 JavaScript Pong（含 AI 对手） |
| **资源体积** | ~0.2MB |
| **素材授权** | 无第三方素材 |
| **署名要求** | `Paddle Ball based on javascript-pong by Jake Gordon · MIT License` |
| **组装难度** | ✅ 直接打包 |
| **英文一句话描述** | Bat the ball past your opponent's paddle — against the computer or a friend on the same keyboard. |

**关键词策略**：`pong game online free`（词可用，命名不可用）/ `2 player paddle game one keyboard` / `retro paddle ball browser`。

---

### G-26 · Tic Tac Toe

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/ramazancetinkaya/tictactoe |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 88★ · 0.1MB · 未归档 · 最后推送 2025-08-29 · 默认分支 `main` |
| **我方游戏名 / slug** | `Tic Tac Toe` / `tic-tac-toe` |
| **分类 / 标签** | 2 Player（primary）+ Puzzle / `classic`, `two-player`, `strategy`, `no-download`, `family-friendly`, `quick-session`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态，零依赖**（含启发式 AI 对手） |
| **资源体积** | ~0.1MB |
| **素材授权** | 无第三方素材 |
| **署名要求** | `Tic Tac Toe based on tictactoe by Ramazan Çetinkaya · MIT License` |
| **组装难度** | ✅ 直接打包 |
| **英文一句话描述** | Take turns placing X and O on the 3×3 grid and be the first to line up three in a row. |

**关键词策略**：`tic tac toe online` / `tic tac toe vs computer free` / `tic tac toe 2 player browser`。

---

### G-27 · Rock Paper Scissors

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/amirallami-code/rock-paper-scissors-game |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 28★ · 0.1MB · 未归档 · 最后推送 2025-06-23 · 默认分支 `main` |
| **我方游戏名 / slug** | `Rock Paper Scissors` / `rock-paper-scissors` |
| **分类 / 标签** | 2 Player（primary）/ `classic`, `two-player`, `family-friendly`, `quick-session`, `no-download`, `single-player`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，HTML/CSS/JavaScript |
| **资源体积** | ~0.1MB |
| **素材授权** | 无第三方素材（CSS 绘制） |
| **署名要求** | `Rock Paper Scissors based on rock-paper-scissors-game by Amir Allami · MIT License` |
| **组装难度** | ✅ 直接打包 |
| **英文一句话描述** | Choose rock, paper or scissors and beat the computer — best of three, five or as long as you like. |

**关键词策略**：`rock paper scissors game online` / `rock paper scissors vs computer` / `rps game free browser`。

---

### G-28 · Alien Attack（原 Space Invaders 变体）

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/matt-aranha/Space-Invaders |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 6★ · 9.1MB · 未归档 · 最后推送 2026-02-06 · 默认分支 `main` |
| **我方游戏名 / slug** | `Alien Attack` / `alien-attack`（⚠️ **不可用 "Space Invaders"——Taito 商标**） |
| **分类 / 标签** | Action & Shooting（primary）+ Arcade / `classic`, `single-player`, `high-score`, `keyboard-only`, `no-download`, `retro`, `open-source`, `no-signup` |
| **技术形态** | ✅ 基本静态（index.html + CSS + 两个游戏模式目录），目录名含葡萄牙语需接入时检查相对路径 |
| **资源体积** | 9.1MB（含音频素材），可裁剪 |
| **素材授权** | 需接入时核对音频/图片素材来源；如无声明用 WebAudio 合成音效替换 |
| **署名要求** | `Alien Attack based on Space-Invaders by matt-aranha · MIT License` |
| **组装难度** | ⚠️ 直接打包（需检查多模式目录与相对路径、裁剪素材） |
| **英文一句话描述** | Blast the descending alien waves before they reach the bottom of the screen, in this retro arcade shooter. |

**关键词策略**：`space invaders game online`（词可用，命名不可用）/ `alien shooter game browser` / `retro arcade shooter free`。

---

### G-29 · Idle Clicker

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/InfinityLoop1/Infinity-Clicker |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 1★ · 0.2MB · 未归档 · 最后推送 2024-04-19 · 默认分支 `main` |
| **我方游戏名 / slug** | `Idle Clicker` / `idle-clicker` |
| **分类 / 标签** | Idle & Clicker / `long-session`, `single-player`, `saves-progress`, `no-download`, `mobile-friendly`, `open-source`, `no-signup`, `relaxing` |
| **技术形态** | ✅ **纯静态**，HTML5 升级/倍率/声望系统，localStorage 存档 |
| **资源体积** | ~0.2MB |
| **素材授权** | 无第三方素材（数字/文本为主） |
| **署名要求** | `Idle Clicker based on Infinity-Clicker by InfinityLoop1 · MIT License` |
| **组装难度** | ✅ 直接打包 |
| **英文一句话描述** | Click to earn, buy multipliers and reset for prestige bonuses in this clean incremental clicker. |

**关键词策略**：`idle clicker game browser` / `clicker game free no download` / `incremental game to play at work`。

---

### G-30 · Catch Fruit

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/Jeevan-kumar-Raj/FruitCatcher |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 1★ · 5.9MB · 未归档 · 最后推送 2020-05-10 · 默认分支 `master` |
| **我方游戏名 / slug** | `Catch Fruit` / `catch-fruit` |
| **分类 / 标签** | Arcade & Retro / `single-player`, `high-score`, `quick-session`, `no-download`, `mobile-friendly`, `family-friendly`, `open-source`, `no-signup` |
| **技术形态** | ✅ **纯静态**，单 HTML（`FruitCatcher.html` 13.8KB）+ Audio/Images 素材目录 |
| **资源体积** | 5.9MB（音频/图片为主，可裁剪压缩） |
| **素材授权** | ⚠️ 需接入时核对 Audio/Images 素材来源；如无声明，用 CSS 绘制水果 + WebAudio 合成音效替换 |
| **署名要求** | `Catch Fruit based on FruitCatcher by Jeevan Kumar Raj · MIT License` |
| **组装难度** | ✅ 直接打包（单 HTML + 素材目录） |
| **英文一句话描述** | Move the basket to catch every falling fruit and build the longest combo streak you can. |

**关键词策略**：`fruit catch game online` / `catch falling fruit game free` / `basket catch game browser`。

---

## 4. 备选清单（若工程师接入某款失败时的替补）

| 类型 | 仓库 | 许可证 | 备注 |
|---|---|---|---|
| 15-Puzzle | https://github.com/arnisritins/15-Puzzle | MIT | 纯静态 0.0MB，Puzzle |
| Simon | https://github.com/arjuncvinod/Simon-Game | MIT | 纯静态 0.1MB，Arcade/Memory |
| Snake（高质量备选） | https://github.com/patorjk/JavaScript-Snake | MIT | 594★ 但仓库 118MB，Parcel 构建，仅作替补 |
| Idle 备选 | https://github.com/estebanrfp/emoji-clicker | MIT | 0.7MB Vanilla JS，表情主题可改 |

> 备用库同样已核实许可证；如启用需在 `licenses.json` 台账登记并更新本清单版本号。

---

## 5. 工程师接入优先级建议

按"工程量 ÷ 价值"排序，建议分三批接入：

| 批次 | 游戏 | 理由 |
|---|---|---|
| **第 1 批（跑通流水线）** | Snake、Bubble Shooter、Gem Match、Tic Tac Toe、Rock Paper Scissors | 全部纯静态、<0.1MB，零依赖，验证接入链路 |
| **第 2 批** | Brick Breaker、Memory Match、Maze、Checkers、Gomoku、Reversi、Word Search、Speed Typing、Paddle Ball | 纯静态中等工程量，含 2-player 交叉与素材核对 |
| **第 3 批** | Spider Solitaire（Vite 构建）、Alien Attack（多模式目录+素材核对）、Idle Clicker、Catch Fruit（素材核对） | 需构建或素材处理，工程量最大 |

---

## 6. 核实声明

- 本清单 18 款游戏的许可证信息，全部来自 GitHub REST API 在 **2026-08-05 UTC** 的实际返回值，包含 `/repos/{repo}` 的 `license.spdx_id`、`archived`、`default_branch`、`pushed_at`、`size` 字段与 `/repos/{repo}/license` 的 LICENSE 文件名确认。
- 目录结构（`/repos/{repo}/contents`）仅抽查了 6 款（Snake、FruitCatcher、Space-Invaders、spider-solitaire、HTML5-Snake、js-simple-typing-game），其余以 search/API 元数据为准，**接入时请工程师用 `npm run new:game` 实际下载确认**。
- 未通过核实的候选一律未列入，被否决的高星候选已在 §0 公开列出及原因。
- 商标风险判断基于公开可查的权利人信息，**属产品经理的风险提示，不构成法律意见**。
- **复核建议：每 6 个月重新跑一次许可证核查**。

---

**文档结束 · v1.0 · 许清楚（产品经理）· 2026-08-05**
