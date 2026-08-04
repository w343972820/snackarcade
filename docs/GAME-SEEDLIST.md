# 首批 MVP 游戏选品清单（Seed List）

| 项目信息 | 内容 |
|---|---|
| 用途 | 工程师建站的 **seed 数据**，可直接写入 `src/content/games/` |
| 交付款数 | **12 款**（全部逐个联网核实，无一款凭印象填写） |
| 核实方式 | GitHub REST API `/repos/{owner}/{repo}` + `/repos/{owner}/{repo}/license` 实际返回值 |
| 核实时间 | **2026-08-04 01:30–01:46 UTC** |
| 准入许可 | 仅收 MIT / CC0-1.0 / Apache-2.0 / Unlicense / BSD-2-Clause / BSD-3-Clause |
| 撰写人 | 许清楚（产品经理） |
| 版本 | v1.0 |

> **给工程师的一句话**：这 12 款的 License 字段是 GitHub API 的真实返回值，不是从博客文章抄的。但 **`licenses.json` 台账仍需在接入时二次核对**，因为仓库所有者随时可能更改许可证。

---

## 0. 核实过程中被否决的候选（重要，别再捡回来）

以下几款在中文和英文技术博客里被反复推荐为"MIT 开源游戏"，**实测许可证不符，已排除**。请工程师不要因为看到别处推荐而加回来。

| 仓库 | 博客常见说法 | **API 实测许可证** | 处置 |
|---|---|---|---|
| `ellisonleao/clumsy-bird` | "MIT 的 Flappy Bird 克隆" | **GPL-3.0** | ❌ 排除。GPL 传染性 + 仓库已 archived（2018 停更） |
| `Hextris/hextris` | "MIT/开源俄罗斯方块变体" | **NOASSERTION**（GitHub 无法识别，实为 GPL-3.0） | ❌ 排除 |
| `end3r/Gamedev-Canvas-workshop` | "MDN 官方 Breakout 教程，可自由使用" | **NOASSERTION**（仓库未声明许可证） | ❌ 排除。按 §PRD 3.2 规则，无 LICENSE 文件 = 保留所有权利 |
| `cwackerfuss/react-wordle` | "最流行的 Wordle 开源克隆" | 仓库已迁移/改名，API 返回 **404 Not Found** | ❌ 排除。查无实据的一律不写 |

> 这 4 个反例恰好印证了 PRD §3.2 的判断：**开源游戏的许可证信息在二手资料里错误率极高，必须逐个查源。** 尤其 `clumsy-bird`——我在 PRD v1.0 里曾按业界通说写成 MIT，本次核实发现实为 GPL-3.0，**PRD 附录需同步勘误**。

---

## 1. 商标改名清单（上线前必须执行）

许可证只解决**代码版权**，解决不了**商标**。以下改名是硬性要求：

| 原名 | 商标权利人 | 风险等级 | **我方使用名** | slug |
|---|---|---|---|---|
| Tetris | Tetris Holding LLC | 🔴 极高（业内最积极维权方之一） | **Block Drop** | `block-drop` |
| Wordle | The New York Times Company | 🔴 高（2022 年收购后已多次发函） | **Five Letters** | `five-letters` |
| Connect Four / Connect 4 | Hasbro | 🟠 中高（注册商标） | **Four in a Row** | `four-in-a-row` |
| Picross | Nintendo | 🔴 高 | **Nonogram**（通用名，安全） | `nonogram` |

**可安全使用的通用名**（非商标，属游戏玩法的通用描述）：`Solitaire`、`Klondike`、`Spider Solitaire`、`FreeCell`、`Mahjong Solitaire`、`Sudoku`、`Minesweeper`、`Snake`、`Hangman`、`Chess`、`Nonogram`、`2048`。

> ⚠️ 补充说明：`2048` 保留原名是安全的——它不是注册商标，且我们使用的正是**原作者本人**的仓库（Gabriele Cirulli），署名即可。

---

## 2. 品类配比校验

| 分类 | 款数 | 占比 | PRD §5.5 战略定位 |
|---|---|---|---|
| **Card & Board** | 4 | 33% | ⭐⭐⭐ 高 CPM 核心 |
| **Puzzle & Logic** | 4 | 33% | ⭐⭐⭐ 高 CPM 核心 |
| **Word & Trivia** | 2 | 17% | ⭐⭐⭐ 高 CPM 核心 |
| **Idle & Clicker** | 1 | 8% | ⭐⭐ 停留时长冠军 |
| **Arcade & Retro** | 1 | 8% | ⭐⭐ 品类完整性 |
| **高 CPM 品类合计** | **11 / 12** | **92%** | ✅ 高于 PRD 设定的 58% 下限 |

> Action / Racing 首批 **0 款**——这是刻意的。那是 CrazyGames 的主场（18–24 岁男性、高广告拦截率、低 CPM），首批 12 款要把有限的内容产能全部押在高 CPM 品类上。等过审后用 iframe 放量时再补品类完整性。

---

## 3. 选品清单（12 款）

---

### G-01 · 2048

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/gabrielecirulli/2048 |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE.txt` ✅ |
| **仓库状态** | 13,346★ · 625KB · 未归档 · 最后推送 2024-10-24 |
| **我方游戏名 / slug** | `2048` / `2048` |
| **分类 / 标签** | Puzzle & Logic / `number`, `merge`, `single-player`, `no-download`, `mobile-friendly`, `keyboard` |
| **技术形态** | ✅ **纯静态**，HTML+CSS+JS，无构建、无外部依赖。直接拷贝即可用 |
| **资源体积** | ~200KB（含字体与图标） |
| **素材授权** | 与代码同仓库同 MIT，无第三方素材风险 |
| **署名要求** | `2048 by Gabriele Cirulli · MIT License · Source` |
| **英文一句话描述** | Slide numbered tiles and merge matching pairs to build the 2048 tile before the board fills up. |

**关键词策略**

- 主词：`2048 game online`
- 长尾：`2048 online free no download` / `how to get 4096 in 2048` / `2048 undo button`
- **为什么新站有机会**：头部词 `2048` 被 play2048.co（原作者官方站）和 Poki 霸榜，正面打不过。但 `how to get 4096 in 2048`、`2048 strategy corner method` 这类**玩法问题词**几乎无人系统覆盖——巨头的页面根本没有 Tips 章节。PRD §6.5 的 2048 样板页已经写好了 238 词的 Tips 段落，直接就是为这批词准备的。这也是首批唯一一个**内容已经 100% 写完**的页面，工程师可以拿它做模板验证。

---

### G-02 · Klondike Solitaire

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/rjanjic/js-solitaire |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 76★ · 851KB · 未归档 · 最后推送 2022-12-07 |
| **我方游戏名 / slug** | `Klondike Solitaire` / `klondike-solitaire` |
| **分类 / 标签** | Card & Board / `solitaire`, `cards`, `single-player`, `classic`, `mouse`, `no-download` |
| **技术形态** | ⚠️ **需构建**（Babel + Yarn，`config/` + `scripts/` 自定义构建链）。产物为静态文件 |
| **资源体积** | 源码 851KB，构建产物预估 <300KB（卡牌为 CSS/SVG 绘制，非位图） |
| **素材授权** | 无第三方位图素材，风险低 |
| **署名要求** | `Klondike Solitaire by Radovan Janjic · MIT License · Source` |
| **英文一句话描述** | The classic one-deck Klondike Solitaire, with draw-one and draw-three modes, playable straight in your browser. |

**关键词策略**

- 主词：`free solitaire no download`
- 长尾：`klondike solitaire draw 3 free` / `solitaire full screen no download` / `how to win at klondike solitaire`
- **为什么新站有机会**：这是整个清单里**商业价值最高的一款**。Solitaire 的搜索人群是 45+ 美国用户——CPM 最高、广告拦截器安装率最低、单次会话最长。头部词被 solitaired.com / worldofsolitaire.com 长期占据，但 `draw 3` / `full screen` / `no download` 这类修饰词组合仍有大量长尾空间，且这批用户**极少用广告拦截器**，实际 RPM 会显著高于站点均值。建议这一款优先做，并写足 900 词。

---

### G-03 · Mahjong Solitaire

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/ffalt/mah |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 139★ · 63MB · 未归档 · **最后推送 2026-08-03（极活跃）** |
| **我方游戏名 / slug** | `Mahjong Solitaire` / `mahjong-solitaire` |
| **分类 / 标签** | Card & Board / `mahjong`, `tile-matching`, `single-player`, `relaxing`, `mouse`, `no-download` |
| **技术形态** | ⚠️ **需构建**（Angular，`npm run build:prod` → `dist/` 静态产物）。支持 `custom-build-config.json` 改游戏名，无需改代码 |
| **资源体积** | 仓库 63MB（含 13 套牌面 + 375 种背景），**必须裁剪**，只保留 1–2 套牌面，产物可压到 <2MB |
| **素材授权** | 🔴 **重点：代码 MIT，但美术素材是独立授权，必须逐套核对** |
| **署名要求** | `Mahjong Solitaire (Mah) by ffalt · MIT License · Source` + **所选牌面的 CC-BY 署名** |
| **英文一句话描述** | Match free pairs of tiles to clear the board in this classic Mahjong Solitaire, with 84 layouts and no time pressure. |

> #### ⚠️ 素材授权明细（已逐个核实 `src/assets/*/README.md`）
>
> | 素材 | 授权 | 可否使用 |
> |---|---|---|
> | `uni.svg` / `unib.svg`（Unicode 牌面） | **Public Domain**（Wikimedia，作者 Shizhao） | ✅ **首选，零义务** |
> | `riichi.svg` | **CC-BY 4.0**（FluffyStuff / xhokir） | ✅ 可用，**必须页面署名** |
> | `space.svg` | CC-BY 4.0（Good Stuff No Nonsense） | ✅ 可用，需署名 |
> | `birds.svg` | CC-BY 4.0（Pedro Machado） | ✅ 可用，需署名 |
> | `animals.svg` | 来源 Figma Community，**未声明许可证** | ❌ **删除，不要用** |
> | `cheshire137.svg` | 仅注明 "by taksuyu/tile-art"，**无许可证** | ❌ **删除，不要用** |
> | 背景图（grass/stones/wood/space 等） | **Unsplash License**（允许商用） | ✅ 可用 |
> | 背景图（grayclouds/blueclouds/bamboo） | CC-BY-SA 4.0（ffalt 本人） | ⚠️ SA 有传染性，建议不用 |
> | 音效（ZzFX 生成） | **MIT** | ✅ 可用 |
>
> **工程师执行要求**：接入时只保留 `uni.svg`（公有领域）+ `riichi.svg`（CC-BY，页面署名），其余牌面目录**物理删除**。这既是合规要求，也顺带把 63MB 压到 2MB 以内。

**关键词策略**

- 主词：`mahjong solitaire free online`
- 长尾：`mahjong solitaire no download no registration` / `mahjong turtle layout free` / `how to play mahjong solitaire rules`
- **为什么新站有机会**：与 Solitaire 同属高 CPM 成人休闲池。这个仓库有 **84 种牌局布局**，意味着可以衍生出 `mahjong turtle layout`、`mahjong dragon layout` 等一批**布局名长尾词**，每个布局都能做成独立着陆页——这是天然的内容规模化抓手，而 Poki/CrazyGames 只会放一个笼统的 Mahjong 页面。**建议 M4 之后按布局拆页，这是本站最容易上量的长尾矿脉。**

---

### G-04 · Chess

| 字段 | 内容 |
|---|---|
| **仓库** | 棋盘 UI：https://github.com/oakmac/chessboardjs<br>走法引擎：https://github.com/jhlywa/chess.js |
| **许可证（API 实测）** | chessboardjs：**MIT**（`LICENSE.md`）✅<br>chess.js：**BSD-2-Clause**（`LICENSE`）✅ |
| **仓库状态** | chessboardjs 2,131★ / 948KB / 2024-04-17<br>chess.js 4,363★ / 1.4MB / **2025-10-10（活跃维护）** |
| **我方游戏名 / slug** | `Chess` / `chess` |
| **分类 / 标签** | Card & Board / `chess`, `strategy`, `2-player`, `vs-computer`, `classic`, `mouse` |
| **技术形态** | ⚠️ **需组装**。两个库都是组件，需自行拼装成完整游戏。chessboardjs 依赖 jQuery（可替换为无依赖 fork）。**AI 对手需额外接入**（建议 `js-chess-engine`，需另行核实许可证） |
| **资源体积** | 棋子 SVG + 两个库，压缩后 <400KB |
| **素材授权** | chessboardjs 自带棋子图为 Wikipedia 标准 SVG 棋子集，随仓库 MIT 分发 |
| **署名要求** | `Board: chessboard.js by Chris Oakman (MIT) · Engine: chess.js by Jeff Hlywa (BSD-2-Clause) · Source` |
| **英文一句话描述** | Play chess against the computer or a friend on the same device, with legal-move highlighting and full rule enforcement. |

**关键词策略**

- 主词：`play chess online free no download`
- 长尾：`chess vs computer no sign up` / `2 player chess same computer` / `chess for beginners free`
- **为什么新站有机会**：`chess online` 头部词被 chess.com / lichess.org 彻底垄断（这两家 DR 90+，正面无胜算）。但它们**都要求注册或至少引导注册**——`no sign up` / `without account` / `no registration` 这批词是它们的结构性盲区，我们的"零注册"定位天然契合。
- ⚠️ **工程量提示**：这是 12 款里**唯一需要自行组装 + 接 AI 引擎**的，工作量约为其他款的 3 倍。**建议排在第二批（M2 末）**，不要放在首周。

---

### G-05 · Four in a Row（原 Connect Four）

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/kenrick95/c4 |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 278★ · 10.2MB · 未归档 |
| **我方游戏名 / slug** | `Four in a Row` / `four-in-a-row`（⚠️ **必须改名，Connect 4 是 Hasbro 注册商标**） |
| **分类 / 标签** | Card & Board / `2-player`, `strategy`, `vs-computer`, `quick-game`, `mouse`, `family` |
| **技术形态** | ⚠️ 需构建（JS + Canvas）。含 AI 对手 |
| **资源体积** | 仓库 10.2MB（多为开发资源），构建产物预估 <300KB |
| **素材授权** | Canvas 绘制，无第三方位图 |
| **署名要求** | `Based on c4 by Kenrick Chien · MIT License · Source` |
| **英文一句话描述** | Drop discs into the grid and be the first to line up four in a row — against a friend or the computer. |

**关键词策略**

- 主词：`four in a row game online`
- 长尾：`connect 4 online 2 player free`（**词可用，站内名称不可用**）/ `4 in a row vs computer` / `two player games same keyboard`
- **为什么新站有机会**：这一款同时覆盖 `2-player` 标签页——PRD §2.4 里 `2 player games on one keyboard` 是巨头覆盖严重不足的场景词族。**注意区分：在 meta description 和正文里自然出现 "connect 4" 作为玩法描述是合理使用（描述性使用），但游戏标题、H1、slug、品牌位置绝不能用。** 这条界线请工程师和文案严格遵守。

---

### G-06 · Five Letters（原 Wordle 克隆）

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/WebDevSimplified/wordle-clone |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 179★ · 41KB · 未归档 |
| **我方游戏名 / slug** | `Five Letters` / `five-letters`（⚠️ **必须改名，Wordle 是 NYT 注册商标**） |
| **分类 / 标签** | Word & Trivia / `word-game`, `daily`, `single-player`, `keyboard`, `brain`, `no-download` |
| **技术形态** | ✅ **纯静态，零构建、零依赖**。仅 `index.html` + `script.js` + `styles.css` + `dictionary.json` + `targetWords.json` |
| **资源体积** | **41KB 全部**（其中词库 JSON 约 168KB 未压缩，gzip 后极小） |
| **素材授权** | 无图片素材，纯 CSS |
| **署名要求** | `Based on wordle-clone by Web Dev Simplified (Kyle Cook) · MIT License · Source` |
| **英文一句话描述** | Guess the hidden five-letter word in six tries, with colour hints after every guess. |

**关键词策略**

- 主词：`five letter word guessing game`
- 长尾：`wordle unlimited free`（**词可用，命名不可用**）/ `word guessing game unlimited tries` / `daily word puzzle no app`
- **为什么新站有机会**：NYT 的官方 Wordle **每天只能玩一局**，这个产品限制制造了一个巨大的搜索缺口——`unlimited`、`practice`、`play again` 这批词有稳定需求且 NYT 永远不会去满足。我们提供无限次重玩，天然吃这批词。
- ✅ **工程量最低的一款（纯静态、41KB、零依赖）。建议作为首个接入的游戏，用来跑通整条内容流水线。**

---

### G-07 · Hangman

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/abdoutech19/hangman-game |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 46★ · 1.69MB · 未归档 · 最后推送 2024-05-18 |
| **我方游戏名 / slug** | `Hangman` / `hangman` |
| **分类 / 标签** | Word & Trivia / `word-game`, `vocabulary`, `single-player`, `keyboard`, `classic`, `family` |
| **技术形态** | ✅ **纯 vanilla JavaScript**，响应式，无框架依赖 |
| **资源体积** | ~1.7MB（含插图，可优化到 <300KB） |
| **素材授权** | 需在接入时核对 `assets/` 目录内插图来源；若无明确声明，**用 CSS/SVG 自绘替换**（绞刑架图形极简单，重画成本低于核查成本） |
| **署名要求** | `Based on hangman-game by abdoutech19 · MIT License · Source` |
| **英文一句话描述** | Guess the hidden word one letter at a time before the drawing is complete. |

**关键词策略**

- 主词：`hangman game online free`
- 长尾：`hangman 2 player online` / `hangman game with friends free` / `classic hangman no download`
- **为什么新站有机会**：Hangman 是典型的"高搜索量、低竞争度"词——因为它太简单，大平台懒得为它做专门的落地页，通常只塞在分类页里。而它又是**英语区课堂和家庭场景的高频词**。用 PRD §5.2 的完整模板（含 Controls 表 + FAQ）做一个 700 词的页面，排名难度明显低于其他款。

---

### G-08 · Nonogram

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/HandsomeOne/Nonogram |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE.md` ✅ |
| **仓库状态** | 151★ · 358KB · 未归档 · 最后推送 2020-05-01 |
| **我方游戏名 / slug** | `Nonogram` / `nonogram`（⚠️ **绝不可用 "Picross"——任天堂商标**） |
| **分类 / 标签** | Puzzle & Logic / `logic`, `griddler`, `single-player`, `brain`, `mouse`, `relaxing` |
| **技术形态** | ⚠️ 需构建（TypeScript + Rollup）。含解题器与谜题生成器 |
| **资源体积** | 构建产物 <100KB，Canvas 绘制 |
| **素材授权** | 无第三方素材 |
| **署名要求** | `Nonogram by HandsomeOne · MIT License · Source` |
| **英文一句话描述** | Use the number clues along each row and column to reveal the hidden picture, one square at a time. |

**关键词策略**

- 主词：`nonogram online free`
- 长尾：`picross online free no download`（**词可用，命名不可用**）/ `nonogram puzzles for beginners` / `how to solve nonogram puzzles`
- **为什么新站有机会**：`how to solve nonogram` 是典型的**教学型问题词**——需求真实存在，但现有结果基本是 Reddit 帖子和维基百科，**几乎没有"边教边玩"的页面**。我们的"指南 + 可玩"合体模式在这个词上优势最大。而且内置生成器意味着可以做 easy/medium/hard 多个难度页面，天然可扩展。

---

### G-09 · Minesweeper

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/pwmarcz/kaboom |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 234★ · 178KB · 未归档 · 最后推送 2023-02-13 |
| **我方游戏名 / slug** | `Minesweeper` / `minesweeper` |
| **分类 / 标签** | Puzzle & Logic / `logic`, `classic`, `single-player`, `retro`, `mouse`, `brain` |
| **技术形态** | ⚠️ 需构建。特色：**"cruel but fair" 无猜测算法**——保证每一局都能纯靠逻辑推理解出 |
| **资源体积** | <200KB |
| **素材授权** | 无第三方位图素材 |
| **署名要求** | `Based on Kaboom by Paweł Marczewski · MIT License · Source` |
| **英文一句话描述** | Classic Minesweeper with a twist: every board is guaranteed solvable by logic alone — no guessing required. |

**关键词策略**

- 主词：`minesweeper online free`
- 长尾：`minesweeper no guessing mode` / `minesweeper online no download windows` / `how to play minesweeper for beginners`
- **为什么新站有机会**：`minesweeper online` 竞争激烈（minesweeper.online / minesweeperonline.com 占位），但**"no guessing" 是这个仓库独有的差异化卖点**——这是骨灰级玩家社区里的高频诉求，搜索意图极其明确，竞争页面却很少。**这是 12 款里唯一一款在产品功能层面就自带差异化的**，页面文案要把 "no guessing" 作为核心卖点写透，而不是当成一个普通扫雷。

---

### G-10 · Sudoku

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/robatron/sudoku.js |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 495★ · 101KB · 未归档 |
| **我方游戏名 / slug** | `Sudoku` / `sudoku` |
| **分类 / 标签** | Puzzle & Logic / `number`, `logic`, `single-player`, `brain`, `daily`, `relaxing` |
| **技术形态** | 🔴 **注意：这是纯算法库（谜题生成 + 求解），不含 UI**。需自行开发棋盘界面（网格 + 数字输入 + 笔记模式），预估 1–2 天工作量 |
| **资源体积** | 库本身 101KB，加自研 UI 后 <200KB |
| **素材授权** | 无素材 |
| **署名要求** | `Puzzle engine: sudoku.js by Robert McGuire · MIT License · Source`（UI 为我方原创） |
| **英文一句话描述** | Fill the 9×9 grid so every row, column and box contains the digits 1 to 9 exactly once, across four difficulty levels. |

**关键词策略**

- 主词：`sudoku online free`
- 长尾：`easy sudoku for beginners printable free` / `sudoku with notes feature online` / `how to solve sudoku step by step`
- **为什么新站有机会**：Sudoku 头部词竞争极强（sudoku.com 月自然搜索 800 万级），**但难度分级词是分散的**——`easy sudoku` / `expert sudoku` / `sudoku for kids` 各自独立成词。这个库支持 4 档难度，可以直接拆成 4 个独立着陆页，各自吃一批词。
- 🔴 **工程量提示：唯一需要从零写 UI 的一款。建议排到第三批（M3），或者如果时间紧张，首批 12 款可先降为 11 款。别为了凑数强上。**

---

### G-11 · Idle Venture（放置点击）

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/bitcraft3r/0xVenture-Capitalist |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE` ✅ |
| **仓库状态** | 25★ · 4.76MB · 未归档 |
| **我方游戏名 / slug** | `Idle Venture` / `idle-venture`（改名，避免与 Kongregate 的 *AdVenture Capitalist* 混淆） |
| **分类 / 标签** | Idle & Clicker / `idle`, `incremental`, `clicker`, `single-player`, `long-session`, `auto-play` |
| **技术形态** | ⚠️ 需构建（现代前端框架）。含 localStorage 存档 |
| **资源体积** | 仓库 4.76MB，构建产物预估 <500KB |
| **素材授权** | 接入时需核对图标素材来源；建议统一替换为 Lucide 图标（ISC 许可，可商用） |
| **署名要求** | `Based on 0xVenture Capitalist by bitcraft3r · MIT License · Source` |
| **英文一句话描述** | Click to earn, buy managers to automate, and watch your empire keep growing even while you're away. |

**关键词策略**

- 主词：`idle clicker game browser`
- 长尾：`idle games no download browser` / `incremental games to play at work` / `best idle games that run in background tab`
- **为什么新站有机会**：**这一款的战略价值不在搜索量，而在停留时长。** 放置游戏的单次会话动辄 20–40 分钟，是所有品类里广告展示次数最高的。按 PRD §1.2 的公式，同样 1 个访客，放置游戏产生的广告展示可能是休闲益智的 5–10 倍。另外 `games to play at work` / `background tab games` 是纯场景词，巨头的信息架构里完全没有这个维度。
- ⚠️ 仅 25★，代码成熟度需工程师接入时评估；若质量不达标，可换其他 MIT 放置游戏，**但必须重新走一遍许可证核实流程**。

---

### G-12 · Block Drop（原 Tetris 克隆）

| 字段 | 内容 |
|---|---|
| **仓库** | https://github.com/dionyziz/canvas-tetris |
| **许可证（API 实测）** | **MIT** · LICENSE 文件：`LICENSE.md` ✅ |
| **仓库状态** | 451★ · **23KB** · 未归档 · 最后推送 2023-12-13 |
| **我方游戏名 / slug** | `Block Drop` / `block-drop`（🔴 **必须改名。Tetris Holding LLC 维权极其积极，这条没有商量余地**） |
| **分类 / 标签** | Arcade & Retro / `blocks`, `classic`, `single-player`, `keyboard`, `retro`, `quick-game` |
| **技术形态** | ✅ **纯 Canvas，零依赖，23KB 全部源码**。整个清单里最轻的一款 |
| **资源体积** | **23KB** |
| **素材授权** | 纯代码绘制，无任何第三方素材 |
| **署名要求** | `Based on canvas-tetris by Dionysis Zindros · MIT License · Source` |
| **英文一句话描述** | Rotate and stack falling blocks to clear complete lines — the faster you clear, the faster they fall. |

**关键词策略**

- 主词：`block puzzle game online free`
- 长尾：`falling blocks game no download` / `classic block stacking game browser` / `tetris style game free online`（**词可用，命名不可用**）
- **为什么新站有机会**：坦白说，这一款的 SEO 价值是 12 款里**最低的**——因为不能用 "Tetris" 这个词做标题和 slug，等于放弃了最大的流量入口。
- **它入选的真正理由是工程价值**：23KB、纯 Canvas、零依赖、零素材风险，**是验证"游戏接入流水线"最理想的小白鼠**。建议工程师第一天就用它跑通"内容文件 → 页面渲染 → click-to-play → 结构化数据"的完整链路，成本极低。
- ⚠️ **命名红线再强调一次**：H1、title、slug、面包屑、OG 标题里出现 "Tetris" 一次都不行。正文里以 "a Tetris-style game" 形式作**描述性使用**是可接受的，但建议连这个也尽量避免，改用 "falling block puzzle"。

---

## 4. 工程师接入优先级建议

按"工程量 ÷ 价值"排序，建议这样排期：

| 批次 | 游戏 | 理由 |
|---|---|---|
| **第 1 天（跑通流水线）** | G-12 Block Drop、G-06 Five Letters | 纯静态、零依赖、23KB/41KB，用来验证整条接入链路 |
| **第 1 周** | G-01 2048（**内容已备好**）、G-07 Hangman | 2048 的 780 词文案在 PRD §6.5 已成稿，可直接验证内容模板 |
| **第 2–3 周** | G-02 Klondike、G-03 Mahjong、G-09 Minesweeper | 商业价值最高的三款，值得花时间做深 |
| **第 4–6 周** | G-05 Four in a Row、G-08 Nonogram、G-11 Idle Venture | 中等工程量 |
| **第 7 周+** | G-04 Chess（需组装 + AI）、G-10 Sudoku（需自研 UI） | 工程量最大的两款，放最后 |

> **给工程师的提醒**：G-03 Mahjong 的素材裁剪（63MB → 2MB）和 G-10 Sudoku 的 UI 自研是两个隐藏工作量点，排期时请单独计入。

---

## 5. `licenses.json` 台账初始数据

工程师可直接使用以下结构（对应 PRD R-024）：

```json
[
  {
    "slug": "2048",
    "title": "2048",
    "source_type": "self_hosted",
    "source_url": "https://github.com/gabrielecirulli/2048",
    "author": "Gabriele Cirulli",
    "license": "MIT",
    "license_url": "https://github.com/gabrielecirulli/2048/blob/master/LICENSE.txt",
    "assets_license": "MIT (same repo, no third-party assets)",
    "trademark_renamed_from": null,
    "verified_at": "2026-08-04",
    "attribution_rendered": "2048 by Gabriele Cirulli · MIT License"
  },
  {
    "slug": "block-drop",
    "title": "Block Drop",
    "source_type": "self_hosted",
    "source_url": "https://github.com/dionyziz/canvas-tetris",
    "author": "Dionysis Zindros",
    "license": "MIT",
    "license_url": "https://github.com/dionyziz/canvas-tetris/blob/master/LICENSE.md",
    "assets_license": "N/A (canvas-drawn, no assets)",
    "trademark_renamed_from": "Tetris (Tetris Holding LLC)",
    "verified_at": "2026-08-04",
    "attribution_rendered": "Based on canvas-tetris by Dionysis Zindros · MIT License"
  },
  {
    "slug": "mahjong-solitaire",
    "title": "Mahjong Solitaire",
    "source_type": "self_hosted",
    "source_url": "https://github.com/ffalt/mah",
    "author": "ffalt",
    "license": "MIT",
    "license_url": "https://github.com/ffalt/mah/blob/main/LICENSE",
    "assets_license": "MIXED — code MIT; tiles: uni.svg Public Domain, riichi.svg CC-BY-4.0 (FluffyStuff); backgrounds: Unsplash License. animals.svg and cheshire137.svg REMOVED (no licence).",
    "extra_attribution": [
      "Riichi tile set by FluffyStuff, CC BY 4.0",
      "Unicode tile set by Shizhao, Public Domain (Wikimedia Commons)"
    ],
    "trademark_renamed_from": null,
    "verified_at": "2026-08-04",
    "attribution_rendered": "Mahjong Solitaire (Mah) by ffalt · MIT License"
  }
]
```

> 其余 9 款按同样结构补齐。**`verified_at` 字段必填**——许可证会变，半年后需要复核。

---

## 6. 核实声明

- 本清单 12 款游戏的许可证信息，全部来自 GitHub REST API 在 **2026-08-04 01:30–01:46 UTC** 的实际返回值，包含 `/repos/{repo}` 的 `license.spdx_id` 字段与 `/repos/{repo}/license` 的 LICENSE 文件名确认。
- `ffalt/mah` 的素材授权额外核实了仓库内 `src/assets/svg/README.md`、`src/assets/img/README.md`、`src/assets/sounds/README.md` 三个文件的实际内容。
- **未通过核实的候选一律未列入**，被否决的 4 款已在 §0 公开列出及原因。
- 商标风险判断基于公开可查的权利人信息，**属产品经理的风险提示，不构成法律意见**。若客户后续商业规模扩大，建议就商标使用咨询专业律师。
- **复核建议：每 6 个月重新跑一次许可证核查**，仓库所有者有权随时变更许可证（虽然已发布版本的授权不可撤销，但新版本可能变更）。

---

**文档结束 · v1.0 · 许清楚（产品经理）· 2026-08-04**
