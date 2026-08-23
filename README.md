# 槐安村事件 · ARG（另类实境游戏）

一个部署在 GitHub Pages 上的中式恐怖 ARG（Alternate Reality Game）。玩家从一个"正常"的民俗研究所网站入手，逐步发现隐藏线索，穿越三层架构，最终揭开一个延续三百年的村庄秘密。

> 纯静态站点：HTML + CSS + 原生 JavaScript，零依赖，零构建。

---

## 一、目录结构

```
arg-huaian-village/
├── index.html          ← 表层入口：云隐文化研究所首页
├── about.html          ← 表层：关于我们
├── projects.html       ← 表层→中间层桥接：研究项目（含日志密码）
├── journal.html        ← 中间层：沈墨的日志（密码保护）
├── archive.html        ← 中间层：档案室（摩斯密码）
├── letters.html        ← 中间层：信件（凯撒密码）
├── map.html            ← 中间层→深层桥接：地图（三标记点）
├── cipher.html         ← 深层：封印之门（关键词解锁）
├── ritual.html         ← 深层：中元仪式（五物顺序谜题）
├── timeline.html       ← 深层：三百年时间线（故事揭示）
├── truth.html          ← 深层：真相（录音转录）
├── finale.html         ← 深层：终章（最终反转）
├── 404.html            ← 隐藏线索页
├── css/
│   └── style.css       ← 全局样式（中式恐怖暗黑主题）
├── js/
│   └── arg.js          ← 谜题验证与交互逻辑
├── .nojekyll           ← 禁用 GitHub Pages 的 Jekyll 处理
└── README.md           ← 本文件（部署与设计文档）
```

## 二、三层架构

| 层级 | 页面 | 玩家体验 |
|------|------|----------|
| **表层 Surface** | index / about / projects | 伪装成正常的"云隐文化研究所"官网，隐藏入口在源代码注释中 |
| **中间层 Discovery** | journal / archive / letters / map | 日志密码、摩斯密码、凯撒密码、地图标记，逐步揭示异常 |
| **深层 Rabbit Hole** | cipher / ritual / timeline / truth / finale | 关键词解锁、仪式顺序谜题、完整故事与最终反转 |

## 三、完整谜题链（玩家通关路线）

> ⚠️ 以下为完整剧透，玩家请勿阅读

1. **index.html** → 查看网页源代码，HTML 注释中发现入口：`/projects.html`
2. **projects.html** → 槐安村项目卡片的"项目编号: HAC-1987-0815"提示格式；数字部分 `19870815` 即日志密码；页面存在隐藏链接（`.hidden-text` / `.near-invisible`）指向 `journal.html`
3. **journal.html** → 输入密码 `19870815` 解锁沈墨日志；锁屏便签**不明说密码来源**，只以沈墨口吻暗示"那个一切开始也是一切结束的日子，一直挂在登记的项目上"——引导玩家自行回 projects.html 查看项目编号；日志末尾指向档案室；日志中埋下仪式线索①"先燃香烛，以通阴阳"
4. **archive.html** → 七张"损坏照片"下方的旧式分类标记实为摩斯密码（`.-.. . - - . .-. ...` = LETTERS）；点击"解析档案标记"按钮解码，显现信件入口；档案中"禁卷"转录埋下仪式线索③"纸船渡河，载魂过岸"
5. **letters.html** → 信件末尾的加密段落 `AOL THW YLTLTILYZ HSS` 为凯撒密码（位移 +7）；**无自动解密按钮**——玩家可点击"查看周然所长的破译笔记"获得独立提示（暗示罗马人/凯撒、字母移位、"七步之内必有真相"），自行解密后在输入框中写下译文 `THE MAP REMEMBERS ALL`（大小写、多余空格均可），验证通过才显现地图室入口；信件中埋下仪式线索②"再悬引魂幡，指引归途"
6. **map.html** → 悬停三个红色标记点显示汉字：**禁 / 封 / 渡**；依次点击三个点后出现"封印之名"入口；地图批注埋下仪式线索④"河灯明灭，照亮幽途"
7. **cipher.html** → 输入 `禁封渡` 解除封印，打字机效果展示沈墨最终文档；文档埋下仪式线索⑤"最后撒纸钱，以安亡灵"
8. **ritual.html** → 按正确顺序点击五件祭品：**香烛 → 引魂幡 → 纸船 → 河灯 → 纸钱**（顺序散布于①-⑤五个线索中）；五件祭品**对称居中排列**（上三下二），且位置**每次进入页面、以及每次点击顺序错误后都会随机洗牌**（Fisher-Yates），无法靠记位置通关；错误则重置并重新洗牌
9. **timeline.html** → 阅读 1687-2024 三百年完整时间线
10. **truth.html** → 沈墨失踪当晚的录音转录，揭示"门"与"门轴"的真相
11. **finale.html** → 分段渐显的终章：玩家即槐安村血脉的另一支传人，"欢迎回家"

## 四、部署到 GitHub Pages

### 方法 A：独立仓库（推荐）

1. 在 GitHub 上新建一个公开仓库，例如 `arg-huaian-village`
2. 将本目录全部文件推送到仓库**根目录**：

```bash
cd arg-huaian-village
git init
git add -A
git commit -m "init: 槐安村事件 ARG"
git branch -M main
git remote add origin https://github.com/<你的用户名>/arg-huaian-village.git
git push -u origin main
```

3. 打开仓库 **Settings → Pages**
4. **Source** 选择 `Deploy from a branch`
5. **Branch** 选择 `main`，文件夹选 `/ (root)`，点击 **Save**
6. 等待 1-2 分钟，访问 `https://<你的用户名>.github.io/arg-huaian-village/` 即可

### 方法 B：放入现有仓库的 docs 目录

1. 将全部文件放入仓库的 `docs/` 目录并推送
2. **Settings → Pages → Branch** 选择 `main`，文件夹选 `/docs`，保存

### 方法 C：GitHub Desktop（无命令行）

1. 新建仓库 → **Add existing file** 拖入全部文件 → Commit → **Publish**
2. 网页端进入 Settings → Pages，按方法 A 第 4-5 步配置

### 部署注意事项

- `.nojekyll` 文件必须保留——它防止 GitHub Pages 的 Jekyll 引擎处理文件（避免以 `#`、`_` 开头的资源被忽略）
- 全部页面使用**相对路径**引用（`css/style.css`、`js/arg.js`），因此无论部署在仓库根目录还是子目录均可正常工作
- 无任何外部 CDN 依赖，离线可用

## 五、自定义与扩展

| 想改什么 | 改哪里 |
|----------|--------|
| 日志密码 | `journal.html` 的说明文字 + `js/arg.js` 中 `checkJournalPassword()` 的比对值 |
| 摩斯密码内容 | `archive.html` 照片卡片的标记符号 + 对应解码结果 |
| 凯撒密码 | `letters.html` 的 `#cipher-text` 内容（用位移 +7 加密你的原文）；验证答案由 JS 对密文自动解密得出，无需同步修改 |
| 封印之名 | `map.html` 三个标记点的 `data-char` 属性 + `cipher.html` 的说明 + `js/arg.js` 中 `checkCipherPassword()` |
| 仪式顺序 | `js/arg.js` 中 `ritualCorrect` 数组 + 各页面散布的线索文字 |
| 视觉主题 | `css/style.css` 顶部的 `:root` CSS 变量 |

## 六、设计说明

- **谜题梯度**：源代码探查（技能型）→ 数字密码（观察型）→ 摩斯/凯撒（知识型）→ 标记收集（探索型）→ 顺序仪式（综合型），难度递增
- **线索冗余**：仪式顺序在 journal、archive、map、cipher 四处重复出现，玩家漏看一处仍可通关
- **404 页面**既是氛围包装，也是给卡关玩家的兜底提示（引导回 index 查看源码）
- 所有谜题状态不依赖 localStorage——刷新即重置，方便玩家重复体验或分享给他人

---

*云隐文化研究所——从未存在过。*
