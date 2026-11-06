# @kickoff/ui —— 公共组件库

跨引擎一致的公共组件库首批交付（React 18 + TypeScript）。结构、纪律与积累机制 →《多平台一致组件库方案》《前端目录结构方案》。

## 结构

```
ui/
├── tokens/tokens.css     # 设计令牌单源（语义色/间距/圆角/字体/层级/动效，明暗两套）
├── lib/cn.ts             # className 组合器
├── components/           # 每组件：.tsx + .css
├── business/             # 通用业务组件（三级组件中间层，三次规则入库）
├── integrations/         # 外部库集成封装模板（懒加载/销毁/自适应；复制到项目并安装 peer 库，不入桶）
├── tests/                # 核心交互测试（vitest + RTL，项目内运行）
├── docs/COMPONENTS.md    # 组件卡目录（简版：API/状态/无障碍/待验证）
├── docs/EXAMPLES.tsx     # 可运行示例（挂路由即全组件总览 + 冒烟入口）
├── playground/           # 组件导航（分类菜单 + 实时交互演示，见下）
├── index.ts              # 桶导出（消费方唯一入口）
└── package.json
```

## 组件（91 个导出）

- **基础**：Title · Text · Link · Kbd · VisuallyHidden · TextEllipsis · Tag · Avatar/Group · Divider · **Icon（注册表制）** · CopyToClipboard · CountUp
- **布局**：Stack · Grid · Container · Card · ScrollArea · VirtualList
- **导航**：Tabs（溢出滚动） · Breadcrumb · Pagination · Steps · SegmentedControl · DropdownMenu（分组/分隔线/窗口化） · ContextMenu · BackTop · **ToggleGroup** · **TreeMenu（树状菜单） · LinkedSelects（联动菜单）**
- **文件对话框家族**：FileDialog（open/folder/save 三模式） · Upload（拖拽+**逐文件进度+取消**） · saveBlob/saveUrl/fetchWithProgress（下载原语，**可中止**）
- **录入**：Button · IconButton · TextInput · Textarea · Checkbox · CheckboxGroup · Switch · Radio/Group · InputNumber · PasswordInput · SearchInput · Slider · Select（原生版） · SelectListbox（自绘） · AutoComplete · DatePicker（单月） · DateRangePicker · TimePicker · TagInput · Transfer · Cascader · Upload · **FormList · Rate · FormItem**
- **展示**：Skeleton · Table（排序 + EditableCell） · Descriptions · Progress · Empty · Timeline · Collapse · Statistic · Badge · Spinner · Tree/TreeSelect · VirtualList（固定/动态行高） · **Calendar · Heatmap · Gauge · CodeBlock · Image · Comment · Countdown**
- **反馈/浮层**：Modal · Toast · Tooltip（翻转/受控） · Alert · Result · ErrorBoundary · Popover（翻转） · Lightbox · CommandPalette · Drawer · HoverCard（翻转） · NotificationDrawer · Tour · GlobalProgressBar · **NotificationRouter（Toast/系统通知路由+降级+唤回）**
- **收尾完成**：Cascader 键盘导航 · DatePicker 双面板 + 悬停预览 · Tree 拖拽（环检测内建） · Tooltip/HoverCard 定位翻转 · SelectListbox 长列表窗口化 · splitFile 分片原语
- **读策略钩子**：useStaleWhileRevalidate（陈旧标记/迟到丢弃） · useAuthoritativeRead（决策点直读）——判定表 →《全局一致性读策略》
- **未实现（有意）**：Menu 长列表虚拟化（同 SelectListbox 模式，需要时套用） · 剩余均为外部库集成封装（→《组件库全景》专项能力层）
- **集成封装（不自研）**：图表 · 代码编辑器 · 地图 · 富文本 · RTC（包外部库，→《组件库全景》）

选型对应《多平台一致组件库方案》二档「输入 + 反馈 + 展示」优先级。

## 使用

```tsx
import 'ui/tokens/tokens.css';        // 根组件引入一次（令牌）
import { Button, TextInput, ToastProvider } from 'ui';

<ToastProvider>
  <Button variant="primary" loading={saving}>保存</Button>
</ToastProvider>
```

主题切换：根节点设置 `data-theme="dark" | "light"`（跟随系统 + 手动覆盖的逻辑在应用层，→ 状态方案）。

## 纪律（写新组件前必读）

1. **样式只引用 `--ui-*` 令牌，禁裸值**（令牌审计覆盖本目录）
2. **IME 纪律**：输入组件不拦截/不改写组合态值；格式化在 compositionEnd 后
3. **无障碍**：每个可交互组件有完整语义与键盘路径；焦点可见；状态不只靠颜色
4. **无障碍名称**：纯图标组件的 `label` 必填（类型强制）
5. **模态弹框必须走 useFocusTrap（modal 模式）**：参与弹框栈（z-index 递增 / 滚动锁引用计数 / Escape 只关最上层），不得自写 body overflow
6. **零运行时依赖**：不引入 CSS-in-JS / UI 框架；CSP 友好
7. **平台相关行为先验证**：未验证标注「待验证」（见组件卡），不标注待验证的行为不存在

## 入库状态（四件套，→ 组件库方案）

| 件 | 状态 |
|---|---|
| 组件卡 | ✓ 简版（docs/COMPONENTS.md；三引擎截图随项目期补） |
| 三引擎渲染冒烟 | 待项目期（EXAMPLES.tsx 挂路由即入口） |
| 交互 + a11y 测试 | ✓ 12 组（components 7 + timing 5，含单飞/倒计时假时钟；项目内 vitest 运行） |
| 可运行示例 | ✓ docs/EXAMPLES.tsx（总览页）+ playground/（分类导航，逐组件实时演示） |

## 组件导航（Playground）

`playground/PlaygroundApp` 是带**分类菜单 + 组件搜索 + 逐组件实时交互演示**的挂载页：

```tsx
import 'ui/tokens/tokens.css';
import 'ui/playground/playground.css';
import { PlaygroundApp } from 'ui/playground/PlaygroundApp';

// 项目内挂到任意路由：/<PlaygroundApp />
```

- 分类结构 = 《组件库全景》七大类，登记表在 `playground/registry.tsx`（新组件先进 COMPONENTS.md 再进 registry）
- 每个组件一个实时交互 demo（`playground/demos/` 按分类分文件），全部可操作
- 外壳自带 NotificationRouter（含 ToastProvider）——通知/Toast/弹框类 demo 开箱即用
- 集成期即三引擎冒烟统一入口：逐组件过一遍 = 逐组件截三引擎图

## 消费方式

整体复制 `ui/` 到项目（与 guides/ 同哲学），或建立 workspace 引用——**二选一并记录**（→ 组件库方案）。项目内改动必须回流本目录，禁止 fork 后静默修改。

## 已声明的待验证项（汇总）

- 三引擎 `:focus-visible`、组合态输入、绝对定位/翻转行为
- WebView 环境下 `role=alert` 的播报时机
- Linux focus-follows-mouse 合成器下 Modal 的稳定性
- 引擎对 `prefers-reduced-motion` 的传递（WebView2/WebKitGTK）
