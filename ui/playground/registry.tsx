import type { ReactNode } from 'react';
import {
  DemoAvatar, DemoBadge, DemoCopyToClipboard, DemoCountUp, DemoDivider, DemoIcon, DemoKbd,
  DemoLink, DemoSpinner, DemoTag, DemoTextEllipsis, DemoTitleText,
  DemoCheckableTag,
} from './demos/basics';
import {
  DemoAppShell, DemoCardStack, DemoContainer, DemoGrid, DemoLayoutOverview, DemoMasonry, DemoScrollArea,
  DemoSplitter, DemoStickyCenterAspect, DemoVirtualList, DemoVirtualizedTree, DemoZoomable,
} from './demos/layout';
import {
  DemoBackTop, DemoBreadcrumb, DemoContextMenu, DemoDropdownMenu, DemoNavOverview, DemoPagination,
  DemoSegmented, DemoSteps, DemoTabs, DemoTabsEditable, DemoToggleGroup, DemoTreeMenu, DemoNavMenu,
} from './demos/navigation';
import {
  DemoAutoComplete, DemoButtons, DemoCascader, DemoCascaderMultiple, DemoCheckbox, DemoDatePicker, DemoDateRange,
  DemoDatePickerVariants, DemoFormList, DemoFormItemRate, DemoInputNumber, DemoInputsOverview, DemoMultiSelect, DemoPassword, DemoTextInput, DemoPin,
  DemoRadio, DemoSearch, DemoSelect, DemoSelectListbox, DemoSlider, DemoSwitch, DemoTagInput, DemoTextarea,
  DemoTimePicker, DemoTransfer, DemoUpload,
} from './demos/inputs';
import {
  DemoCalendarHeatmapGauge, DemoCodeImage, DemoDescriptions, DemoDisplayOverview,
  DemoProgressSkeleton, DemoEmptyVariants, DemoStatisticCountdown, DemoTable, DemoTimelineCollapse,
  DemoTreeComment, DemoList, DemoThingGradient, DemoPopselect, DemoCardMetaRibbon, DemoTableScroll, DemoTableGrid,
} from './demos/display';
import {
  DemoAlert, DemoErrorBoundary, DemoFeedbackOverview, DemoGlobalProgress, DemoModal,
  DemoNotificationDrawer, DemoNotificationRouter, DemoResult,
} from './demos/feedback';
import {
  DemoCommandPalette, DemoDrawerTour, DemoLightbox, DemoOverlaysOverview, DemoPopover,
} from './demos/overlays';
import {
  DemoTreeSelect, DemoHoverCard, DemoLinkedSelects, DemoFileDialog,
  DemoCommandHint, DemoFileDialogNav, DemoOrgSelectorFooter,
  DemoHighlight, DemoEmojiPicker, DemoEditableText, DemoOfflineIndicator, DemoPermissionGate,
} from './demos/supplement';
import { DemoAdvancedTable, DemoBusinessOverview, DemoOrgSelector, DemoSearchForm } from './demos/business';
import { DemoChart, DemoCodeEditor, DemoMap, DemoQrCode, DemoRichText, DemoTerminal, DemoWhiteboard } from './demos/integrations';

export interface DemoEntry {
  id: string;
  name: string;
  description?: string;
  Component: () => ReactNode;
}

export interface DemoCategory {
  id: string;
  name: string;
  items: DemoEntry[];
}

/** 分类结构对照 Element Plus 的 overview 页面。 */
export const CATEGORIES: DemoCategory[] = [
  {
    id: 'basic',
    name: '基础组件',
    items: [
      { id: 'title-text', name: 'Typography 排版', Component: DemoTitleText },
      { id: 'link', name: 'Link 链接', Component: DemoLink },
      { id: 'kbd', name: 'Kbd 快捷键', Component: DemoKbd },
      { id: 'ellipsis', name: 'TextEllipsis 文本截断', Component: DemoTextEllipsis },
      { id: 'tag', name: 'Tag 标签', Component: DemoTag },
      { id: 'checkable-tag', name: 'CheckableTag 可勾选标签', Component: DemoCheckableTag },
      { id: 'avatar', name: 'Avatar 头像', Component: DemoAvatar },
      { id: 'divider', name: 'Divider 分割线', Component: DemoDivider },
      { id: 'icon', name: 'Icon 图标', Component: DemoIcon },
      { id: 'copy', name: 'CopyToClipboard 复制', Component: DemoCopyToClipboard },
      { id: 'countup', name: 'CountUp 数字滚动', Component: DemoCountUp },
      { id: 'badge', name: 'Badge 徽章', Component: DemoBadge },
      { id: 'spinner', name: 'Spinner 加载', Component: DemoSpinner },
    ],
  },
  {
    id: 'layout',
    name: '布局组件',
    items: [
      { id: 'layout-overview', name: 'Layout 总览', Component: DemoLayoutOverview },
      { id: 'card-stack', name: 'Card / Stack 卡片与间距', Component: DemoCardStack },
      { id: 'grid', name: 'Grid 栅格（响应式）', Component: DemoGrid },
      { id: 'container', name: 'Container 容器', Component: DemoContainer },
      { id: 'scrollarea', name: 'ScrollArea 滚动条', Component: DemoScrollArea },
      { id: 'splitter', name: 'Splitter 分割面板', Component: DemoSplitter },
      { id: 'masonry', name: 'Masonry 瀑布流', Component: DemoMasonry },
      { id: 'appshell', name: 'AppShell 应用骨架', Component: DemoAppShell },
      { id: 'sticky-center', name: 'Sticky / Center / AspectRatio', Component: DemoStickyCenterAspect },
      { id: 'zoom', name: 'ZoomableContainer 缩放容器', Component: DemoZoomable },
      { id: 'virtual', name: 'VirtualList 虚拟列表', Component: DemoVirtualList },
      { id: 'virtualized-tree', name: 'VirtualizedTree 虚拟化树', Component: DemoVirtualizedTree },
    ],
  },
  {
    id: 'nav',
    name: '导航组件',
    items: [
      { id: 'nav-overview', name: '导航总览', Component: DemoNavOverview },
      { id: 'tabs', name: 'Tabs 标签页', Component: DemoTabs },
      { id: 'navmenu', name: 'NavMenu 水平导航', Component: DemoNavMenu },
      { id: 'tabs-editable', name: 'Tabs 可编辑卡片', Component: DemoTabsEditable },
      { id: 'breadcrumb', name: 'Breadcrumb 面包屑', Component: DemoBreadcrumb },
      { id: 'pagination', name: 'Pagination 分页', Component: DemoPagination },
      { id: 'steps', name: 'Steps 步骤条', Component: DemoSteps },
      { id: 'segmented', name: 'SegmentedControl 分段控制器', Component: DemoSegmented },
      { id: 'togglegroup', name: 'ToggleGroup 多选分段', Component: DemoToggleGroup },
      { id: 'treemenu', name: 'TreeMenu 树状菜单', Component: DemoTreeMenu },
      { id: 'dropdown', name: 'DropdownMenu 下拉菜单', Component: DemoDropdownMenu },
      { id: 'contextmenu', name: 'ContextMenu 右键菜单', Component: DemoContextMenu },
      { id: 'backtop', name: 'BackTop 回到顶部', Component: DemoBackTop },
    ],
  },
  {
    id: 'form',
    name: '表单组件',
    items: [
      { id: 'inputs-overview', name: '录入总览', Component: DemoInputsOverview },
      { id: 'buttons', name: 'Button 按钮', Component: DemoButtons },
      { id: 'textinput', name: 'TextInput 输入框', Component: DemoTextInput },
      { id: 'textarea', name: 'Textarea 多行输入', Component: DemoTextarea },
      { id: 'checkbox', name: 'Checkbox / Group 多选框', Component: DemoCheckbox },
      { id: 'switch', name: 'Switch / FormItem 开关', Component: DemoSwitch },
      { id: 'radio', name: 'Radio / Group 单选框', Component: DemoRadio },
      { id: 'inputnumber', name: 'InputNumber 数字输入框', Component: DemoInputNumber },
      { id: 'password', name: 'PasswordInput 密码框', Component: DemoPassword },
      { id: 'search', name: 'SearchInput 搜索框', Component: DemoSearch },
      { id: 'slider', name: 'Slider 滑块', Component: DemoSlider },
      { id: 'select', name: 'Select 选择器（原生版）', Component: DemoSelect },
      { id: 'selectlistbox', name: 'SelectListbox 自绘选择器', Component: DemoSelectListbox },
      { id: 'multiselect', name: 'MultiSelect 下拉多选框', Component: DemoMultiSelect },
      { id: 'autocomplete', name: 'AutoComplete 自动补全', Component: DemoAutoComplete },
      { id: 'datepicker', name: 'DatePicker 日期选择器', Component: DemoDatePicker },
      { id: 'datepicker-variants', name: 'DatePicker 周/月/年', Component: DemoDatePickerVariants },
      { id: 'daterange', name: 'DateRangePicker 日期范围', Component: DemoDateRange },
      { id: 'timepicker', name: 'TimePicker 时间选择器', Component: DemoTimePicker },
      { id: 'taginput', name: 'TagInput 标签输入框', Component: DemoTagInput },
      { id: 'transfer', name: 'Transfer 穿梭框', Component: DemoTransfer },
      { id: 'cascader', name: 'Cascader 级联选择器', Component: DemoCascader },
      { id: 'cascader-multiple', name: 'Cascader 多选 级联下拉多选', Component: DemoCascaderMultiple },
      { id: 'upload', name: 'Upload 上传器', Component: DemoUpload },
      { id: 'pin', name: 'PinInput 验证码输入', Component: DemoPin },
      { id: 'formlist', name: 'FormList 动态字段', Component: DemoFormList },
      { id: 'formitem-rate', name: 'FormItem / Rate 评分', Component: DemoFormItemRate },
    ],
  },
  {
    id: 'data',
    name: '数据展示',
    items: [
      { id: 'display-overview', name: '展示总览', Component: DemoDisplayOverview },
      { id: 'table', name: 'Table 表格（排序/可编辑）', Component: DemoTable },
      { id: 'table-scroll', name: 'Table 吸顶表头', Component: DemoTableScroll },
      { id: 'table-grid', name: 'Table 数据网格（选择/虚拟/展开/汇总/导出）', Component: DemoTableGrid },
      { id: 'descriptions', name: 'Descriptions 描述列表', Component: DemoDescriptions },
      { id: 'progress-skeleton', name: 'Progress / Skeleton 进度与骨架', Component: DemoProgressSkeleton },
      { id: 'empty', name: 'Empty 空状态（四变体）', Component: DemoEmptyVariants },
      { id: 'timeline-collapse', name: 'Timeline / Collapse', Component: DemoTimelineCollapse },
      { id: 'statistic-countdown', name: 'Statistic / Countdown 统计', Component: DemoStatisticCountdown },
      { id: 'calendar-heatmap-gauge', name: 'Calendar / Heatmap / Gauge', Component: DemoCalendarHeatmapGauge },
      { id: 'code-image', name: 'CodeBlock / Image 代码与图片', Component: DemoCodeImage },
      { id: 'tree-comment', name: 'Tree / Comment 树与评论', Component: DemoTreeComment },
      { id: 'list', name: 'List 列表', Component: DemoList },
      { id: 'thing', name: 'Thing / GradientText / Time', Component: DemoThingGradient },
      { id: 'popselect', name: 'Popselect 弹出单选', Component: DemoPopselect },
      { id: 'card-meta', name: 'Card.Meta / Ribbon', Component: DemoCardMetaRibbon },
    ],
  },
  {
    id: 'feedback',
    name: '反馈组件',
    items: [
      { id: 'feedback-overview', name: '反馈总览', Component: DemoFeedbackOverview },
      { id: 'alert', name: 'Alert 提示', Component: DemoAlert },
      { id: 'result', name: 'Result 结果页', Component: DemoResult },
      { id: 'modal', name: 'Modal 对话框', Component: DemoModal },
      { id: 'errorboundary', name: 'ErrorBoundary 错误边界', Component: DemoErrorBoundary },
      { id: 'globalprogress', name: 'GlobalProgressBar 全局进度', Component: DemoGlobalProgress },
      { id: 'router-sandbox', name: 'NotificationRouter 通知路由', Component: DemoNotificationRouter },
      { id: 'notification-drawer', name: 'NotificationDrawer 通知中心', Component: DemoNotificationDrawer },
    ],
  },
  {
    id: 'overlays',
    name: '浮层组件',
    items: [
      { id: 'overlays-overview', name: '浮层总览', Component: DemoOverlaysOverview },
      { id: 'popover', name: 'Popover / Tooltip 弹出与提示', Component: DemoPopover },
      { id: 'lightbox', name: 'Lightbox 灯箱', Component: DemoLightbox },
      { id: 'palette', name: 'CommandPalette 命令面板', Component: DemoCommandPalette },
      { id: 'drawer-tour', name: 'Drawer / Tour 抽屉与引导', Component: DemoDrawerTour },
    ],
  },
  {
    id: 'supplement',
    name: '补充组件',
    items: [
      { id: 'treeselect', name: 'TreeSelect 树形选择', Component: DemoTreeSelect },
      { id: 'hovercard', name: 'HoverCard 悬停卡片', Component: DemoHoverCard },
      { id: 'linkedselects', name: 'LinkedSelects 联动菜单', Component: DemoLinkedSelects },
      { id: 'filedialog', name: 'FileDialog 文件对话框', Component: DemoFileDialog },
      { id: 'commandhint', name: 'CommandHint 命令提示', Component: DemoCommandHint },
      { id: 'filedialognav', name: 'FileDialogNav 文件导航', Component: DemoFileDialogNav },
      { id: 'orgfooter', name: 'OrgSelectorFooter 组织底部', Component: DemoOrgSelectorFooter },
      { id: 'highlight', name: 'Highlight 命中高亮', Component: DemoHighlight },
      { id: 'emojipicker', name: 'EmojiPicker 表情选择器', Component: DemoEmojiPicker },
      { id: 'editabletext', name: 'EditableText 行内编辑', Component: DemoEditableText },
      { id: 'offlineindicator', name: 'OfflineIndicator 离线指示', Component: DemoOfflineIndicator },
      { id: 'permissiongate', name: 'PermissionGate 权限门', Component: DemoPermissionGate },
    ],
  },
  {
    id: 'business',
    name: '业务组件',
    items: [
      { id: 'business-overview', name: '业务组件总览', Component: DemoBusinessOverview },
      { id: 'searchform', name: 'SearchForm 搜索表单', Component: DemoSearchForm },
      { id: 'advancedtable', name: 'AdvancedTable 高级表格', Component: DemoAdvancedTable },
      { id: 'orgselector', name: 'OrgSelector 组织选择器', Component: DemoOrgSelector },
    ],
  },
  {
    id: 'integrations',
    name: '集成封装',
    items: [
      { id: 'chart', name: 'Chart 图表（echarts）', Component: DemoChart },
      { id: 'map', name: 'Map 地图（leaflet）', Component: DemoMap },
      { id: 'codeeditor', name: 'CodeEditor 编辑器（monaco）', Component: DemoCodeEditor },
      { id: 'terminal', name: 'Terminal 终端（xterm）', Component: DemoTerminal },
      { id: 'richtext', name: 'RichText 富文本（tiptap）', Component: DemoRichText },
      { id: 'whiteboard', name: 'Whiteboard 白板（tldraw）', Component: DemoWhiteboard },
      { id: 'qrcode', name: 'QrCode 二维码（qrcode）', Component: DemoQrCode },
    ],
  },
];

export const ALL_ITEMS: DemoEntry[] = CATEGORIES.flatMap((c) => c.items);

export function findDemo(id: string): DemoEntry | undefined {
  return ALL_ITEMS.find((d) => d.id === id);
}

export function categoryOf(id: string): DemoCategory | undefined {
  return CATEGORIES.find((c) => c.items.some((d) => d.id === id));
}
