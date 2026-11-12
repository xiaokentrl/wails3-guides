# Releases

<a href="#english">English</a> · <a href="#中文">中文</a>

---

<a id="english"></a>
## English

### v1.16.0 What's Changed from v1.15.0 to v1.16.0

**Version type: Stable**

**Added**

- Add 23 kickoff guides covering the gaps found in the audit, plus a new Project Governance category: binding layer & generated artifacts, CI matrix & quality gates, local secrets & key management, data model & data contracts, project scope & decision records, external links & protocol callbacks, product identity single source, production build security baseline, WebView2 runtime & graphics reliability, supply chain & dependency governance, threat modeling & security response, telemetry & privacy compliance, licensing & activation, test strategy & acceptance master guide, enterprise deployment & managed config, user docs & onboarding support, crash reporting & symbolication, client-server API contract, feature flags & remote config, in-app update experience, data portability & complete deletion, store distribution & sandbox compliance, and service dependencies & operational readiness
- Add conditional-guide triggers and a cross-cutting authority map to both READMEs, plus evidence-level conventions and a third (evidence-review) skeleton

**Changed**

- Register all 23 guides in both bilingual catalogs, the directory tree and the master outline companion list; add a one-stage gating item for kickoff scope/decision records and a stage-based index of the new guides
- Link 11 deferred items in the master outline to their governing guides, extend the one-/two-stage acceptance deliverables, and add explicit arrows from gating items to the new guides
- Add an evidence-level note to the product-identity and supply-chain guides

**Fixed**

- Correct the DASVS L1/L2/L3 claim: those levels came from a third-party paraphrase while the OWASP official definition is a draft that must not be relied on; replaced with project-defined T1/T2/T3 tiers marked "to be verified"
- Resolve the managed-policy contradiction: only explicitly locked keys outrank user preferences; unlocked explicit user settings must never be overwritten
- Remove the test master guide self-contradiction: it restated the CI layered table while listing exactly that as a defect; layering now defers to the CI guide
- Add the missing inbound reference to Service Dependencies & Operational Readiness so no guide is an orphan
- Close the remaining audit gaps: register the evidence-review guide in the master outline companion list (71/71), correct the pure-Web/no-backend deferral pointer to the frontend structure guide, complete the NFR and i18n deferral pointers, extend two-stage deliverables with traceability/ADR/risk reviews, synchronize managed-policy arbitration in the in-app update guide, align the test master guide stage-one wording with its conditional status, make both README tables clickable, and fix a missing trailing newline
- Align documentation with reality: bilingual usage rules now describe the four-section release-note format used since v1.11.0 and clarify that `lib-go/` lives in consuming projects, not this repository; CI step names and self-check docs now say six checks instead of five and reflect the current 87-case suite; the build job is skipped on tag pushes, which now matches the deploy job comment (tag pushes only need the release job)
- Close the fifth-round full audit findings: correct the top-level bilingual README demo count (118 to 117, matching the 10-group / 117-demo registry and the ui docs), remove the last unconditional "managed policy overrides user preference" statements from the enterprise deployment guide (root-cause table and AI constraint template) that contradicted its own locked-keys-only rule, and state explicitly that conditional-guide triggers are governed by the README table and each guide's five-stage positioning rather than the master outline deferred list (the two are not one-to-one)

**Removed**

- （无 / none）

---

### v1.15.0 What's Changed from v1.14.0 to v1.15.0

**Version type: Stable**

**Added**

- Add the Go Testing & Filesystem Patterns guide (专题/质量与诊断/Go测试与文件系统模式方案.md): filesystem-injection selection table (read-only `fs.FS`, read-write `afero.Fs`, untrusted names `*os.Root`), the inject-the-Fs pattern (the constructor is the seam, `main` picks the implementation), the four MemMapFs differences with on-disk contract tests (`afero.NewBasePathFs(afero.NewOsFs(), t.TempDir())` — an in-memory green test proves logic, not filesystem contract), BasePathFs is not a security boundary (symlinks escape it — use `os.Root`), unit-test discipline (table-driven, `t.Helper()`, hand-written fakes over mock frameworks, golden files in `testdata/`, `cmp` over DeepEqual), error-handling rules (errors are values, wrap with `%w` for context, `errors.Join` for batch failures), and a version-gating rule (check the go.mod floor before recommending gated features)
- Add the Write-Less Necessity Ladder (7 rungs: need it? → already in the codebase? → stdlib? → platform? → already in go.mod? → one line? → minimal implementation) with the never-cut list, named ceilings (`// yagni:`), and fix-the-root-cause-not-the-reported-path; plus the interface-design three rules (discovered, not designed upfront; defined where consumed; accept interfaces, return structs) and the zero-value-useful discipline in the shared-code guide

**Changed**

- Extend the Status & Error Codes guide with Go-side error source discipline: codes are assigned at the binding seam layer; intermediate layers only wrap with `%w` and never assign codes; batch failures aggregate via `errors.Join` and map to codes per sub-error; panics never enter the code table
- Extend the Long Tasks guide: bounded concurrency via `errgroup` `SetLimit` (no hand-rolled semaphores or static worker pools), every goroutine must have a known exit condition (the `goroutineleak` profile as acceptance evidence — a clean profile is evidence, not proof)
- Add the dual-end test-discipline mapping to the ui delivery checklist (`it.each` = table-driven, snapshots = golden files with explicit review, assertion wrappers point failures back to the test case, light stubs over heavy mocks)

**Fixed**

- （无 / none）

**Removed**

- （无 / none）

---

### v1.14.0 What's Changed from v1.13.0 to v1.14.0

**Version type: Stable**

**Added**

- Add claims-backed tests for the zero-runtime-dependency discipline: @kickoff/ui has empty `dependencies` (peer `react`/`react-dom` only) — the claims pattern now covers engineering-discipline entries, not just component behavior
- Extend the install-directory guide with two patterns absorbed from spf13/go-skills: plan-then-apply dry-run for uninstall/cleanup/migration (afero CopyOnWriteFs evidence: delete/move commands need an explicit two-step), and trusted-root + untrusted-parts path joining (sanitize untrusted filename parts, contain within the root — recommend spf13/pathologize + fileflow or an equivalent self-implementation)

**Changed**

- （无 / none）

**Fixed**

- （无 / none）

**Removed**

- （无 / none）

---

### v1.13.0 What's Changed from v1.12.0 to v1.13.0

**Version type: Stable**

**Added**

- Add the Single Instance & Fast Startup guide (专题/桌面集成/单实例与快速启动方案.md): single instance by default (second-launch args routed to the running instance, tray recall integration), four-milestone startup budget (process → window ≤500ms, first frame ≤1s, interactive ≤2s), UI responsiveness floor (≥100ms operations need visible feedback, no main-thread blocking); registered in both READMEs and the master outline

**Changed**

- （无 / none）

**Fixed**

- （无 / none）

**Removed**

- （无 / none）

---

### v1.12.0 What's Changed from v1.11.0 to v1.12.0

**Version type: Stable**

**Added**

- Add the dev/installed dual-mode path resolution section to the install-directory guide: dev mode uses relative paths (./dev-data with config/data/cache/logs in one root — delete the project directory for a complete cleanup), installed mode uses contract absolute paths; mode determination single-sourced in paths.Resolve
- Link the online component viewer from both repository READMEs (top of English + 中文): https://xiaokentrl.github.io/wails3-guides/

**Changed**

- （无 / none）

**Fixed**

- Fix the Linux installer manifest picking up the source machine's absolute paths (the source root itself leaked in as a "relative" path) — the source root is now skipped, directories are rebuilt via mkdir and stay out of the manifest

**Removed**

- （无 / none）

---

### v1.11.0 What's Changed from v1.10.0 to v1.11.0

**Version type: Stable**

**Added**

- Add three-platform installer/packaging scripts (packaging/): Windows NSIS (compile-verified on NSIS 3.10; resolution chain, preview-gate page, registry zero-write, manifest recursive enumeration, unified uninstaller), macOS DMG, Linux install.sh (manifest-driven install/uninstall, XDG roots) and AppImage
- Add check ⑥ to ui/scripts/check.mjs: every go/ts/tsx code fence in the guides must parse (gofmt / esbuild), with inline-elision handling
- Add the Wails3 Version Discipline guide (专题/桌面集成/Wails3框架版本判别与服务纪律方案.md): v2/v3 discrimination table, version-mixing red flags, Services lifecycle and mutex discipline, alpha pinning, WAILS_MCP=1
- Sync the GitHub Release body automatically on every push to main (bilingual notes extracted from RELEASES.md via gh release edit)
- Add claims-backed tests naming the doc sections they endorse (BOM, CSV escaping)

**Changed**

- Tighten the playground menu row height to 31px; polish sidebar alignment and group spacing; sticky demo header; constrain demo reading width
- Standardize the single-file artifact name to standalone.html (local build now matches CI)

**Fixed**

- Fix three check-⑥ self-bugs (double-scanned 分发与更新, gofmt stdin form, esbuild loader flag form)
- Fix one gap in the Wails3 guide found by claims cross-verification (frontend bindings generation)
- Fix 24 missing component cards in docs/COMPONENTS.md and 3 stale counts in the delivery manifest / ui/README

**Removed**

- Remove the stray CI intermediate file (body.md) from the repository

---

### v1.10.0 What's Changed from v1.9.0 to v1.10.0

**Version type: Stable**

**Added**

- Add a mandatory pre-install directory-tree preview gate: the tree is derived live from the contract and user choices (two roots — program + data; per-node purpose icons; program internals collapsed to counts), and "Next" stays disabled until the tree is rendered and confirmed
- Allow free relocation of any directory node during the wizard (including other drives); the subtree re-renders live, adjustments land in a change list applied at once
- Mark conflicts inline (target exists / no write permission / illegal path): node turns red and Next is disabled until fixed
- Zero Windows registry writes by default: in-app uninstaller + manifest-driven reverse execution replaces the uninstall key; startup-folder .lnk replaces the Run key; os.Executable() + config/install.json replaces InstallPath; file association (registry-only) stays the single opt-in exception

**Changed**

- The confirmed preview tree becomes the blueprint for install manifest — what you see = what you confirmed = what gets written
- Update the AI constraint template and test matrix with the preview-gate and zero-registry rows

---

### v1.9.0 What's Changed from v1.8.0 to v1.9.0

**Version type: Stable**

**Added**

- Add the Default Install Directory guide (专题/分发与更新/默认安装目录规划方案.md): a directory contract mapping six file classes to one home each across three platforms — Linux FHS/XDG, Windows resolution chain + registry (D:\ first with fallbacks), macOS Library family — with a single-source paths.go module, minimal-write registry whitelist, install manifest ("what was written is recorded"), uninstall hygiene and a 12-touchpoint supplement
- Make the playground sidebar width freely drag-adjustable to any width (0 up to the viewport limit), double-click reset to 240px, persisted across sessions

**Changed**

- Contract updated to single-root four-zone + external cache: config/data/logs share one root (backup, uninstall and troubleshooting look at one directory), while the cache alone stays in the platform location (OS cleanup tools only recognize it there); the legacy four-way split is kept as a fallback for distro-repository packaging

**Fixed**

- （无 / none）

---

### v1.8.0 What's Changed from v1.7.0 to v1.8.0

**Version type: Stable**

**Fixed**

- Fix the standalone-html CI artifact being empty since it was introduced: npm run build produced dist/ (portable) and dist-single/index.html (single-file) but never copied the single file into dist/, so the build job's "No files were found" upload was always empty. build now chains build:portable + build:single + copy:single (explicit error when dist-single/index.html is missing); build:pages aliases to build, removing its trap of copying a stale dist-single from a previous run
- Bump actions/checkout and actions/setup-node to @v5 in both jobs, clearing the Node.js 20 deprecation warnings for those two actions (the remaining warnings are upstream actions without a Node 24 major yet)

---

### v1.7.0 What's Changed from v1.6.0 to v1.7.0

**Version type: Stable**

**Fixed**

- Fix the deploy workflow's fixed concurrency group ("pages") letting a tag (release) run cancel an in-flight main Pages deployment, which ended in "deployment_queued → canceled" (run #33 during the v1.6.0 release): the group is now scoped per ref type (pages-branch / pages-tag), while successive main pushes still supersede each other
- Fix the release-notes sync step failing on main pushes that land the version bump before the tag pipeline creates the Release (which took the build job red and skipped Pages deployment): the step now skips with a notice when the version's Release does not exist yet

---

### v1.6.0 What's Changed from v1.5.0 to v1.6.0

**Version type: Stable**

**Added**

- Add the workflow-runs cleanup workflow (.github/workflows/cleanup-actions.yml): weekly cron (Sundays 00:00 UTC) plus manual dispatch; deletes workflow-run history across all workflows while keeping the latest 10 runs, so gate evidence from recent pushes stays inspectable. Ported from the same workflow in the github-net project, pitfalls documented inline

---

### v1.5.0 What's Changed from v1.4.0 to v1.5.0

**Version type: Stable**

**Added**

- Add the Tray Restore Position evidence review (专题/桌面集成/托盘唤回位置_实证复盘.md): a real "fixed twice, never took effect" post-mortem with framework-source evidence — four-gesture protocol/callback mapping, four independent failure chains, proposed fix order, acceptance record template and reusable read-only probes
- Expand the Tray & Desktop Identity guide: three-layer gesture mapping, callback registration ownership (one entry, one owner), framework timing contracts (who positions last), geometry write-side guards, fix-verification loop (five evidence layers, three automated gates), expanded root-cause table and AI constraint template

**Changed**

- Register the evidence review in both READMEs (Chinese/English catalogs + Chinese directory tree) and the master outline's companion list
- De-duplicate the Tray & Desktop Identity guide: version-bound sample tables (gesture mapping, timing contract, callback registry, all-zero persistence) now live once in the evidence review as the single source; the guide keeps the generic disciplines with pointers and carries no framework line numbers to maintain

---

### v1.4.0 What's Changed from v1.3.0 to v1.4.0

**Version type: Stable**

**Added**

- Add Release Delivery Pipeline guide (专题/分发与更新/发布交付流水线方案.md): 11-step delivery sequence, pre-push hook design, two release-doc formats with full templates, CI version arbitration, acceptance checklist and AI constraint template

**Changed**

- Register the new guide in both READMEs (Chinese catalog + directory tree, English catalog) and the master outline's companion list
- Merge the collapse handle and the resize hot zone into one dual-semantics handle (VS Code pattern): click = collapse/expand, drag = resize (4px threshold), synthetic click after drag suppressed, double-click resets, arrow keys fine-tune
- Tighten the menu row height to 31px; polish sidebar alignment and group spacing; sticky demo header; constrain demo reading width
- Standardize the single-file artifact name to standalone.html

**Fixed**

- Fix the collapse handle and the resize hot zone fighting each other (overlapping pointer targets) — resolved by the unified handle
- Bring docs/EXAMPLES.tsx into type-check scope and fix 3 stale API usages

**Removed**

- Remove the stray CI intermediate file (body.md) from the repository and add it to .gitignore

---


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

### v1.16.0 相比 v1.15.0 更新内容

**版本类型：稳定版**

**新增**

- 新增 23 篇立项专题（补齐审计发现的缺口），并新开「立项治理」分类：绑定层契约与生成物、CI 矩阵与质量门禁、本地敏感数据与密钥管理、数据模型与数据契约、立项范围与决策记录、外部链接与协议回调安全、产品身份单一源、生产构建安全基线、WebView2 运行时与图形可靠性、供应链安全与依赖治理、威胁建模与安全响应、遥测与隐私合规、授权与许可、测试策略与验收总纲、企业部署与托管配置、用户文档与上手支持、崩溃上报与符号还原、客户端与服务端 API 契约、特性开关与远程配置、应用内更新体验、数据可携带与彻底删除、商店分发与沙盒合规、服务依赖与运维就绪
- 双语 README 新增「条件性专题触发条件」与「跨域主题权威归属」两节，补证据等级约定与第三种骨架（实证复盘型）

**修改**

- 双语清单、目录树、主大纲配套列表全量登记 23 篇新专题；一档新增立项范围准入项，附录新增按档位的专题挂接索引
- 五档暂缓项 11 条补上对应专题的触发指向，一/二档产出清单补齐，关键准入项补「→ 见」挂接
- 产品身份、供应链两篇补证据等级说明

**修复**

- 修正 DASVS L1/L2/L3 的事实错误：该分级来自第三方转述，OWASP 官方分级定义仍为草案且明示不应依赖；改为项目自定义 T1/T2/T3 档位并标「待验证」
- 修复托管策略的内部矛盾：仅管理员明确锁定的键优于用户偏好，未锁定的用户显式设置不得覆盖
- 修复测试总纲的自相矛盾：它一面把「复制专题矩阵」列为缺陷，一面又重复了分层表；现改为只定组织规则，分层实现以 CI 篇为权威
- 补上《服务依赖与运维就绪方案》的入引，消除孤儿专题
- 补齐第三轮审查发现的遗漏：主大纲配套列表收录实证复盘（71/71）、「纯 Web/无后端运行」暂缓项改指《前端目录结构方案》、完整 NFR 与多语言暂缓项补全指向、二档产出清单补追踪矩阵/ADR/风险登记复核、《应用内更新体验方案》托管裁决口径与《企业部署与托管配置方案》同步、《测试策略与验收总纲》一档定位改为与条件性一致、双语两节表格改为可点击链接、补齐一处缺失的文件末尾换行
- 补齐第四轮审查发现的规则与实现不一致：双语使用规则改为描述 v1.11.0 起的四段发布格式，并说明 `lib-go/` 属于各新项目、本库不含该目录；CI 步骤名与自查文档由「五项」改为「六项」，测试数由 85 更新为当前 87 用例；build job 在标签推送时跳过，与「标签只需 release job 产出 Release」的注释一致
- 补齐第五轮全面检查发现的问题：顶层双语 README 演示数由 118 更正为 117（与 registry 的 10 分组 / 117 演示及 ui 文档一致）；删除《企业部署与托管配置方案》根因表与实施约束模板中最后一处无条件的「托管策略优先于用户偏好」，消除与本篇「仅明确锁定的键优先」纪律自相矛盾；明确条件性专题触发条件以 README 表与各专题「五档定位」为准，与主大纲五档暂缓清单不一一对应

**删除**

- （无 / none）

---

### v1.15.0 相比 v1.14.0 更新内容

**版本类型：稳定版**

**新增**

- 新增《Go测试与文件系统模式方案》（专题/质量与诊断/Go测试与文件系统模式方案.md）：文件系统注入选型表（只读 `fs.FS`、读写 `afero.Fs`、不可信名字 `*os.Root`）、注入模式（构造函数即接缝、main 选实现）、MemMapFs 四差异与磁盘契约测试（`afero.NewBasePathFs(afero.NewOsFs(), t.TempDir())`——内存绿测证明的是逻辑，不是文件系统契约）、BasePathFs 不是安全边界（符号链接可逃逸——用 `os.Root`）、单测纪律（表驱动、`t.Helper()`、手写 fake 优于 mock 框架、golden files 存 `testdata/`、`cmp` 优于 DeepEqual）、错误处理三则（错误是值、wrap 用 `%w` 加上下文、批量失败 `errors.Join`）、版本门控规则（引用版本门控特性前先核对 go.mod 下限）
- 《公共函数与Helper方案》新增写少阶梯七级（需要吗→库里→标准库→平台→go.mod→一行→最小实现）+ 永不砍清单 + `// yagni:` 命名天花板 + 修根因不修上报路径；补接口设计三条（接口是发现的不是设计的、定义在消费者包、接受接口返回具体类型）与零值可用纪律

**修改**

- 《状态码方案》补 Go 侧错误源头纪律：码在绑定收口层分配；中间层只 wrap（`%w`）不编码；批量失败 `errors.Join` 聚合并逐个子错误映射码；panic 不进码表
- 《长任务与后台工作技术方案》补两条：有界并发用 `errgroup` `SetLimit`（不手搓信号量、不写静态 worker pool）；每个 goroutine 必须有已知退出条件（`goroutineleak` profile 作验收证据——干净是证据不是证明）
- ui 交付清单补双端测试纪律映射（`it.each` = 表驱动、快照 = golden files 变更显式审查、断言包装把失败指回用例、轻 stub 优于重 mock）

**修复**

- （无 / none）

**删除**

- （无 / none）

---

### v1.14.0 相比 v1.13.0 更新内容

**版本类型：稳定版**

**新增**

- 新增「零运行时依赖」纪律的 claims 背书测试：@kickoff/ui 的 `dependencies` 为空（仅 peer `react`/`react-dom`）——claims 模式从组件行为扩展到工程纪律条目
- 《默认安装目录规划方案》补入 spf13/go-skills 吸收的两项模式：卸载/清理/迁移的 plan-then-apply dry-run 两步（afero CopyOnWriteFs 实证：删除/移动类必须显式两步）；可信根 + 不可信部分的路径拼接（消毒不可信文件名段、围堵在根内——建议引入 spf13/pathologize + fileflow 或等价自实现）

**修改**

- （无 / none）

**修复**

- （无 / none）

**删除**

- （无 / none）

---

### v1.13.0 相比 v1.12.0 更新内容

**版本类型：稳定版**

**新增**

- 新增《单实例与快速启动方案》（专题/桌面集成/单实例与快速启动方案.md）：单实例默认（二次启动参数路由到运行实例、托盘唤回联动）、启动四里程碑预算（进程→窗口 ≤500ms、首帧 ≤1s、可交互 ≤2s）、UI 响应下限（≥100ms 操作须有可见回执、主线程禁阻塞）；双语 README 与总大纲已登记

**修改**

- （无 / none）

**修复**

- （无 / none）

**删除**

- （无 / none）

---

### v1.12.0 相比 v1.11.0 更新内容

**版本类型：稳定版**

**新增**

- 《默认安装目录规划方案》新增开发期/安装期双模式路径解析：开发模式使用相对路径（./dev-data 四区同根——删项目目录即完全清理），安装模式走契约绝对路径；模式判定单源在 paths.Resolve
- 仓库双 README（EN + 中文）顶部挂组件库在线查看地址：https://xiaokentrl.github.io/wails3-guides/

**修改**

- （无 / none）

**修复**

- 修复 Linux 安装器 manifest 混入源机绝对路径（源根目录自身被当成相对路径）——源根跳过，目录经 mkdir 重建不入清单

**删除**

- （无 / none）

---

### v1.11.0 相比 v1.10.0 更新内容

**版本类型：稳定版**

**新增**

- 三平台安装器/打包脚本落地（packaging/）：Windows NSIS（NSIS 3.10 编译验证；解析链、预览门禁页、注册表零写入、manifest 递归枚举、一体化卸载器）、macOS DMG、Linux install.sh（manifest 驱动安装/卸载、XDG 数据根）与 AppImage
- ui/scripts/check.mjs 新增第 ⑥ 项检查：指南中全部 go/ts/tsx 代码块必须可解析（gofmt / esbuild），含行内省略处理
- 新增《Wails3框架版本判别与服务纪律方案》（专题/桌面集成）：v2/v3 判别表、版本混用红旗、Services 生命周期与并发锁纪律、alpha 钉版、WAILS_MCP=1
- 每次 main 推送自动同步 GitHub Release 正文（双语说明从 RELEASES.md 提取，经 gh release edit）
- 新增 claims 背书测试：每个测试命名所背书的文档章节（BOM、CSV 转义不变式）

**修改**

- playground 菜单行高收紧至 31px；侧栏对齐与分组间距打磨；演示区页头吸顶、阅读宽度约束
- 单文件产物标准化命名：standalone.html（本地构建与 CI 对齐）

**修复**

- 修复检查 ⑥ 自身三处 bug（分发与更新双重扫描、gofmt stdin 形式、esbuild loader 参数形式）
- 修复 Wails3 方案经 claims 交叉核验发现的 1 处缺口（前端绑定生成方式）
- 修复 docs/COMPONENTS.md 缺失的 24 个组件卡与交付清单/ui/README 的 3 处陈旧数字

**删除**

- 移除误入库的 CI 中间文件 body.md

---

### v1.10.0 相比 v1.9.0 更新内容

**版本类型：稳定版**

**新增**

- 新增安装前目录结构图强制预览门禁：树由契约与用户选择实时推导（程序区 + 数据区双根；节点带用途图标；程序内部折叠为计数），树渲染并确认前「下一步」禁用
- 向导过程中任意目录节点可改位置（含其他盘），子树实时刷新，调整进变更列表一次生效
- 冲突即时标红（目标已有文件 / 无写权限 / 非法路径）：节点标红 + 下一步禁用，修正后恢复
- Windows 默认注册表零写入：应用内卸载器 + manifest 反向执行替代卸载键；启动目录 .lnk 替代 Run 键；os.Executable() + config/install.json 替代 InstallPath；文件关联（仅注册表可实现）为唯一显式同意例外

**修改**

- 确认后的预览树即安装 manifest 蓝本——所见 = 所确认 = 所写四者一致
- AI 约束模板与测试矩阵同步补预览门禁与零注册表行

---

### v1.9.0 相比 v1.8.0 更新内容

**版本类型：稳定版**

**新增**

- 新增《默认安装目录规划方案》（专题/分发与更新/默认安装目录规划方案.md）：目录契约——六类文件 × 三平台各归其所（Linux FHS/XDG、Windows 解析链 + 注册表（D:\ 优先带回退）、macOS Library 家族），paths.go 单源模块、注册表最小化白名单、安装清单「所写即所录」、卸载净空与 12 触点补充清单
- playground 侧栏宽度放开为任意拖拽（0 至视口上限），双击重置 240px，跨会话记忆

**修改**

- 目录契约改为单根四区 + 缓存外置：用户数据/配置/日志同根（备份、卸载、排障只看一个目录），缓存单独保持平台位置（OS 清理工具只认那里）；旧四分契约保留为进官方仓库打包时的备选档

**修复**

- （无 / none）

---

### v1.8.0 相比 v1.7.0 更新内容

**版本类型：稳定版**

**修复**

- 修复 standalone-html CI 产物自引入以来一直为空：npm run build 只产出 dist/（便携版）与 dist-single/index.html（单文件版），从未把单文件拷入 dist/，build job 的上传步骤始终报「No files were found」并得到空产物。现 build 串为 build:portable + build:single + copy:single（dist-single/index.html 缺失时明确报错）；build:pages 别名到 build，消除其「拷贝上一次残留 dist-single」的陷阱
- 两个 job 的 actions/checkout 与 actions/setup-node 升至 @v5，消除这两个 action 的 Node.js 20 弃用告警（其余告警系上游 action 尚无 Node 24 大版本，无实际影响）

---

### v1.7.0 相比 v1.6.0 更新内容

**版本类型：稳定版**

**修复**

- 修复部署工作流的并发锁写死为 "pages"，导致标签（发版）运行取消正在执行的 main Pages 部署，表现为 deployment_queued 后被整体取消（v1.6.0 发版时的 run #33）：并发组改为按 ref 类型隔离（pages-branch / pages-tag），同一 main 连续推送仍互相淘汰
- 修复定版提交先于标签推送进入 main 时，「同步 Release 正文」步骤因 Release 尚未创建而报红、连累 build 失败并跳过 Pages 部署的问题：该步骤现改为 Release 不存在时跳过并留提示

---

### v1.6.0 相比 v1.5.0 更新内容

**版本类型：稳定版**

**新增**

- 新增 Actions 历史运行记录清理工作流（.github/workflows/cleanup-actions.yml）：每周日零点定时 + Actions 页手动触发；清理全仓库所有工作流的运行记录并保留最近 10 条，近期推送的门禁证据仍可复查。自 github-net 项目同名工作流移植，踩坑记录随注释保留

---

### v1.5.0 相比 v1.4.0 更新内容

**版本类型：稳定版**

**新增**

- 新增《托盘唤回位置 实证复盘》（专题/桌面集成/托盘唤回位置_实证复盘.md）：一次「修了两次都没生效」的实证复盘，带框架源码证据——四类手势的协议/回调映射、四条独立失效链、修复顺序建议、验收记录模板与可复用只读排查命令
- 扩充《托盘技术方案》：手势三层映射、回调注册唯一性（一个入口一个主人）、框架调用时序契约（谁最后摆位）、几何写入侧纪律、修复生效验证闭环（五层验证、三道自动化门）、扩充根因表与 AI 实施约束模板

**修改**

- 双 README（中文/英文目录清单 + 中文文件树）与主大纲配套列表收录实证复盘条目
- 《托盘技术方案》去重：版本绑定的样例表（手势映射、时序契约、回调注册清单、全零落盘）收敛到实证复盘单一来源，方案保留通用纪律与指针，不再随框架版本维护行号

---

### v1.4.0 相比 v1.3.0 更新内容

**版本类型：稳定版**

**新增**

- 新增发布交付流水线方案（专题/分发与更新/发布交付流水线方案.md）：交付链 11 步操作序列、pre-push 门禁设计、两种发布文档格式（含完整模板）、CI 版本裁决、验收清单与 AI 约束模板
- playground 侧栏支持整体收起/展开：常驻右缘把手，收起状态跨会话记忆（localStorage）
- 一级菜单（分组标题）支持逐组折叠/展开，带 aria-expanded 状态
- 侧栏宽度支持右缘自由拖拽（0 至视口上限），双击重置 240px，跨会话记忆
- 新增单文件 HTML 构建（约 19MB，全部 JS/CSS/monaco worker 内联）：双击即可离线浏览全部组件
- 新增 npm scripts：dev / build（双产物）/ build:portable / build:single / test / typecheck
- 每次 main 推送自动同步 GitHub Release 正文（双语说明从 RELEASES.md 提取，经 gh release edit）

**修改**

- 双 README（中文目录表 + 文件树、英文目录表）与总大纲配套列表同步收录新指南
- 收起把手与拖宽热区合并为一条双语义把手（VS Code 模式）：点击 = 收起展开，拖动 = 调宽（4px 阈值判别），拖后合成 click 抑制，双击重置，方向键微调
- 菜单行高收紧至 31px，对齐 Element Plus 文档站信息密度
- 侧栏对齐与分组间距打磨；演示区页头吸顶、阅读宽度约束
- 单文件产物标准化命名：dist/ 内统一为 standalone.html

**修复**

- 修复收起把手与拖宽热区打架（指针目标重叠）——由一体化把手根治
- docs/EXAMPLES.tsx 纳入类型检查范围，并修复 3 处旧 API 用法

**删除**

- 移除误入库的 CI 中间文件 body.md，并加入 .gitignore

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
