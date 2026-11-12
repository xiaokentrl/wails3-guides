# @kickoff/ui —— 前端公共组件库

面向 Wails3 桌面应用的 React 18 + TypeScript 组件库。**源码直发、零运行时依赖**（消费方打包器负责编译），CSS 变量令牌驱动（light / dark 双主题）。

> 定版范围与项目期验证交接单 → [`docs/交付清单.md`](./docs/交付清单.md) · 逐组件卡 → [`docs/COMPONENTS.md`](./docs/COMPONENTS.md)

---

## 定版范围（v1.2.0）

| 维度 | 数量 |
|---|---|
| 通用组件（components/） | 108 源文件 |
| 业务组件（business/） | 3（SearchForm · AdvancedTable · OrgSelector） |
| 集成封装（integrations/） | 7（echarts / leaflet / monaco / xterm / tiptap / tldraw / qrcode） |
| index.ts 导出名 | 193 |
| playground 演示 | 117 项 / 10 分组 |
| 测试 | 10 文件 · 87 用例全绿（已真实执行） |

---

## 快速开始（本地预览 playground）

```bash
# 1. 安装预览宿主依赖
cd .preview
npm install

# 2. 建立依赖符号链接（仓库根的 node_modules → .preview/node_modules）
cd ..
ln -s .preview/node_modules node_modules

# 3. 启动 playground
cd .preview
npx vite --port 5183
```

浏览器打开 **http://127.0.0.1:5183** —— 左侧 10 分组 / 117 个实时演示，点击即交互。

> [!NOTE]
> playground 是开发预览宿主，不是发布物。组件库本体在 `ui/` 源码目录。
>
> [!IMPORTANT]
> vite 只监视 root（`.preview/`）内的文件——**改动 `ui/` 源码后需重启 dev server**（Ctrl+C 后重跑 `npx vite`），否则浏览器拿到的是旧的内存变换缓存。

## 常用命令速查

| 命令 | 作用 | 位置 |
|---|---|---|
| `npx vite --port 5183` | 启动 playground 预览 | `.preview/` |
| `npm run build` | 打包：**自动产出便携目录版 + 纯静态单文件 HTML**（→ `dist/`） | `.preview/` |
| `npm run typecheck` / `npm test` | 类型检查 / 测试 | `.preview/` |
| `npx vitest run` | 运行全部测试（87 用例） | `.preview/` |
| `npx tsc -p tsconfig.ui.json` | 全库 strict 类型检查 | `.preview/` |
| `node scripts/check.mjs` | 六项自查（重复导出/DOM 类型遮蔽/demo 导入/CSS 裸色值/id 重复/指南代码块可解析） | `ui/` |
| `npx vite build --base=./` | 编译**便携目录版**（相对路径 assets） | `.preview/` |
| `npx vite build --config vite.config.singlefile.mjs` | 编译**单文件版**（全内联，双击即开） | `.preview/` |

## 编译纯静态 HTML（离线查看组件）

两种产物，均无需 Node 环境即可查看：

```bash
cd .preview
npm run build   # 一条命令双产物：dist/ 便携目录版 + dist/standalone.html 单文件版
```

> [!TIP]
> **每次 push 到 main，GitHub Actions 自动打包并发布到 GitHub Pages**：
> https://xiaokentrl.github.io/wails3-guides/ （便携版在线查看；`standalone.html` 同地址可下载）。
>
> **发版**：打 `v*` 标签并推送（`git tag -a v1.3.0 -m "…" && git push origin v1.3.0`），CI 自动创建 GitHub Release——双语说明自动从 RELEASES.md 提取，并附单文件 HTML 产物。

| 产物（都在 `dist/`） | 查看方式 |
|---|---|
| `standalone.html`（~19MB 全内联） | **直接双击打开**（离线可用，可拷到任意机器） |
| `index.html` + `assets/`（便携目录版，~2MB gzip） | 任意静态服务器托管（如 `python3 -m http.server 8080`） |

单步构建可用 `npm run build:portable` / `npm run build:single`；构建配置见
`.preview/vite.config.singlefile.mjs`（monaco worker `?worker&inline` 内联别名）。

> [!NOTE]
> 直接双击打开**目录版**的 index.html 不可行——ES module 脚本受 file:// 跨域限制，必须经服务器；
> 单文件版因全部内联，无此限制。构建配置见 `.preview/vite.config.singlefile.mjs`
> （含 monaco worker `?worker&inline` 内联别名，与主配置的独立 worker 文件形成对照）。

## 在你的项目中使用

### 迁移方式：整目录复制

按跨项目资产规则，**把整个 `ui/` 目录复制到你的前端工程**（如 `frontend/src/ui/`），禁止 fork 式散抄——组件改动必须回流上游。Wails3 项目放入 `frontend/src/ui/` 后，`wails dev` / `wails build` 经由 Vite 编译，**无需任何预编译步骤**。

### 消费代码

```tsx
// 只从桶导入（ui/index.ts 是唯一出口）
import { Button, Table, MultiSelect, AppShell, exportCsv, ThemeProvider } from './ui/index';

// 令牌：应用入口引入一次（唯一颜色/间距/圆角/动效源）
import './ui/tokens/tokens.css';
```

```tsx
// 典型组合：主题 + 应用外壳 + 数据网格
<ThemeProvider defaultTheme="system">
  <AppShell header="我的应用" sider={<nav>…</nav>} collapsible footer="就绪">
    <Table
      columns={[{ key: 'name', title: '名称', width: 200 }]}
      rows={rows}
      rowKey={(r) => r.id}
      selection={{ selected, onChange: setSelected }}
      scrollY={400}
      virtual={{ rowHeight: 36 }}
    />
  </AppShell>
</ThemeProvider>
```

主题切换：根节点设置 `data-theme="dark" | "light"`（跟随系统 + 手动覆盖的逻辑在应用层）。

### 集成封装（按需安装 peer 库）

`integrations/` 下的 7 个封装**不进桶导出**——用哪个装哪个的 peer 库，然后直接从文件引入：

| 封装 | peer 库 |
|---|---|
| Chart（图表） | `echarts` |
| Map（地图） | `leaflet`（CSS 由使用方引入） |
| CodeEditor（代码编辑器） | `monaco-editor` |
| Terminal（终端） | `@xterm/xterm` + `@xterm/addon-fit` |
| RichText（富文本） | `@tiptap/react` + `@tiptap/pm` + `@tiptap/starter-kit` |
| Whiteboard（白板） | `tldraw` |
| QrCode（二维码） | `qrcode` |

统一四件套模式：懒加载 peer 库 / Loading 兜底 / ResizeObserver 自适应 / 卸载即销毁。

---

## 目录结构

```
ui/
├── index.ts            # 桶导出（唯一消费出口，193 导出名）
├── package.json        # @kickoff/ui（private；peer: react/react-dom）
├── tokens/             # 设计令牌（唯一颜色/间距/圆角/动效源，明暗两套）
├── lib/                # 工具层：useFocusTrap · modalStack · timing · read · format · calendar · download · upload · portal
├── components/         # 108 个通用组件（.tsx + 配套 .css）
├── business/           # 业务组件：SearchForm · AdvancedTable · OrgSelector
├── integrations/       # 7 个外部库集成封装
├── playground/         # 演示注册表（registry + demos + 外壳）
├── tests/              # 10 个测试文件 · 87 用例（vitest + RTL）
├── scripts/check.mjs   # 六项自查脚本
└── docs/               # 组件卡 · 全景 · 交付清单 · 可运行示例
```

## 文档索引

| 文档 | 内容 |
|---|---|
| [`docs/COMPONENTS.md`](./docs/COMPONENTS.md) | 逐组件卡：能力、键盘、无障碍、待验证项 |
| [`docs/交付清单.md`](./docs/交付清单.md) | 定版范围、质量门证据、项目期验证交接单 |
| [`docs/组件库全景.md`](./docs/组件库全景.md) | 七层分类总图与选型 |
| [`docs/EXAMPLES.tsx`](./docs/EXAMPLES.tsx) | 可运行示例（挂任意路由冒烟） |

---

## 纪律（写新组件前必读）

1. **样式只引用 `--ui-*` 令牌，禁裸值**（`scripts/check.mjs` 第 4 项覆盖）
2. **IME 纪律**：输入组件不拦截/不改写组合态值；格式化在 compositionEnd 后
3. **无障碍**：每个可交互组件有完整语义与键盘路径；焦点可见；状态不只靠颜色
4. **无障碍名称**：纯图标组件的 `label` 必填（类型强制）
5. **模态弹框必须走 useFocusTrap（modal 模式）**：参与弹框栈（z-index 推导 / 滚动锁引用计数 / Escape 只关最上层），不得自写 body overflow
6. **零运行时依赖**：不引入 CSS-in-JS / UI 框架；CSP 友好
7. **平台相关行为先验证**：未验证标注「待验证」（见组件卡），不标注待验证的行为不存在

## 项目期验证清单（接手即做）

以下「待验证」项需要真实 Wails3 环境逐项核销（完整清单见交付清单第四节）：

1. **三引擎一致性**：WebView2 / WebKitGTK / Chromium 逐组件冒烟
2. **真实 IME**：TextInput / EditableText / PinInput / Mentions / AutoComplete 组合态
3. **系统能力接线**：NotificationRouter 桥接注入、Terminal 接 pty、FileDialog 接真实 FS
4. **网络与离线**：OfflineIndicator 的 WebView 事件可靠性、RichText 导出接 DOMPurify
5. **持久化决策**：Whiteboard persistenceKey、Splitter 百分比落定、DatePicker 规范值
6. **权限投影**：PermissionGate 权限键与领域层对齐
7. **深树/大数据实压**：Cascader 搜索、VirtualizedTree、Table 虚拟滚动
