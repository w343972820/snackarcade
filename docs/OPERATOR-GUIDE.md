# SnackArcade 零基础操作手册（站长版）

> 写给完全没做过网站的站长。跟着每一步做，不需要懂编程。
> 你的网站是一个 **纯静态站**，所有页面在"构建"时一次性生成好，
> 托管在 Cloudflare 的免费服务器上。所以——

## ⭐ 最关键的 3 句话（先读这个）

1. **你不需要买服务器、不需要搭环境、不需要运维。** "服务器"这件事已经被 Cloudflare 的免费静态托管解决掉了，全球 CDN，自带 HTTPS。
2. **全流程唯一必须花钱的：一个域名（约 ¥70–110/年）。** 其他所有服务（托管、搜索控制台、广告联盟）都是免费档。
3. **只有 3 类操作必须你本人实名做**（注册账号、验证身份、收 PIN 码），其余加游戏、改文案、发文章，我可以全程代劳。

---

## 一、全流程地图（一共 16 步，对应后面的章节）

```
【一次性的地基 · 1-2 天】
 第1步 买域名            → 花 ¥70-110，选 .com
 第2步 注册 Cloudflare   → 免费，把域名 DNS 迁过去
 第3步 部署到 Pages      → 免费托管，网站上线
 第4步 绑定域名 + HTTPS  → 用你自己的网址访问
 第5步 配好环境变量      → 告诉网站"我的域名是谁"
 第6步 Google 验证       → Search Console + 提交 sitemap
【内容积累 · 几周到几个月】
 第7步 堆游戏到 30-50 款 → 现在只有 3 款，不够（详见第 7 节）
【开始赚钱 · AdSense 审核通过后】
 第8步 申请 AdSense      → 免费，审核 2-4 周
 第9步 过审后开广告      → 一个开关，上线变现
【长期维护 · 每月 25 分钟起】
 第10步 每月例行维护     → 保命线清单
```

**现在的你卡在：第 3 步还没做**（网站代码已 100% 完成并通过测试，就在你电脑的 `E:\test\h5-games-site\` 里，还没传到网上）。

---

## 二、需要你准备的东西

| 需要 | 要花钱吗 | 说明 |
|---|---|---|
| 邮箱 | 免费 | 一个常用邮箱，收验证码用（注册域名、Cloudflare、Google 都用它） |
| 支付宝/信用卡 | 只有买域名用 | 域名约 ¥70-110/年 |
| 手机 | 免费 | 收短信验证码 |
| **护照或身份证** | 免费 | 后期 AdSense 提现要验证身份（第 8 步才用到，不急） |
| **能收信的地址** | 免费 | AdSense 会寄一张 PIN 码明信片（第 8 步后，不急） |

> 你不需要：服务器、域名解析知识、HTML/编程知识、Git 知识（有 GitHub 时我带你照抄命令即可）。

---

## 三、第 1 步：买域名（唯一花钱的地方）

**买什么：** 推荐 `snackarcade.com`（如果你的品牌名已被注册，试 `snackarcade.net` / `playsnackarcade.com` 等变体，选一个越短越好、好记的 `.com`）。

**在哪买（二选一）：**
- **推荐 Namecheap.com**：对新用户友好，中文界面不全但流程简单，支持支付宝。
- **Cloudflare Registrar（cloudflare.com）**：成本价，最便宜，但需要先注册 Cloudflare 账号（正好第 2 步要用）。

**操作步骤（以 Namecheap 为例）：**
1. 打开 `namecheap.com` → 点搜索框，输入 `snackarcade` → 回车。
2. 在结果列表里找到 `.com` 那行，看价格（首年一般 $9-11 左右），点 **Add to Cart**。
3. 点右上角购物车 → **Checkout**。
4. 注册账号（邮箱 + 密码），填账单信息 → 用支付宝付款。
5. 付款后去邮箱点确认链接，域名就归你了。

> ⚠️ 域名注册完先**别动**任何设置，第 2 步要把它的 DNS 迁到 Cloudflare。

---

## 四、第 2 步：注册 Cloudflare + 接入域名

Cloudflare 是免费的 CDN + DNS 服务商，我们的网站托管也用它。

1. 打开 `dash.cloudflare.com` → **Sign up** → 填邮箱、密码 → 邮箱里点确认。
2. 登录后点 **Add a site** → 输入你的域名 `snackarcade.com` → 选 **Free** 计划。
3. Cloudflare 会自动扫描你的域名记录，显示一页 DNS 记录列表 → 点 **Continue**。
4. 它会给你两个 **nameserver（NS）地址**，长得像 `xxx.ns.cloudflare.com`。复制下来。
5. 回到 Namecheap（或你买域名的网站）→ 登录 → 找到你的域名 → **Domain List → Manage → Nameservers**。
6. 把原来的 NS 改成 Cloudflare 给的那两个 → 保存。
7. 回 Cloudflare 点 **Done, check nameservers**。
8. **等待 5 分钟～48 小时**（一般 1 小时内）直到 Cloudflare 显示 "Active"。
   - 期间网站没上线是正常的，我们还没部署，不急。

> 这一步做完，你的域名"钥匙"就交到 Cloudflare 手里了，后面所有设置都在 Cloudflare 做。

---

## 五、第 3 步：把网站部署到 Cloudflare Pages（网站上线）

这是"服务器搭建"的核心——**不用搭**，把构建好的文件夹传上去即可。两种方式，选一种：

### 方式 A：GitHub 自动构建（推荐，以后更新最省事）

网站代码放 GitHub，每次更新代码，Cloudflare 自动重新构建上线。

1. 注册 GitHub（`github.com` → Sign up，免费）。
2. 我帮你把 `E:\test\h5-games-site\` 的代码推送到你的 GitHub 仓库（这步我远程带你做，或你授权我做）。
3. 回到 Cloudflare 控制台 → 左侧菜单 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
4. 授权连接你的 GitHub → 选择刚才的仓库。
5. 构建配置照抄：
   - **Framework preset**：`Astro`
   - **Build command**：`npm run build`
   - **Build output directory**：`dist`
6. 点 **Save and Deploy**。等 1-3 分钟，Cloudflare 给你一个临时网址（`xxx.pages.dev`）。
7. 用那个临时网址打开，能看就是上线了（先看临时网址，第 4 步再绑你的域名）。

### 方式 B：不用 GitHub，直接上传（最快速上线）

不想碰 GitHub 就用这个，把构建产物拖上去：

1. 在你电脑上打开终端（Win 键 → 输入 `cmd` → 回车），输入：
   ```bash
   cd /d E:\test\h5-games-site
   npm install
   npm run build
   ```
   （构建产物会生成在 `dist` 文件夹，约 95 个文件、2MB）
2. Cloudflare 控制台 → **Workers & Pages** → **Create** → **Pages** → **Upload assets**。
3. 把 `E:\test\h5-games-site\dist` 整个文件夹**拖进**上传框 → 点 Deploy。
4. 1 分钟后得到一个临时网址，打开能玩就成功了。

> 方式 B 的缺点：以后每次改内容要重新 build + 重新上传。方式 A 以后更新只用在 GitHub 上改文件，云端自动重建。**建议先用方式 B 快速验证，稳定后转 A。**

---

## 六、第 4 步：绑定你的域名 + 自动 HTTPS

1. Cloudflare → 进入你的 Pages 项目 → **Custom domains** → **Set up a custom domain**。
2. 输入 `snackarcade.com` → 点 **Continue** → **Activate domain**。
3. Cloudflare 自动加好 DNS 记录，然后自动签发 HTTPS 证书（几分钟～1 小时）。
4. 等状态变绿（Active），打开 `https://snackarcade.com`，看到你的网站就成功了。

> 你的域名从此自带 🔒 HTTPS（绿色小锁），这是 AdSense 和 Google 排名的硬性要求，Cloudflare 免费给你办好了。

---

## 七、第 5 步：配好环境变量（很关键，别漏）

网站生成时要用你的真实域名，否则 Google 会收录成 Cloudflare 的临时域名，白干。

- 方式 A（GitHub）：Cloudflare Pages → 项目 → **Settings → Environment variables** → 添加：
  - 名称 `PUBLIC_SITE_URL`，值 `https://snackarcade.com`
  - 名称 `PUBLIC_ADSENSE_PUB_ID`，值留空先不填（等 AdSense 通过后填，见第 9 步）
  - 保存后点 **Redeploy** 重新部署一次。
- 方式 B（直接上传）：在本地 `E:\test\h5-games-site\` 里把 `.env.example` 复制一份改名 `.env`，打开把第一行改成 `PUBLIC_SITE_URL=https://snackarcade.com`，然后重新 `npm run build` + 重新上传。

> 验证方法：打开你的网站，右键 → 查看网页源代码，搜索 `snackarcade.com`，应该出现在 canonical 标签里。

---

## 八、第 6 步：Google Search Console 验证 + 提交 sitemap

让 Google 开始收录你的网站。

1. 打开 `search.google.com/search-console` → 用你的 Google 账号登录（没有就注册一个，免费）。
2. 点 **添加资源** → 选 **网域** → 输入 `snackarcade.com` → 继续。
3. Google 给你一条 DNS TXT 记录 → 复制。
4. 到 Cloudflare → 你的域名 → **DNS → Records → Add record**：
   - 类型 `TXT`，名称填 Google 给的，内容填 Google 给的 → 保存。
5. 回 Search Console 点 **验证**。成功后就进入后台了。
6. 左侧 **Sitemap** → 输入 `sitemap-index.xml` → 提交。
7. **之后每周来看一次**：左侧 **网页索引编制** → 看"已编入索引"的数量有没有涨（这就是你内容的收录进度）。

> 站点地图文件我们已经在代码里生成好了，就 2 个：`sitemap-index.xml` 和 `sitemap-0.xml`，提交总索引即可。

---

## 九、第 7 步：游戏数量够不够？（直接回答你）

**现在的 3 款：不够。** 说清楚为什么、差多少：

| 关卡 | 需要 | 你现在 | 状态 |
|---|---|---|---|
| 网站技术验证 | 1 款能玩就行 | 3 款 | ✅ 够了 |
| AdSense 申请**硬底线**（约 50% 通过率） | **30 个游戏页** + 合规页 ≈ 40 页 | 3 个游戏页 | ❌ 差 27 款 |
| AdSense 申请**推荐线**（约 80% 通过率） | **50 个游戏页** + 5 篇专题 ≈ 65 页 | 3 个游戏页 | ❌ 差 47 款 |

> 被 AdSense 拒一次**没有任何惩罚**，整改后 2-4 周可再申请。所以可以先试硬底线。

**加游戏对你是零技术门槛**——每一款游戏 = 一个 Markdown 文件（`src/content/games/游戏名.md`），框架会自动生成：详情页、分类页、相似游戏推荐、sitemap。**内容写完，重新部署就上线**（方式 B 上传 / 方式 A 推 GitHub）。

**堆游戏的两档节奏**（详细排期见 `docs/CONTENT-SOP.md` §3）：

| | 轻量档（每周 1 款） | 标准档（每周 3 款） |
|---|---|---|
| 每周投入 | 1.5-2 小时 | 3.5-4 小时 |
| 摸到硬底线(30款) | 第 8 个月 | 第 3 个月 |
| 摸到推荐线(50款) | 第 13 个月 | 第 4 个月 |
| 适合 | 先做着看看 | 想尽快过审 |

**我的建议（结合你说"先做出来看看"）：**
1. **先把现在 3 款部署上线**（1-2 天，第 1-6 步）——把全流程跑通，验证技术链路，学会部署；
2. 然后**从 12 款游戏选品清单里（`docs/GAME-SEEDLIST.md` 已备好，许可证都核过）逐款加**，优先冲 30 款硬底线；
3. 游戏内容（英文介绍/攻略/FAQ）**我帮你写**，你只需要每周确认 1-3 款加进去。

---

## 十、第 8 步：申请 Google AdSense（审核通过后网站开始赚钱）

**前提（务必逐项打勾）：**
- [ ] 网站已绑定自己的域名，HTTPS 正常
- [ ] 游戏页 ≥ 30 个（硬底线）/ ≥ 50 个（推荐）
- [ ] 5 个合规页齐全：About / Privacy Policy / Terms / Contact / DMCA（**代码里已全部生成好了**，你只用在设置里把联系邮箱改成真的）
- [ ] Search Console 显示"已编入索引" ≥ 30 页
- [ ] `/ads.txt` 能访问（**代码已自动生成**，等填了 publisher ID 后重新部署即生效）

**申请步骤：**
1. 打开 `adsense.com` → 用 Google 账号登录。
2. 填网站地址 `https://snackarcade.com` → 填邮箱、国家 → 接受条款。
3. 提交后进入审核（**2-4 周**）。期间保持网站正常、持续加游戏，不要改版。
4. 审核通过 → 登录 AdSense → 记下你的 **publisher ID**（`ca-pub-` 开头一长串数字）。
5. **过审后回到第 5 步**，把 `PUBLIC_ADSENSE_PUB_ID` 填成这个 ID → 重新部署 → `/ads.txt` 生效。

**过审后还会遇到两件实名的事（到那一步我提醒你）：**
- **收 PIN 码明信片**：AdSense 会往你填的地址寄一张带 PIN 的明信片（国内 2-4 周），收到后在后台输入 PIN 验证地址。
- **填 W-8BEN 税务表**：非美国居民提现前要填，后台有指引，用护照信息填。

---

## 十一、第 9 步：过审后开广告（一个开关）

1. 打开 `src/config/ads.ts`，把 `ENABLED_IN_CODE` 从 `false` 改成 `true`。
2. 重新部署。
3. 你的游戏详情页就会显示广告了。
> 想换广告网络（比如以后换 Mediavine）：改 `NETWORK` 为 `'mediavine'` + 填 `PUBLIC_MEDIAVINE_SITE_ID`，页面代码不用动。

---

## 十二、第 10 步：长期维护（保命线）

**🟢 保命线（每月 25 分钟，站不会死）：**
- [ ] 每月检查域名是否快到期（提前 30 天续费，**域名断了 = 一切归零**）
- [ ] 每 2 周看一眼 Search Console 有没有报错
- [ ] 广告上线后每月看一眼 AdSense 后台金额

**🟢 推荐线（每月 2 小时，站不掉队）：**
- 保命线 + 每周加 1-3 款游戏（内容我帮你写）

> ⚠️ **6 件不可逆/易忘的事**：域名续费（最重要）、AdSense PIN 明信片地址、W-8BEN 税务表、Cloudflare 账号邮箱、Google 账号、代码备份（`E:\test\h5-games-site\` 建议每月复制一份到网盘）。

---

## 十三、本地预览（随时看效果）

在项目目录 `E:\test\h5-games-site\` 打开终端：

```bash
npm install        # 第一次执行，装依赖（已完成就不用）
npm run dev        # 启动本地预览，浏览器打开 http://localhost:4321
```

改完内容要上线：`npm run build`（会自动校验内容合法性，有问题会告诉你哪个文件哪错了）→ 按第 3 步方式上传/推送。

---

## 十四、FAQ

**Q：一定要买域名吗？用免费的 pages.dev 行吗？**
A：技术上行，但 AdSense 大概率不认临时域名，且 SEO 权重难积累。域名一年 ¥70-110，必须花。

**Q：Cloudflare 免费够用吗？**
A：够。你的站是纯静态，95 个文件 2MB，免费档每月 500 次构建、无限流量，个人站完全够。等游戏超过几千文件（约 300+ 款）才需要考虑 R2，那也免费。

**Q：我不会用 GitHub 怎么办？**
A：用方式 B（直接上传 dist）就行，全程拖拽，不碰 GitHub。以后量大了再让我帮你接 GitHub。

**Q：AdSense 被拒了会怎样？**
A：没惩罚。按拒信原因整改（通常就是内容不够/合规页问题），2-4 周后再申请。

**Q：这些账号密码要不要给你？**
A：不要给我密码。需要我操作的环节，你授权一次我操作一次，你本人在旁边看着做最安全。

---

*本文档由 SnackArcade 开发团队汇编。配套文档：`docs/PRD.md`（产品设计）、`docs/ARCHITECTURE.md`（技术架构）、`docs/CONTENT-SOP.md`（内容运营排期，最重要的长期文件）、`docs/GAME-SEEDLIST.md`（12 款备选游戏清单）。*
