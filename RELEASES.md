# Releases

<a href="#english">English</a> · <a href="#中文">中文</a>

---

<a id="english"></a>
## English

### v1.2.0 — 2026-11-06

**【新增 / Added】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Cross-reference batches against Naive UI / Ant Design Vue / Surely Vue closed every self-buildable gap: List + ListItem, Thing + GradientText, Time (auto-refreshing relative time), AppShell (collapsible-sider desktop shell), Popselect, NavMenu (horizontal), CheckableTag, CardMeta, BadgeRibbon.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Table upgraded to a data grid: row selection (select-all + indeterminate), virtual scrolling (spacer-row scheme, 2000 rows → 19 DOM rows), expandable rows, sticky summary row, column filters (apply-as-you-check), fixed columns (sticky offsets), column resize (Pointer Capture, table-layout: fixed), grouped multi-level headers (leaf flattening feeds all of the above).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. DatePicker picker variants — date / week / month / quarter / year — on a new pure-function base `lib/calendar.ts` (ISO week incl. year-boundary ownership; 14 expectations hand-computed then runtime-verified). Integrations: QrCode (qrcode peer).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. `exportCsv` / `toCsvBlob` utilities (BOM + escaping, built on saveBlob). Self-check pipeline solidified as `ui/scripts/check.mjs` (duplicate exports / DOM-type shadowing / demo import audit / bare CSS colors / registry id dupes).

**【修复 / Fixed】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. AppShell: collapsed width pinned by flex `min-width:auto` on nowrap content — fixed with `min-width: 0`.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Popselect re-hit the KeyboardEvent shadowing trap (document keydown × react import); fixed with `globalThis.KeyboardEvent` — and the check script now catches this class permanently.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. QrCode: stale QR lingered after clearing value (ready flag not reset). Ribbon: bare `rgb()` shadow removed per token discipline.

**【更新 / Updated】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Legacy test files type-cleaned; DatePicker picker variants shipped with tests-first workflow (pure functions verified against hand-computed values before UI wiring).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. **Test suite executed for the first time** (vitest@3 + jsdom + Testing Library, 85 cases): 6 real component bugs surfaced and fixed — parseDateOnly silently rolling over illegal dates; upload resume crashing when the contract omits `existing`; uploading transition dropping `file` so resume stalled forever; Spinner polluting button accessible names; unguarded scrollIntoView/ResizeObserver; plus 5 test-side corrections (assertion targets, resolver queue, race latches).

**【其他 / Other】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Preview host peers updated (qrcode); playground at 10 groups / 118 demos; docs/EXAMPLES.tsx brought into type-check scope (3 stale API usages fixed) and topped up with new-component sections; strict tsc 0 errors maintained across all batches.

---

### v1.1.0 — 2026-11-06

**【新增 / Added】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Component library: 9 new self-built components — MultiSelect (tag overflow + select-all excluding disabled), Cascader multiple mode (tri-state subtree checkboxes + removable path tags), Highlight (fragment-split `<mark>`, XSS-immune), EmojiPicker (categories + zh/en keyword search + recents), EditableText (inline edit, IME-composition-safe), OfflineIndicator (online/offline banner), PermissionGate (hide/disable/replace strategies + Provider), Masonry measured mode (ResizeObserver shortest-column), VirtualizedTree (windowed virtualization + activedescendant keyboard).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Integration layer landed with six wrappers, all following the same pattern (lazy peer import / Spinner fallback / ResizeObserver adapt / dispose on unmount): Chart (echarts), Map (leaflet, project-decided tile source), CodeEditor (monaco + language workers), Terminal (xterm + fit + imperative write API), RichText (tiptap, two-layer lazy structure), Whiteboard (tldraw via React.lazy). Integrations are NOT re-exported from index.ts (zero-runtime-dependency discipline).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. Playground: Element-Plus-style navigator extended to 10 groups / 105 live demos, including a dedicated Integrations group.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. New test group for the batch (new-components.test.tsx) covering MultiSelect toggle semantics, Cascader tri-state, Highlight, EditableText IME discipline, PermissionGate strategies, EmojiPicker recents, VirtualizedTree virtualization/keyboard, Masonry measured smoke.

**【修复 / Fixed】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Lightbox: missing `useFocusTrap` import crashed at render; portal container moved out of render phase (shared `usePortalContainer` now serves the whole modal family: Modal/Drawer/Lightbox/CommandPalette/Tour).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. CommandPalette: undeclared `inputRef` crashed at render; now focuses its input on open.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. Cascader: missing map index crashed keyboard navigation; React `KeyboardEvent` import shadowed the DOM type breaking document listeners; single-mode pick did not settle the path (trigger echoed only the parent); keyboard listener closures went stale because `columns` (a per-render array) sat in effect deps — listeners now mount on `open` only and read state via ref mirror.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. Anchor: recursive call typo (`renderNodes`); HoverCard/Image missing type imports.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5. index.ts: 7 export names did not match actual component exports (would break consumer imports).

**【更新 / Updated】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Library-wide strict `tsc` pass established as the closing gate (0 errors); full 105-demo browser sweep with zero runtime errors.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Legacy test files type-cleaned (unused vars, implicit anys, one call-signature bug in NotificationRouter test).

**【其他 / Other】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Preview host: TypeScript + @types/react installed for semantic checking; vite worker aliases for monaco (vite 5.4 does not run exports resolution for `?worker` bare imports); cache-clear restart procedure documented.

---

### v1.0.0 — 2026-11-04

**【新增 / Added】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Established the Desktop App Kickoff Guide Library: 1 master outline + 33 topic guides, organized into 6 themes (Architecture & Data · Desktop Integration · Security & Permissions · Distribution & Updates · Quality & Diagnostics · UI System).

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Master outline: five-stage cadence (before coding / distributable milestone / MVP / public release / explicitly deferred), with 16 first-stage planning items and 14 deferred items each carrying re-evaluation triggers.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. Topic guides follow two skeletons — discipline masters (AI questions → disciplines → root causes → test matrix → AI constraint template) and implementation companions (hard goals → core design → acceptance checklist) — every companion declares its master guide.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. Cross-cutting chains wired end-to-end: command settle chain, failure-feedback chain, release chain, multi-device sync chain, recovery chain.

**【修复 / Fixed】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（无 / none）

**【更新 / Updated】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（无 / none）

**【其他 / Other】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Bilingual README with language switcher (`README.md` / `README.en.md`); usage rules for whole-directory migration; cross-project asset rules (component library `ui/`, Go shared library `lib-go/`); conventions for adding new topic guides.

---

<a id="中文"></a>
## 中文

[English](#english) · 中文

### v1.2.0 — 2026-11-06

**【新增】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 三参照库（Naive UI / Ant Design Vue / Surely Vue）对照批收口全部可自研缺口：List + ListItem、Thing + GradientText、Time（自动刷新相对时间）、AppShell（可折叠 Sider 桌面外壳）、Popselect、NavMenu（水平导航）、CheckableTag、CardMeta、BadgeRibbon。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Table 升级为数据网格：行选择（全选+半选）、虚拟滚动（spacer 方案，2000 行 → 19 个 DOM 行）、行展开、吸附汇总行、列筛选（即选即筛）、固定列（sticky 偏移）、列宽拖拽（Pointer Capture + table-layout: fixed）、多级表头（叶子扁平化供全部能力共用）。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. DatePicker 五变体 date / week / month / quarter / year，逻辑底座为新增纯函数层 `lib/calendar.ts`（ISO 周含跨年归属；14 项期望值先手算再运行时核对）。集成封装新增 QrCode（qrcode peer）。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. `exportCsv` / `toCsvBlob` 工具（BOM + 转义，基于 saveBlob）。收尾自查固化为 `ui/scripts/check.mjs`（重复导出 / DOM 类型遮蔽 / demo 导入对照 / CSS 裸色值 / registry 重复 id）。

**【修复】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. AppShell：nowrap 内容的 flex `min-width:auto` 顶住折叠宽度——`min-width: 0` 修复。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. Popselect 复踩 KeyboardEvent 遮蔽坑（document keydown × react 导入）；`globalThis.KeyboardEvent` 修复，且该类问题自此由检查脚本永久拦截。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. QrCode：清空内容后旧二维码残留（ready 未复位）。Ribbon：按令牌纪律移除裸 `rgb()` 阴影。

**【更新】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 存量测试文件类型清理；DatePicker 变体采用测试先行流程（纯函数先对手算期望值验证，再接 UI）。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. **测试套件首次真实执行**（vitest@3 + jsdom + Testing Library，85 用例）：暴露并修复 6 个真组件 bug——parseDateOnly 非法日期静默进位；恢复路径缺 `existing` 字段崩溃；uploading 转换丢 `file` 致恢复永久卡死；Spinner 污染按钮可达名；scrollIntoView/ResizeObserver 未防御；另修正 5 处测试侧问题（断言对象、resolver 队列、竞态门闩）。

**【其他】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 预览宿主 peer 库更新（qrcode）；playground 达 10 分组 / 118 演示；docs/EXAMPLES.tsx 纳入类型检查范围（修 3 处旧 API 用法）并补挂新组件速览节；全程维持 strict tsc 0 错误。

---

### v1.1.0 — 2026-11-06

**【新增】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 组件库新增 9 个自研组件——MultiSelect 下拉多选（tag 折叠 + 全选排除禁用）、Cascader 多选模式（复选框三态子树勾选 + 路径 tag 可移除）、Highlight 命中高亮（Fragment 切段 `<mark>`，免疫 XSS）、EmojiPicker 表情选择器（分类 + 中英关键词搜索 + 最近使用）、EditableText 行内编辑（IME 组合态安全）、OfflineIndicator 离线横幅、PermissionGate 权限门（hide/disable/replace 三策略 + Provider）、Masonry 测量版（ResizeObserver 最短列定位）、VirtualizedTree 虚拟化树（窗口化 + activedescendant 键盘）。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. 集成封装层落地 6 件，统一四件套模式（懒加载 peer 库 / Spinner 兜底 / ResizeObserver 自适应 / 卸载即销毁）：Chart（echarts）、Map（leaflet，瓦片源属项目决策）、CodeEditor（monaco + 语言 worker）、Terminal（xterm + fit + 命令式写屏）、RichText（tiptap，双层懒加载结构）、Whiteboard（tldraw，React.lazy）。集成件不从 index.ts 再导出（零运行时依赖纪律）。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. Playground 组件导航扩至 **10 分组 / 105 个实时演示**，新增独立「集成封装」分组。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. 新增本批测试组（new-components.test.tsx）：覆盖 MultiSelect 切换语义、Cascader 三态、Highlight、EditableText IME 纪律、PermissionGate 三策略、EmojiPicker 最近使用、VirtualizedTree 虚拟化与键盘、Masonry measured 冒烟。

**【修复】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. Lightbox：`useFocusTrap` 漏导入致渲染即崩；portal 容器移出渲染期——沉淀为共享 `usePortalContainer`，弹框家族五组件（Modal/Drawer/Lightbox/CommandPalette/Tour）统一接入。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. CommandPalette：`inputRef` 漏声明致渲染即崩；顺带补上打开时聚焦输入框。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. Cascader：map 缺 index 参数致键盘导航即崩；React `KeyboardEvent` 导入遮蔽 DOM 同名类型致 document 监听失配；单选 pick 未落定路径（触发器只回显父级）；`columns`（渲染期新数组）在 effect 依赖里导致监听器 closure 陈旧、键盘失灵——监听器改为只在 `open` 变化时挂载、状态经 ref 镜像读取。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. Anchor：递归调用名笔误（renderNodes）；HoverCard/Image 漏类型导入。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5. index.ts：7 处导出名与组件实际导出不符（会破坏消费方 import）。

**【更新】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 建立全库 strict tsc 收尾关卡（0 错误）；完成 105 个 demo 的全量浏览器巡检（运行时错误 0）。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. 存量测试文件类型清理（未用变量、隐式 any、NotificationRouter 测试一处调用签名 bug）。

**【其他】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 预览宿主：安装 TypeScript + @types/react 做语义检查；为 monaco 增加 vite worker 别名（vite 5.4 对 `?worker` 裸导入不走 exports 解析）；固化清缓存重启流程。

---

### v1.0.0 — 2026-11-04

**【新增】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 建立桌面应用立项专题指南库：1 份主大纲 + 33 份专题指南，按 6 大主题组织（架构与数据 · 桌面集成 · 安全与权限 · 分发与更新 · 质量与诊断 · 界面体系）。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. 主大纲：五档节奏（编码前 / 可分发里程碑 / MVP / 公开发布 / 明确暂缓），一档 16 条规划项，暂缓清单 14 项且每项带重新评估触发条件。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. 专题指南遵循两种骨架——纪律母法型（AI 先答问题 → 核心纪律 → 根因表 → 测试矩阵 → 实施约束模板）与实现配套型（硬性目标 → 核心设计 → 验收清单）——每份实现配套均声明其母法方案。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4. 横切链条端到端闭合：命令落定链、失败反馈链、发布链、多端同步链、恢复链。

**【修复】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（无）

**【更新】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;（无）

**【其他】**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. 双语 README 与顶部语言切换（`README.md` / `README.en.md`）；整体目录迁移的使用规则；跨项目资产规则（组件库 `ui/`、Go 公共库 `lib-go/`）；新增专题指南的收录约定。

---

## 格式约定 / Format Conventions

- 每个版本一节，标题 `### vX.Y.Z — YYYY-MM-DD`，最新版本在最上。
- 条目按四类固定标题组织：【新增】【修复】【更新】【其他】（Added / Fixed / Updated / Other）。
- 各类内容以 **1. 2. 3. … 编号条目**呈现，每条**起始处缩进 8 个空格**（以 8 个 `&nbsp;` 实现，渲染为首行缩进段落，编号手写以保证双语一致）；**该类别无内容时**，放一行 8 空格缩进的占位段落「（无）/ (none)」。
- 顶部「English · 中文」跳转至对应语言锚点；两语言内容互为镜像，任一语言新增条目时另一语言同步（含编号）。
- One section per release, newest first; entries grouped under the four fixed headings 【Added / Fixed / Updated / Other】; content presented as numbered entries (1. 2. 3. …), each indented 8 spaces (8 `&nbsp;`, numbers written literally to keep both languages aligned); empty categories carry an 8-space-indented "(none)" placeholder; the top switcher jumps between language anchors, and the two language sections mirror each other.
