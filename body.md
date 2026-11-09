### v1.3.0 What's Changed from v1.2.0 to v1.3.0

**Version type: Stable**

**Added**

- Add an online component viewer: every push runs the full gate suite (strict typecheck, 85 tests, five-point self-check) and auto-deploys both build artifacts to GitHub Pages — https://xiaokentrl.github.io/wails3-guides/
- Add a standalone single-file HTML build (~19MB, all JS/CSS/monaco workers inlined): double-click to browse every component offline, no server needed
- Make the playground sidebar collapsible via a persistent edge handle; the collapsed state is remembered across sessions (localStorage)
- Make first-level menu groups collapsible per group, with aria-expanded state
- Make the sidebar width drag-adjustable at its right edge (160–480px clamp), persisted across sessions
- Add a ui/README usage guide: quick start, command cheat sheet, consumption rules and the integration peer-library table
- Add npm scripts: dev / build (dual artifacts) / build:portable / build:single / test / typecheck
- Add a CI workflow that runs the gates and builds dual artifacts on every push

**Changed**

- Formalize every integration peer dependency and the test stack in .preview/package.json, ending the repeated package loss caused by --no-save installs
- Pin monaco-editor to ^0.57.0 (offline resolution drifted to 0.52, breaking deep imports and worker aliases)
- Standardize the single-file artifact name to standalone.html inside dist/
- Bring docs/EXAMPLES.tsx into type-check scope and refresh it with new-component sections
- Surface the "restart dev server after editing ui/" rule in the quick-start notes (vite watches the root only)
- Link the library entry from the repository READMEs (EN + 中文)

**Fixed**

- Fix CheckableTag checked-state hover: primary text on primary background was unreadable — the hover tint is now scoped to the unchecked state
- Fix CI checkout missing the node_modules symlink that ui/ type resolution depends on
- Fix workflow startup failure caused by the invalid permission scope administration: write

**Removed**

- （无 / none）

---


---
### v1.3.0 相比 v1.2.0 更新内容

**版本类型：稳定版**

**新增**

- 组件库在线查看地址上线：每次 push 自动跑全部质量门（strict 类型检查、85 用例测试、五项自查）并部署双产物到 GitHub Pages —— https://xiaokentrl.github.io/wails3-guides/
- 新增单文件 HTML 构建（约 19MB，全部 JS/CSS/monaco worker 内联）：双击即可离线浏览全部组件，无需服务器
- playground 侧栏支持整体收起/展开：常驻右缘把手，收起状态跨会话记忆（localStorage）
- 一级菜单（分组标题）支持逐组折叠/展开，带 aria-expanded 状态
- 侧栏宽度支持右缘拖拽调整（160–480px 钳制），跨会话记忆
- 新增 ui/README 使用指南：快速开始、命令速查、消费规则、集成 peer 库对照表
- 新增 npm scripts：dev / build（双产物）/ build:portable / build:single / test / typecheck
- 新增 CI 工作流：每次 push 自动跑质量门并构建双产物

**修改**

- 全部集成 peer 依赖与测试栈正式化进 .preview/package.json，终结 --no-save 安装反复丢包的问题
- monaco-editor 钉回 ^0.57.0（离线解析漂移到 0.52，深层导入与 worker 别名失配）
- 单文件产物标准化命名：dist/ 内统一为 standalone.html
- docs/EXAMPLES.tsx 纳入类型检查范围，并补挂新组件速览节
- 快速开始注记补充「改动 ui/ 源码后需重启 dev server」规则（vite 仅监视 root）
- 仓库双 README（EN + 中文）顶部挂组件库入口指引

**修复**

- 修复 CheckableTag 选中态 hover 不可读：主色底被 hover 主色字覆盖——hover 变色收窄到未选中态
- 修复 CI 检出缺失 node_modules 符号链接导致 ui/ 类型解析失败
- 修复工作流启动期失败：移除非法权限作用域 administration: write

**删除**

- （无 / none）

---

