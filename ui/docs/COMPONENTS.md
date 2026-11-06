# 组件卡目录（COMPONENTS.md）

> 入库纪律：每个组件登记于此；新建组件前先查重（→《多平台一致组件库方案》积累机制）。
> 本目录是**简版组件卡**（API / 状态 / 无障碍 / 平台尊重点 / 待验证）；完整组件卡随项目期补充三引擎截图与交互测试记录。
> 全景分类框架（7 层、~200 组件清单）→ [组件库全景.md](./组件库全景.md)。

| 组件 | 类型 | 入库状态 | 三引擎冒烟 | 交互测试 |
|---|---|---|---|---|
| Spinner | 展示 | 稳定 | 待项目期 | 待项目期 |
| Badge | 展示 | 稳定 | 待项目期 | 待项目期 |
| Card | 布局 | 稳定 | 待项目期 | 待项目期 |
| Title / Text | 展示 | 稳定 | 待项目期 | 待项目期 |
| Link | 基础 | 稳定 | 待项目期 | 待项目期 |
| Kbd / VisuallyHidden | 基础 | 稳定 | 待项目期 | 待项目期 |
| TextEllipsis | 展示 | 稳定 | 待项目期 | 待项目期 |
| Tag | 基础 | 稳定 | 待项目期 | 待项目期 |
| Avatar / AvatarGroup | 基础 | 稳定 | 待项目期 | 待项目期 |
| Divider | 布局 | 稳定 | 待项目期 | 待项目期 |
| Stack / Grid / Container | 布局 | 稳定 | 待项目期 | 待项目期 |
| Tabs（+editable 可编辑卡片） | 导航 | 稳定（roving tabindex + 溢出滚动按钮） | 待项目期 | 待项目期 |
| Breadcrumb | 导航 | 稳定 | 待项目期 | 待项目期 |
| Pagination | 导航 | 稳定 | 待项目期 | 待项目期 |
| Steps | 导航 | 稳定 | 待项目期 | 待项目期 |
| SegmentedControl | 导航 | 稳定 | 待项目期 | 待项目期 |
| Button / IconButton | 输入 | 稳定 | 待项目期 | 待项目期 |
| TextInput / Textarea | 输入 | 稳定 | 待项目期 | 待项目期（IME 必测） |
| Checkbox | 输入 | 稳定 | 待项目期 | 待项目期 |
| Switch | 输入 | 稳定 | 待项目期 | 待项目期 |
| Radio / RadioGroup | 输入 | 稳定 | 待项目期 | 待项目期 |
| InputNumber | 输入 | 稳定 | 待项目期 | 待项目期 |
| PasswordInput | 输入 | 稳定 | 待项目期 | 待项目期 |
| SearchInput | 输入 | 稳定 | 待项目期 | 待项目期 |
| Slider | 输入 | 稳定 | 待项目期 | 待项目期 |
| Select | 输入 | 稳定（原生外观版） | 待项目期 | 待项目期；自绘 listbox 版为下一批 |
| Skeleton | 展示 | 稳定 | 待项目期 | 待项目期 |
| Table（数据网格） | 展示 | 稳定（排序/可编辑/吸顶表头/行选择全选半选/虚拟滚动/行展开/汇总行/exportCsv） | 待项目期 | 待项目期；列宽拖拽/多级表头/列筛选/固定列/单元格合并为下一批 |
| Descriptions | 展示 | 稳定 | 待项目期 | 待项目期 |
| Progress | 展示 | 稳定 | 待项目期 | 待项目期 |
| Empty | 展示 | 稳定 | 待项目期 | 待项目期 |
| Timeline | 展示 | 稳定 | 待项目期 | 待项目期 |
| Collapse | 展示 | 稳定 | 待项目期 | 待项目期 |
| Statistic | 展示 | 稳定 | 待项目期 | 待项目期 |
| Modal | 反馈 | 稳定（弹框栈：嵌套 z-index / 滚动锁引用计数 / Escape 只关最上层） | 待项目期 | 待项目期（嵌套场景必测） |
| Toast | 反馈 | 稳定 | 待项目期 | 待项目期 |
| Tooltip | 反馈 | 稳定（受控 open + 可配延迟） | 待项目期（定位） | 待项目期 |
| Alert / Result | 反馈 | 稳定 | 待项目期 | 待项目期 |
| ErrorBoundary | 反馈 | 稳定 | 待项目期 | 待项目期 |
| Popover | 浮层 | 稳定（基础版） | 待项目期（定位翻转） | 待项目期 |

| SelectListbox | 输入 | 稳定（>60 项自动窗口化） | 待项目期 | 待项目期（键盘导航必测） |
| MultiSelect | 输入 | 稳定（tags 折叠 + 全选/清空 + 窗口化） | 待项目期 | 待项目期（键盘/IME 必测） |
| Cascader（多选模式） | 输入 | 稳定（复选框三态 + 父级子树全选 + tag 移除） | 待项目期 | 待项目期（深树/禁用子树必测） |
| Highlight | 基础 | 稳定（Fragment 切段，无 innerHTML） | 待项目期 | 待项目期 |
| EmojiPicker | 输入 | 稳定（内置精简词表） | 待项目期（CLDR 词表替换） | 待项目期（网格方向键导航下一批） |
| EditableText | 输入 | 稳定（IME 组合态不提交） | 待项目期 | 待项目期（真实 IME 必测） |
| OfflineIndicator | 反馈 | 稳定（事件驱动） | 待验证（Wails WebView 事件可靠性） | 待项目期（真实断网） |
| PermissionGate | 横切 | 稳定（hide/disable/replace 三策略 + Provider） | 待项目期 | 待项目期（权限键对齐） |
| AutoComplete | 输入 | 稳定 | 待项目期 | 待项目期（IME 必测） |
| DropdownMenu / ContextMenu | 浮层 | 稳定（分组/分隔线 + >60 项窗口化） | 待项目期（右键定位） | 待项目期 |
| DatePicker | 输入 | 稳定（date/week/month/quarter/year 五变体；周号走 ISO 纯函数层 + 测试） | 待项目期 | 待项目期（跨时区显示） |
| ScrollArea | 布局 | 稳定 | 待项目期 | 待项目期 |
| TagInput | 输入 | 稳定 | 待项目期 | 待项目期 |
| Transfer | 输入 | 稳定 | 待项目期 | 待项目期 |
| Lightbox | 浮层 | 稳定 | 待项目期 | 待项目期 |
| CommandPalette | 浮层 | 稳定 | 待项目期 | 待项目期 |
| VirtualList | 展示 | 稳定（固定行高） | 待项目期 | 待项目期；动态行高下一批 |
| VirtualizedTree | 展示 | 稳定（activedescendant 键盘 + 窗口化） | 待项目期 | 待项目期（checkable/拖拽下一批） |
| List / ListItem | 展示 | 稳定（头/尾/边框 + 四区条目） | 待项目期 | 待项目期 |
| Thing / GradientText | 展示 | 稳定 | 待项目期 | 待项目期 |
| Time | 展示 | 稳定（relative/datetime + 自动刷新） | 待项目期 | 待项目期 |
| AppShell | 布局 | 稳定（可折叠 Sider；flex min-width 陷阱已修） | 待项目期 | 待项目期（真实菜单接线） |
| Popselect | 浮层 | 稳定（任意触发器 + 轻键盘面板） | 待项目期 | 待项目期 |
| NavMenu | 导航 | 稳定（水平模式；垂直走 TreeMenu） | 待项目期 | 待项目期 |
| Tree / TreeSelect | 展示 / 输入 | 稳定（多选 + 方向键 + 拖拽） | 待项目期 | 待项目期 |
| Cascader | 输入 | 稳定（单选+多选+键盘+showSearch 搜索态） | 待项目期 | 待项目期（深树搜索性能） |
| DateRangePicker | 输入 | 稳定（单面板 + 悬停预览） | 待项目期 | 待项目期 |
| TimePicker | 输入 | 稳定（原生版） | 待项目期 | 待项目期 |
| Upload | 输入 | 稳定（基础版） | 待项目期 | 待项目期 |
| Drawer | 浮层 | 稳定（接入弹框栈） | 待项目期 | 待项目期（与 Modal 嵌套组合必测） |
| HoverCard | 浮层 | 稳定 | 待项目期 | 待项目期 |
| NotificationDrawer | 浮层 | 稳定 | 待项目期 | 待项目期 |
| Tour | 反馈 | 稳定 | 待项目期 | 待项目期 |
| EditableCell | 展示 | 稳定 | 待项目期 | 待项目期 |
| SearchForm | 业务 | 稳定 | 待项目期 | 待项目期 |
| AdvancedTable | 业务 | 稳定 | 待项目期 | 待项目期 |
| tests/components.test.tsx | 测试 | 12 组（含 PinInput、嵌套弹框栈、通知路由、上传进度/取消） | — | 项目内 vitest 运行 |
| PinInput | 输入 | 稳定 | 待项目期 | 待项目期（粘贴/后退必测） |
| useCountdown | 钩子 | 稳定 | — | 假时钟测试见 tests/timing |
| tests/format.test.ts | 测试 | 8 用例（minor unit/分摊/午夜解析/locale 解析） | — | 项目内 vitest 运行 |
| tests/read.test.ts | 测试 | 9 用例（SWR 标记/竞态/TTL；直读；离线快照落盘/失败保留/expired） | — | 项目内 vitest 运行 |
| tests/timing.test.ts | 测试 | 9 个用例（含单飞与倒计时，假时钟） | — | 项目内 vitest 运行 |
| docs/EXAMPLES.tsx | 示例 | 稳定 | ✓ 挂路由即冒烟入口 | — |
**下一批（剩余复杂件）**：Cascader 多选、DatePicker 双面板对照与悬停预览、Upload 分片/断点续传、Tree 多选勾选与方向键导航、Tabs 方向键导航、动态行高进阶（二分定位）、Table 服务端排序组合。
**集成封装（不自研）**：图表（ECharts）、代码编辑器（Monaco）、地图、富文本、RTC——包外部库，见《组件库全景》专项能力层。

---

## 各组件卡（简版）

### Spinner
- **API**：`size?: 'sm'|'md'|'lg'`、`label?: string`
- **无障碍**：`role=status`；动画时长走令牌，`prefers-reduced-motion` 下归零

### Badge
- **API**：`tone?: 'neutral'|'primary'|'success'|'warning'|'danger'`
- **无障碍**：状态展示须配图标/文字（颜色不是唯一通道）

### Card
- **API**：`padding?: 'none'|'sm'|'md'|'lg'`；层次由 surface 令牌表达

### Title / Text / Link / Kbd / VisuallyHidden / TextEllipsis
- **API**：见 index.ts 类型定义；Link 的外部链接 target/rel 由调用方决定（scheme 白名单 → 安全方案）
- **无障碍**：VisuallyHidden 视觉隐藏但读屏可达；TextEllipsis hover 出完整文本

### Tag
- **API**：`closable? / onClose? / tone?`；关闭按钮带 aria-label

### Avatar / AvatarGroup
- **API**：`size? / fallback? / alt?`；Group `max?` 超出折叠 +N（带 aria-label）

### Divider / Stack / Grid / Container
- **API**：见 index.ts；间距一律走 --ui-space 令牌档位

### Tabs / Breadcrumb / Pagination / Steps / SegmentedControl
- **无障碍**：Tabs `role=tablist/tab + aria-selected`（方向键导航待补）、Breadcrumb `aria-current=page`、Pagination `aria-current`、Steps `aria-current=step`、Segmented `role=radiogroup/radio`
- **待验证**：Tabs 溢出滚动三引擎行为

### Button / IconButton
- **API**：Button `variant? / size? / loading?`；IconButton `label` 必填（类型强制）
- **纪律**：loading 在途禁用（aria-busy）；危险操作确认 →《操作反馈方案》

### TextInput / Textarea / PasswordInput / SearchInput
- **API**：`label? / error? / hint?`；error 由调用方从码表解析后传入（组件不拼人话）
- **IME 纪律**：不拦截不改写组合态值；格式化放 compositionEnd 后
- **待验证**：各引擎组合态行为

### Checkbox / Switch / Radio / InputNumber / Slider / Select
- **无障碍**：原生控件承载语义、自绘只做外观；焦点环挂自绘部分；Select 为原生外观版
- **InputNumber**：越界回落（min/max clamp）、步进按钮带 aria-label
- **待验证**：原生 range/select 三引擎外观差异

### Skeleton / Table / Descriptions / Progress / Empty / Timeline / Collapse / Statistic
- **Table**：语义 table + scope=col；空态接 Empty；虚拟滚动/可编辑下一批
- **Progress**：`role=progressbar + aria-valuenow`；bar/ring 双形态
- **Empty**：四变体（no-data / no-permission / no-network / no-result）
- **Collapse**：details/summary 原生承载键盘与语义

### Modal
- **无障碍**：`role=dialog + aria-modal`；焦点陷阱、Escape、关闭后焦点归还、body 滚动锁定
- **待验证**：Linux focus-follows-mouse 合成器表现

### Toast
- **API**：`useToast().toast({ kind?, message, duration? })`，须在 `<ToastProvider>` 内
- **无障碍**：`role=status` / `role=alert`（error）
- **纪律**：只用于「结果不在眼前」的操作（→ 操作反馈路由）

### Tooltip / Popover
- **无障碍**：Tooltip hover+焦点双触发、Escape 隐藏；Popover light dismiss、Escape、aria-haspopup
- **待验证**：三引擎绝对定位与边界翻转（翻转逻辑下一批）

### Alert / Result
- **Alert**：`role=alert`（danger）/ `status`；danger 须配下一步动作
- **Result**：error 必须带 extra 恢复入口

### ErrorBoundary
- **API**：`fallback(error, reset) / onError?`（上报挂接点 → 可诊断性方案）
- **纪律**：fallback 必须含重试入口，不许只有死文案

### SelectListbox（自绘下拉）
- **键盘**：Enter/Space 开、↑↓ 循环（跳禁用）、Home/End、Enter 选、Escape 归还焦点、Tab 关
- **无障碍**：`aria-haspopup=listbox + aria-expanded + role=listbox/option`；active 项 `scrollIntoView(nearest)`

### MultiSelect（下拉多选框）
- **触发器**：tag 回显（点 × 单独移除），超出 `maxTags` 折叠 `+N`
- **面板**：checkbox listbox；底部全选/清空（禁用项不参与全选）+ 已选计数
- **键盘**：↑↓ 循环（跳禁用）、Home/End、Space/Enter 切换、Escape 归还焦点、Tab 关
- **长列表**：>60 项窗口化（与 SelectListbox 同一模式）
- **无障碍**：`aria-multiselectable + role=option/aria-selected`

### Cascader 多选模式（级联下拉多选）
- **面板**：每项复选框；叶子勾选累积路径；父节点三态（勾选 = 整棵子树叶路径全选，部分 = indeterminate）
- **禁用子树**：路径上任一节点禁用，其叶路径不可勾选（全选时自动排除）
- **触发器**：路径 tag（`父/子` 形式，可单独移除），超出 `maxTags` 折叠 `+N`
- **键盘**：↑↓ 移动、→ 展开父级、← 回退、Enter 点按（叶子 = 切换勾选）、Escape 关
- **实现纪律**：键盘监听只在 `open` 变化时挂载，`active/columns/path/pick` 经 ref 镜像——columns 为渲染期新引用，入依赖会导致监听器每渲染拆装、closure 陈旧（键盘失灵的真根因）

### Highlight（搜索命中高亮）
- **实现**：按 query 全部出现位置切段，命中包 `<mark>`；Fragment 切段而非 dangerouslySetInnerHTML——免疫 XSS
- **输入**：query 空白原样返回；默认不区分大小写（`caseSensitive` 可开）

### EmojiPicker（表情选择器）
- **结构**：分类页签 + 中英文关键词搜索 + 最近使用（localStorage，容量上限）
- **纪律**：词表内置精简版可整体替换为 CLDR；Esc/点外关闭
- **待验证**：网格方向键导航（当前 Tab 遍历）

### EditableText（行内编辑）
- **交互**：点击/Enter 进入编辑，Enter 提交、Escape 取消、失焦提交；校验失败不退出编辑态
- **IME 纪律**：compositionstart→end 之间 Enter 不触发提交（库铁律）
- **多行**：textarea，Enter 换行不提交

### OfflineIndicator（离线指示）
- **驱动**：navigator.onLine + online/offline 事件；离线常驻横幅，恢复后提示自动隐藏
- **待验证**：Wails WebView 对 online/offline 事件的可靠性

### PermissionGate（权限门）
- **三策略**：hide（不渲染）/ disable（可见不可用：opacity + pointer-events 拦截 + title 原因）/ replace（替代节点）
- **配套**：PermissionProvider（权限表注入）+ usePermission（无 Provider 时安全默认=拒绝）+ PermissionGateOf（权限键驱动便捷组合）
- **纪律**：组件只做策略投影，不做鉴权；权限判定由调用方/Provider 注入

### AutoComplete
- **键盘**：↓ 展开/下移、↑ 上移、Enter 提交 active、Escape 关
- **无障碍**：`role=combobox + aria-controls + aria-autocomplete=list`
- **IME**：过滤在 onChange 自然进行，无组合态改写

### DropdownMenu / ContextMenu
- **键盘**：↑↓ 循环、Home/End、Escape、Tab；右键菜单 fixed 定位随光标、滚动即关
- **无障碍**：`aria-haspopup=menu + role=menu/menuitem`

### DatePicker（单月版）
- **键盘**：方向键日格移动（跨周/跨月）、PageUp/Down 换月、Enter 选、Escape 关
- **i18n**：月/星期文案走 Intl；值由调用方规范化存储

### ScrollArea
- 原生 overflow + 令牌化滚动条（WebKit 前缀 + Firefox `scrollbar-width` 回退）；不自造滚动

### TagInput / Transfer
- **TagInput**：Enter/逗号提交、Backspace 删末尾、去重；值校验在领域层
- **Transfer**：双面板复选 + 批量移动；右侧保持数据原序

### Lightbox / CommandPalette
- **Lightbox**：方向键切图、Escape 关、焦点归还；缩放手势下一批
- **CommandPalette**：消费命令注册表（→ 菜单方案）；输入过滤 + ↑↓ + Enter；`role=combobox/listbox`

### VirtualList
- 固定行高窗口化（overscan=5）；动态行高/双向滚动下一批

### VirtualizedTree（虚拟化树）
- **规模**：万级节点；折叠子树不进扁平列表（虚拟化的索引基础），只渲染可视窗口（与 VirtualList 同一公式，overscan=5）
- **ARIA**：`role=tree + aria-activedescendant` 模式——容器持焦点，行节点动态挂 DOM（虚拟列表下 ref 直指不可行）
- **键盘**：↑↓ 移动、→ 展开/进子、← 折叠/回父级、Enter/Space 选中、Home/End
- **约束**：rowHeight 必须固定（虚拟化前提）；checkable/拖拽/动态行高下一批
- **实现纪律**：activeIndex 越界随 flat.length 收敛（useEffect）；scrollToIndex 保证键盘移动可视

### Tree / TreeSelect
- **Tree**：`role=tree/treeitem + aria-expanded/selected/checked`；方向键（↑↓ 移动、→ 展开/进子、← 折叠/回父、Enter/Space 选择）；checkable 父勾选=子树全选 + 半选态；`draggable` 开启 HTML5 拖拽、`onDropNode` 由调用方裁决重排（环检测内建：不可拖入自身子树）
- **TreeSelect**：弹层内嵌 Tree，点外关闭 + Escape；多选下一批

### Cascader
- **API**：`options 树 / value: string[]（路径）/ onChange`；列面板逐级展开；路径文案 `/` 分隔
- **待验证**：多列滚动跟随；键盘导航下一批

### DateRangePicker / TimePicker
- **Range**：双面板对照（左月/右月）+ 两段式（反向自动交换）+ 悬停预览区间
- **TimePicker**：原生 time + 令牌化外观（自绘面板下一批）

### Upload
- **契约升级**：`upload(file, ctx)`——`ctx.signal`（取消）+ `ctx.onProgress(loaded, total)`（字节进度）
- **状态机**：pending → uploading（进度条 + 百分比 + 取消按钮）→ done / canceled（可重新选择）/ error（带原因 + 重试）
- **取消语义**：AbortController → AbortError → canceled；与分片断点的「暂停≠取消」衔接 → 分片上传方案
- **待验证**：大文件进度节流频率（→ 防抖与节流方案事件预算）
- **无障碍**：拖拽区 `role=button + 键盘触发`；`accept` 以 Badge 展示

### Drawer / HoverCard / NotificationDrawer
- **Drawer**：焦点陷阱复用 `useFocusTrap`（与 Modal 同一实现——改一处两处生效）
- **HoverCard**：hover/焦点双触发 + Escape；富内容浮层
- **NotificationDrawer**：Drawer + 未读 Badge + 全部已读；点击单条回调由调用方接线

### Tour
- **API**：`steps: { target?: selector, title, description? }`；定位目标元素下方/上方自适应、缺失目标居中兜底
- **无障碍**：`role=dialog`、Escape 跳过、Skip 常显
- **待验证**：目标元素跨滚动容器的跟随（滚动即重算，下一批）

### EditableCell
- **API**：`value / onCommit / validate?`（validate 返回错误文案则不提交）；Enter/失焦提交、Escape 取消
- **纪律**：提交校验走码表解析（→ 输入验证协议）

### SelectListbox 窗口化
- 选项 >60 时自动切换绝对定位窗口渲染（ROW=32，over-scan=6）；active 项仍 scrollIntoView
- 短列表行为与普通渲染完全一致

### splitFile / chunkProgress（lib/upload）
- Upload 分片/断点的调用方原语：`splitFile(file, chunkSize)` 产出片清单；`chunkProgress(done, total)` 记账百分比
- 上传契约仍是 `upload(file)`——分片上传 = 调用方逐片调接口 + 任务化（→ 长任务方案）

| FormItem | 输入 | 稳定 | 待项目期 | 待项目期 |
| OrgSelector | 业务 | 稳定 | 待项目期 | 待项目期 |
| integrations/Chart（echarts） | 集成 | 稳定（懒加载/Loading/自适应/卸载销毁四件套） | 待项目期 | 待项目期 |
| integrations/Map（leaflet） | 集成 | 稳定（同上模式；瓦片源=项目决策） | 待项目期 | 待项目期（离线瓦片） |
| integrations/CodeEditor（monaco） | 集成 | 稳定（worker 语言服务 + 受控回环防抖） | 待项目期 | 待项目期 |
| integrations/Terminal（xterm） | 集成 | 稳定（fit 自适应 + ref 写屏 API） | 待项目期 | 待项目期（真实 pty） |
| integrations/RichText（tiptap） | 集成 | 稳定（双层懒加载 + 受控 setContent 防回环） | 待项目期 | 待项目期（消毒接线） |
| integrations/Whiteboard（tldraw） | 集成 | 稳定（React.lazy 形态） | 待项目期 | 待项目期（持久化键决策） |
| integrations/QrCode（qrcode） | 集成 | 稳定（编码失败显式错误态 + 空值回退） | 待项目期 | 待项目期 |
| Icon / registerIcon | 基础 | 稳定（注册表制） | 待项目期 | 待项目期 |
| CopyToClipboard | 基础 | 稳定 | 待项目期 | 待项目期 |
| CountUp | 展示 | 稳定 | 待项目期 | 待项目期 |
| Calendar | 展示 | 稳定（单月） | 待项目期 | 待项目期 |
| Heatmap | 展示 | 稳定 | 待项目期 | 待项目期 |
| Gauge | 展示 | 稳定 | 待项目期 | 待项目期 |
| CodeBlock | 展示 | 稳定（无语法高亮，高亮=集成） | 待项目期 | 待项目期 |
| Image | 展示 | 稳定 | 待项目期 | 待项目期 |
| Comment | 展示 | 稳定（支持嵌套） | 待项目期 | 待项目期 |
| BackTop | 导航 | 稳定 | 待项目期 | 待项目期 |
| ToggleGroup | 输入 | 稳定（多选） | 待项目期 | 待项目期 |
| Rate | 输入 | 稳定 | 待项目期 | 待项目期 |
| CheckboxGroup | 输入 | 稳定 | 待项目期 | 待项目期 |
| FormList | 输入 | 稳定 | 待项目期 | 待项目期 |
| GlobalProgressBar | 反馈 | 稳定（定值/不定态） | 待项目期 | 待项目期 |
| Countdown | 反馈 | 稳定 | 待项目期 | 待项目期 |
| TreeMenu | 导航 | 稳定 | 待项目期 | 待项目期 |
| LinkedSelects | 输入 | 稳定 | 待项目期 | 待项目期 |
| FileDialog | 输入 | 稳定（open/folder/save 三模式） | 待项目期 | 待项目期 |
| saveBlob / saveUrl / fetchWithProgress | lib | 稳定 | — | 待项目期（进度流式） |
| useResumableUpload | lib | 稳定（协议注入） | — | 假时钟/内存 Mock 测试已写（tests/upload.test.ts） |
| Splitter | 布局 | 稳定 | 待项目期 | 待项目期（指针捕获/键盘必测） |
| ZoomableContainer | 布局 | 稳定 | 待项目期（捏合必测） | 待项目期 |
| Masonry | 布局 | 稳定（计数均衡 + measured 测量版双模） | 待项目期 | 待项目期 |
| Sticky / Center / AspectRatio | 布局 | 稳定 | 待项目期 | 待项目期 |
| useMediaQuery / useBreakpoint | 响应式 | 稳定 | — | 待项目期 |
| NotificationRouter | 反馈 | 稳定（路由/降级/唤回） | 待项目期 | 待项目期（路由矩阵必测，测试已写） |
### 业务组件（business/）

#### SearchForm
- **API**：`fields: SearchFormField[]（key/label/kind/options）/ onSearch(values) / onReset? / searching?`
- **纪律**：提交值交调用方做领域校验（展示层校验不算数 → 输入验证方案）

#### AdvancedTable
- **API**：Table 全参 + `pageSize?（客户端分页）/ total+page+onPageChange（服务端）/ toolbar?`
- **形态**：客户端 / 服务端分页二选一；排序回调经 Table 向上

### 弹框栈（lib/modalStack + useFocusTrap modal 模式）
- 嵌套弹框：z-index 随栈深递增（`calc(var(--ui-z-modal) + 栈深)`）、滚动锁定引用计数（全关才解锁）、**Escape 只关最上层**
- Modal / Drawer 已接入；Popover 类非模态不参与栈
- **待验证**：三层嵌套 Escape 逐层退出、内层关闭后外层滚动仍锁定

### 测试（tests/）
- 结构性纪律用例：Button 在途禁用、Modal Escape+焦点循环+**嵌套弹框栈路由**、SelectListbox 键盘（含跳禁用）、TextInput IME 不拦截、TagInput 提交/去重
- 运行前提：vitest + RTL + jest-dom（见文件头）；三引擎视觉回归仍待项目期

### 示例（docs/EXAMPLES.tsx）
- 挂到任意路由即为全组件总览 + 三引擎冒烟统一入口页（入库四件套「可运行示例」件）

### FormItem / OrgSelector / integrations
- **FormItem**：cloneElement 注入 id 完成 label 关联（Switch/Slider/自定义控件的壳层）；required 星号仅为视觉
- **OrgSelector**：TreeSelect + 面板内搜索（命中保留祖先链，children 分支裁剪）；`childrenCount` 提示过滤规模
- **integrations/Chart（echarts）**：已按模式模板实装——懒加载 `import('echarts')` + Spinner 兜底 + ResizeObserver→resize + 卸载 dispose；option 切换走 setOption 增量合并；主题经 `theme` 传给 init（→ 主题与色彩方案）
- **integrations/Map（leaflet）**：同模式实装——懒加载 + 卸载 `map.remove()`（防定时器/监听泄漏）+ 容器变化 `invalidateSize`；瓦片源 tileUrl 参数化（离线桌面换本地瓦片）；Leaflet CSS 由使用方引入
- **integrations/CodeEditor（monaco）**：同模式实装——懒加载 + `MonacoEnvironment.getWorker` 工厂（不配则语言智能静默降级为纯高亮）；受控 value 用 `applyingRef` 防回环（setValue 触发的 content 变化不回灌 onChange）；卸载 dispose。**vite 组合注意**：monaco ≥0.52 的 exports 为 `./* → ./esm/vs/*.js`（深层导入去掉 `esm/vs` 前缀），且 vite 5.4 对 `?worker` 后缀裸导入不走 exports 解析——需在宿主 vite.config 为五个 worker 加精确别名（见 .preview/vite.config.js 范例）
- **integrations/Terminal（xterm）**：同模式实装——懒加载 + FitAddon + ResizeObserver→fit + 卸载 dispose；流式写屏走 `TerminalRef`（write/writeln/clear）命令式 API——React 不适合高频 write 走 props；onInput 是每键原始字符（\r 回车、\u007f 退格由调用方处理）；Shell 实现接后端 pty/命令通道（→ 系统能力方案）
- **integrations/RichText（tiptap）**：同模式实装，React 组件库语境的变体——`useEditor` 必须在组件内调用，故**双层结构**（外层 effect 动态 import 拉模块，内层 Inner 消费 hooks）；受控 value 用 `setContent(html, false)`（第二参 false = 不触发 onUpdate，防回环）；**HTML 导出须消毒**（DOMPurify → 安全边界方案），封装不代消毒
- **integrations/Whiteboard（tldraw）**：React.lazy 即「懒加载」在此语境的标准形态（组件形态 peer 库）；persistenceKey 参数化（内存态默认，持久化接状态持久化方案）；卸载即自动清理
- **交付纪律**：集成件不从 index.ts 导出（零运行时依赖纪律）；peer 库安装属项目决策（→ 分发方案供应链门禁）；六个实装件（Chart/Map/CodeEditor/Terminal/RichText/Whiteboard）模式同构，新集成照抄即可

### Icon / CopyToClipboard / CountUp
- **Icon**：注册表制（registerIcon 扩展，同名覆盖拒绝并警告）；全 aria-hidden（图标不承载唯一信息）；miss 显示占位不静默空白
- **CopyToClipboard**：Clipboard API 优先，失败控制台警告（调用方需感知降级）；成功内联「已复制」role=status
- **CountUp**：rAF 滚动数字、Intl 格式化；prefers-reduced-motion 下直接呈现终值

### Calendar / Heatmap / Gauge
- **Calendar**：页面内月历（独立于下拉版 DatePicker）；aria-current=date
- **Heatmap**：主色透明度阶梯（levels 0–4，无裸色）；title 提示；role=img + 汇总 aria-label
- **Gauge**：半圆 conic-gradient；role=progressbar 三值齐备

### CodeBlock / Image / Comment / BackTop
- **CodeBlock**：复制接 CopyToClipboard；语法高亮 = 集成（→ 全景专项层），不自研
- **Image**：onError 显式回退态（不显示碎图标）；rounded 档位
- **Comment**：支持嵌套回复（左线缩进）
- **BackTop**：passive scroll 监听、卸载清理、smooth 滚动

### ToggleGroup / Rate / CheckboxGroup / FormList
- **ToggleGroup**：`role=group + aria-pressed`（与 SegmentedControl 单选相对）；Space/Enter 切换由 preventDefault 防双触发
- **Rate**：`role=slider` 三值齐备；←→ 调整；readOnly 走文本第二通道；allowClear 可清零
- **CheckboxGroup**：values 单源、选项为受控投影
- **FormList**：增删统一收口、IconButton 移除带 aria-label、行内容由调用方渲染

### GlobalProgressBar / Countdown
- **GlobalProgressBar**：定值/不定态双形态；`role=progressbar`；零打断档（与 LoadingOverlay 相反取舍）
- **Countdown**：`role=timer`；interval 挂卸载清理；target 变化即重置
- **PinInput**：粘贴自动分发（含中段粘贴）、自动前进/Backspace 后退、填满触发 onComplete（自动提交由调用方裁决）；`autocomplete="one-time-code"` 支持系统级填充；字符过滤可配（默认数字）；交互测试已覆盖
- **边界**：中段 Backspace 会左移后续字符（字符串值模型无法表达空位）——OTP 场景通常从尾部删除，影响有限；位置保持需改占位符模型（下一批候选）
- **useSingleFlight（lib/timing）**：判定表机制 3 的实现——同 key 并发合并、共享 Promise、落定恢复；与缓存方案单飞、任务队列去重同形状
- **useCountdown(seconds, active)**：重发冷却剩余秒数；假时钟可测
- **纪律**：值的校验在领域层（→ 输入验证）；是否自动提交由调用方决定（→ 验证码方案）

### TreeMenu / LinkedSelects（菜单家族补充）
- **TreeMenu**：树状导航菜单——父为分组（aria-expanded 折叠）、叶子可选中（与 Tree 数据结构同构可互换）；外观按菜单密度收窄；方向键导航复用 Tree 模式（下一批并入）
- **LinkedSelects**：联动菜单（省/市/区式 N 级 Select）——`value: string[]` 路径与 Cascader 同构可互换；改选上级自动重置下级；列数随 children 收敛，叶子级不再追加空列

### FileDialog / 下载原语
- **FileDialog**：应用内虚拟文件系统选择器（entries 由调用方提供、路径即结构化 ID → 安全方案）；open/folder/save 三模式；面包屑导航 + 扩展名过滤 + 空目录空态
- **边界**：OS 原生对话框走桥接层（→ 系统能力方案/后端结构 binding），组件不接触真实 FS
- **saveBlob/saveUrl**：ObjectURL 落盘 + 及时 revoke；**fetchWithProgress**：流式读取 + loaded/total 回调（total 依赖 content-length，缺失为 null）
- **纪律**：下载 URL 白名单调用方裁决；进度呈现接任务中心 / GlobalProgressBar；大文件分块 → 主大纲绑定表

### useResumableUpload（断点续传钩子）
- **协议注入**：`init / uploadChunk / complete` 三方法契约（→《分片上传与断点续传方案》七环）；编排（并发/重试/暂停恢复/进度）由钩子承担
- **断点语义**：恢复带 uploadId 跳过 init 时仍重新预检（服务端已收片为准）；暂停保留断点、取消清理回 idle
- **状态机**：idle → preparing → uploading ⇄ paused → completed / failed（failed 带 error 与保留的部分进度）
- 测试：断点跳片、单片重试、重试耗尽、暂停恢复、取消（tests/upload.test.ts，内存 Mock 协议）

### Splitter / ZoomableContainer / Masonry（布局收官批）
- **Splitter**：Pointer Events 统一鼠标触屏、setPointerCapture、`role=separator` + 方向键 ±2（Shift=5）、min/max 百分比钳制；百分比持久化由调用方接状态方案
- **ZoomableContainer**：Ctrl/⌘+滚轮以光标为锚点缩放、双指捏合、单指平移（pannable 可关）、双击重置；min/max 钳制；内容含可交互元素时慎开 pannable
- **Masonry**：计数均衡近似（不测真实高度——高度差异极大的场景待测量版）；响应式列数配 useBreakpoint
- **待验证**：三引擎 Pointer Capture 行为、CSS aspect-ratio 支持（引擎基线）

### NotificationRouter（通知路由服务）
- **路由规则**（→ 操作反馈层级路由落地）：窗口可见 → Toast；不可见 → 系统通知（桥接注入）；拒绝/不可用 → Toast 降级；forceChannel 可强制
- **点击 → 统一唤回**：系统通知点击 → `routeNotificationClick(tag)` → focusWindow + 调用方跳转（桥接层接线）
- **权限**：unknown → 请求一次 → granted/denied 缓存；denied 永远走 Toast
- **边界**：tag 替换支持度待验证（→ 系统能力方案）；服务器推送管线由同步层信号驱动本服务，不在组件内实现
