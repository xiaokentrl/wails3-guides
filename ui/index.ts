/**
 * 公共组件库桶导出（去重终版）。
 * 消费方只从这里 import；组件内部相对引用不经此文件。
 * 新增导出前先搜索确认不重复。
 */

/* ===== lib 工具 ===== */
export { cn, type ClassPart } from './lib/cn.ts';
export { useFocusTrap } from './lib/useFocusTrap.ts';
export { usePortalContainer } from './lib/portal.ts';
export { useDebouncedValue, useDebouncedCallback, useThrottledCallback } from './lib/timing.ts';
export { useCountdown, useCountdownUntil, useSingleFlight } from './lib/timing.ts';
export { useStaleWhileRevalidate, useAuthoritativeRead, useOfflineSnapshot, type SwrState, type SwrOptions, type OfflineSnapshotState, type OfflineSnapshotOptions } from './lib/read.ts';
export { setFormatContext, getFormatContext, formatDate, formatRelative, formatNumber, formatCurrency, addMinor, allocateMinor, parseDateOnly, parseLocaleNumber, type FormatContext, type DateStyle, type NumberFormatOptions } from './lib/format.ts';
export { useMediaQuery, useBreakpoint, type Breakpoint } from './lib/media.ts';
export { saveBlob, saveUrl, fetchWithProgress, exportCsv, toCsvBlob } from './lib/download.ts';
export { splitFile, chunkProgress, useResumableUpload, type FileChunk, type ResumableUploadContract, type ResumableState, type ResumableControls } from './lib/upload.ts';

/* ===== 基础组件 ===== */
export { Title, Text, type TitleProps, type TextProps } from './components/Text.tsx';
export { Link, type LinkProps } from './components/Link.tsx';
export { Kbd, VisuallyHidden } from './components/Kbd.tsx';
export { TextEllipsis, type TextEllipsisProps } from './components/TextEllipsis.tsx';
export { Highlight, HighlightNode, type HighlightProps } from './components/Highlight.tsx';
export { List, ListItem, type ListProps, type ListItemProps } from './components/List.tsx';
export { Thing, GradientText, type ThingProps } from './components/Thing.tsx';
export { Time, type TimeProps } from './components/Time.tsx';
export { AppShell, type AppShellProps } from './components/AppShell.tsx';
export { Popselect, type PopselectProps, type PopselectOption } from './components/Popselect.tsx';
export { NavMenu, type NavMenuProps, type NavMenuItem } from './components/NavMenu.tsx';
export { Tag, type TagProps } from './components/Tag.tsx';
export { CheckableTag, type CheckableTagProps } from './components/Tag.tsx';
export { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps } from './components/Avatar.tsx';
export { Divider, type DividerProps } from './components/Divider.tsx';
export { Icon, registerIcon, type IconProps } from './components/Icon.tsx';
export { CopyToClipboard, type CopyToClipboardProps } from './components/CopyToClipboard.tsx';
export { CountUp, type CountUpProps } from './components/CountUp.tsx';
export { Badge, type BadgeProps } from './components/Badge.tsx';
export { BadgeRibbon, type BadgeRibbonProps } from './components/Badge.tsx';
export { Spinner, type SpinnerProps } from './components/Spinner.tsx';

/* ===== 布局组件 ===== */
export { Card, type CardProps } from './components/Card.tsx';
export { CardMeta, type CardMetaProps } from './components/Card.tsx';
export { Stack, Grid, Container, type StackProps, type GridProps } from './components/Layout.tsx';
export { Sticky, Center, AspectRatio, type StickyProps, type AspectRatioProps } from './components/Layout.tsx';
export { ScrollArea, type ScrollAreaProps } from './components/ScrollArea.tsx';
export { Splitter, type SplitterProps } from './components/Splitter.tsx';
export { Masonry, type MasonryProps } from './components/Masonry.tsx';
export { ZoomableContainer, type ZoomableContainerProps } from './components/ZoomableContainer.tsx';
export { VirtualList, useVirtualList, type VirtualListProps } from './components/VirtualList.tsx';
export { VirtualizedTree, type VirtualizedTreeProps } from './components/VirtualizedTree.tsx';

/* ===== 导航组件 ===== */
export { Tabs, type TabsProps, type TabItem } from './components/Nav.tsx';
export { Breadcrumb, type BreadcrumbItem } from './components/Nav.tsx';
export { Pagination, type PaginationProps } from './components/Nav.tsx';
export { Steps, type StepsProps } from './components/Nav.tsx';
export { SegmentedControl, type SegmentedControlProps } from './components/Nav.tsx';
export { ToggleGroup, type ToggleGroupProps } from './components/ToggleGroup.tsx';
export { TreeMenu, type TreeMenuProps, type TreeMenuNode, type TreeMenuTreeNode } from './components/TreeMenu.tsx';
export { DropdownMenu, type MenuItem, type MenuEntry } from './components/Menu.tsx';
export { ContextMenu } from './components/Menu.tsx';
export { BackTop, type BackTopProps } from './components/BackTop.tsx';

/* ===== 输入组件 ===== */
export { Button, type ButtonProps } from './components/Button.tsx';
export { IconButton, type IconButtonProps } from './components/IconButton.tsx';
export { TextInput, type TextInputProps } from './components/TextInput.tsx';
export { Textarea, type TextareaProps } from './components/Textarea.tsx';
export { Checkbox, type CheckboxProps } from './components/Checkbox.tsx';
export { CheckboxGroup, type CheckboxGroupProps } from './components/CheckboxGroup.tsx';
export { Switch, type SwitchProps } from './components/Switch.tsx';
export { Radio, RadioGroup, type RadioProps, type RadioGroupProps } from './components/Radio.tsx';
export { InputNumber, type InputNumberProps } from './components/InputExtra.tsx';
export { PasswordInput, type PasswordInputProps } from './components/InputExtra.tsx';
export { SearchInput } from './components/InputExtra.tsx';
export { Slider, type SliderProps } from './components/Pickers.tsx';
export { Select, type SelectProps } from './components/Pickers.tsx';
export { SelectListbox, type ListboxOption } from './components/Listbox.tsx';
export { MultiSelect, type MultiSelectProps, type MultiSelectOption } from './components/MultiSelect.tsx';
export { EmojiPicker, type EmojiPickerProps } from './components/EmojiPicker.tsx';
export { EditableText, type EditableTextProps } from './components/EditableText.tsx';
export { AutoComplete } from './components/AutoComplete.tsx';
export { DatePicker, type DatePickerProps } from './components/DatePicker.tsx';
export { DateRangePicker, type DateRangePickerProps, type DateRange } from './components/DateRangePicker.tsx';
export { TimePicker, type TimePickerProps } from './components/TimePicker.tsx';
export { TagInput, type TagInputProps } from './components/TagInput.tsx';
export { Transfer, type TransferProps, type TransferOption } from './components/Transfer.tsx';
export { Cascader, type CascaderProps, type CascaderOption } from './components/Cascader.tsx';
export { Upload, type UploadProps, type UploadContext } from './components/Upload.tsx';
export { PinInput, type PinInputProps } from './components/PinInput.tsx';
export { FormList, type FormListProps, type FormListField } from './components/FormList.tsx';
export { FormItem, type FormItemProps } from './components/FormItem.tsx';
export { Rate, type RateProps } from './components/Rate.tsx';
export { InputGroup, type InputGroupProps } from './components/InputGroup.tsx';
export { Form, FormField, useForm, type FormProps, type FormErrors, type FormContextValue } from './components/Form.tsx';

/* ===== 数据展示 ===== */

export { Table, type TableProps, type TableColumn } from './components/Data.tsx';
export { EditableCell, type EditableCellProps } from './components/Data.tsx';
export { Descriptions, type DescriptionItem } from './components/Data.tsx';
export { Progress, type ProgressProps } from './components/Data.tsx';
export { Empty, type EmptyProps } from './components/Data.tsx';
export { Timeline, type TimelineItem } from './components/Data.tsx';
export { Collapse, type CollapseItem } from './components/Data.tsx';
export { Statistic, type StatisticProps } from './components/Data.tsx';
export { Image, type ImageProps } from './components/Image.tsx';
export { Calendar, type CalendarProps } from './components/Calendar.tsx';
export { Heatmap, type HeatmapProps, type HeatmapDatum } from './components/Heatmap.tsx';
export { Gauge, type GaugeProps } from './components/Gauge.tsx';
export { CodeBlock, type CodeBlockProps } from './components/CodeBlock.tsx';
export { Comment, type CommentProps } from './components/Comment.tsx';
export { Countdown, type CountdownProps } from './components/Countdown.tsx';
export { Tree, type TreeProps, type TreeNodeData } from './components/Tree.tsx';

/* ===== 反馈 / 浮层 ===== */
export { Modal, type ModalProps } from './components/Modal.tsx';
export { Drawer, type DrawerProps } from './components/Drawer.tsx';
export { ToastProvider, useToast, type ToastKind } from './components/Toast.tsx';
export { Tooltip, type TooltipProps } from './components/Tooltip.tsx';
export { Popover, type PopoverProps } from './components/Popover.tsx';
export { HoverCard, type HoverCardProps } from './components/HoverCard.tsx';
export { Lightbox, type LightboxProps, type LightboxImage } from './components/Lightbox.tsx';
export { CommandPalette, CommandHint, type CommandPaletteProps, type CommandItem } from './components/CommandPalette.tsx';
export { Tour, type TourProps, type TourStep } from './components/Tour.tsx';
export { Alert, Result, type AlertProps, type ResultProps } from './components/Feedback.tsx';
export { ErrorBoundary, type ErrorBoundaryProps } from './components/ErrorBoundary.tsx';
export { GlobalProgressBar, type GlobalProgressBarProps } from './components/GlobalProgressBar.tsx';
export { NotificationRouter, useNotifications, type NotificationRouterProps, type NotificationRouterValue, type NotificationRequest, type NotificationPermission, type NotificationChannel, type SystemNotifyResult } from './components/NotificationRouter.tsx';
export { NotificationDrawer, type NotificationDrawerProps, type NotificationItem } from './components/NotificationDrawer.tsx';
export { NotificationCard, NotificationArea, type NotificationCardProps } from './components/Notification.tsx';
export { MessageBoxProvider, useMessageBox, type MessageBoxOptions, type MessageBoxResult } from './components/MessageBox.tsx';
export { Popconfirm, type PopconfirmProps } from './components/Popconfirm.tsx';
export { Banner, type BannerProps } from './components/Banner.tsx';
export { LoadingOverlay, type LoadingOverlayProps } from './components/LoadingOverlay.tsx';
export { SkeletonShape, type SkeletonShapeProps } from './components/SkeletonShape.tsx';
export { InfiniteScroll, type InfiniteScrollProps } from './components/InfiniteScroll.tsx';
export { StatusDot, type StatusDotProps } from './components/StatusDot.tsx';
export { OfflineIndicator, type OfflineIndicatorProps } from './components/OfflineIndicator.tsx';
export { PermissionGate, PermissionGateOf, PermissionProvider, usePermission, type PermissionGateProps, type PermissionStrategy } from './components/PermissionGate.tsx';
export { PageHeader, type PageHeaderProps } from './components/PageHeader.tsx';
export { Affix, type AffixProps } from './components/Affix.tsx';
export { Watermark, type WatermarkProps } from './components/Watermark.tsx';
export { Carousel, type CarouselProps } from './components/Carousel.tsx';
export { FileDialog, FileDialogNav, type FileDialogProps, type FileEntry } from './components/FileDialog.tsx';
export { Anchor, type AnchorProps, type AnchorItem } from './components/Anchor.tsx';
export { FloatButton, type FloatButtonProps, type FloatButtonAction } from './components/FloatButton.tsx';
export { ColorPicker, type ColorPickerProps } from './components/ColorPicker.tsx';
export { DateTimePicker, type DateTimePickerProps } from './components/DateTimePicker.tsx';
export { Mentions, type MentionsProps, type MentionUser } from './components/Mentions.tsx';
export { ScrollSpy, type ScrollSpyProps, type ScrollSpyItem } from './components/ScrollSpy.tsx';
export { ImageGroup, type ImageGroupProps } from './components/ImageGroup.tsx';

/* ===== 通用业务组件 ===== */
export { SearchForm, type SearchFormProps, type SearchFormField } from './business/SearchForm.tsx';
export { AdvancedTable, type AdvancedTableProps } from './business/AdvancedTable.tsx';
export { OrgSelector, OrgSelectorFooter, type OrgSelectorProps, type OrgTreeNode } from './business/OrgSelector.tsx';

/* 补充导出（此前遗漏） */
export { LinkedSelects, type LinkedSelectsProps } from './components/LinkedSelects';
export { SliderRange, type SliderRangeProps } from './components/SliderRange';
export { ThemeProvider, useTheme, type Theme, type ThemeContextValue } from './components/ThemeProvider';
export { PopconfirmTrigger } from './components/Popconfirm';

export { Skeleton } from './components/Data.tsx';
export { TreeSelect } from './components/Tree.tsx';
export { VirtualListDynamic } from './components/VirtualList.tsx';
