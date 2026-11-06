/**
 * 可运行示例（→ 组件库方案入库四件套「可运行示例」件）。
 * 把本文件挂到任意项目的路由（如 /ui-demo）即可总览组件库；
 * 集成期它同时是三引擎冒烟的统一入口页。
 */
import { useState } from 'react';
import {
  Alert, Avatar, AvatarGroup, Badge, Breadcrumb, Button, Card, Checkbox, Collapse, Cascader,
  DateRangePicker, Descriptions, Divider, Drawer, DropdownMenu, EditableCell, Empty, FileDialog,
  GlobalProgressBar, Grid, HoverCard, IconButton, InputNumber, Kbd, LinkedSelects, Modal,
  Pagination, Popover, Progress, RadioGroup, Result, SearchInput, SegmentedControl, Select,
  Skeleton, Slider, Spinner, Statistic, Steps, Switch, Table, Tabs, Tag, TagInput, Text,
  TextEllipsis, Textarea, TextInput, Timeline, Title, ToastProvider, Tooltip, Tour, Transfer,
  Tree, TreeMenu, Upload, useToast,
  Stack, Rate, CheckboxGroup, ToggleGroup, FormList, Countdown, CodeBlock, BackTop,
  MultiSelect, AppShell, DatePicker, List, ListItem, CheckableTag,
} from '../index';

function DemoSections() {
  const toast = useToast();
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [tour, setTour] = useState(false);
  const [sw, setSw] = useState(true);
  const [ck, setCk] = useState(false);
  const [num, setNum] = useState<number | null>(2);
  const [slider, setSlider] = useState(40);
  const [seg, setSeg] = useState('day');
  const [sel, setSel] = useState('a');
  const [page, setPage] = useState(1);
  const [tags, setTags] = useState(['设计', '前端']);
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [cascader, setCascader] = useState<string[]>([]);
  const [rate, setRate] = useState(3);
  const [fileDialog, setFileDialog] = useState(false);
  const [listFields, setListFields] = useState([{ key: 'f-seed' }]);
  const [transfer, setTransfer] = useState<string[]>([]);
  const [editable, setEditable] = useState('点击编辑');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24 }}>
      <div>
        <Breadcrumb items={[{ label: '首页', href: '#' }, { label: '组件演示' }]} />
        <Title level={2}>基础</Title>
        <Stack direction="horizontal" gap={3} wrap>
          <Button variant="primary">主要</Button>
          <Button loading>加载中</Button>
          <IconButton label="设置">⚙</IconButton>
          <Tag closable onClose={() => toast.toast({ message: '已移除' })}>标签</Tag>
          <Badge tone="success">正常</Badge>
          <Avatar fallback="K" />
          <AvatarGroup max={2}>
            <Avatar fallback="A" />
            <Avatar fallback="B" />
            <Avatar fallback="C" />
          </AvatarGroup>
          <Kbd>Mod</Kbd>
          <Kbd>K</Kbd>
          <Switch checked={sw} onChange={setSw} label="开关" />
          <Checkbox checked={ck} onChange={(e) => setCk(e.target.checked)} label="复选" description="带说明" />
        </Stack>
        <Divider label="文本" />
        <Title level={3}>三级标题</Title>
        <Text type="secondary">
          次要文本 ·
          <Kbd>Tab</Kbd>
          试试焦点可见性
        </Text>
      </div>

      <div>
        <Title level={2}>录入</Title>
        <Stack direction="vertical" gap={3}>
          <TextInput label="名称" placeholder="输入试试（IME 安全）" hint="组合态不会被改写" />
          <Textarea label="备注" rows={2} />
          <InputNumber value={num} onChange={setNum} min={0} max={10} />
          <SearchInput placeholder="搜索…" />
          <Slider value={slider} onChange={setSlider} label="音量" />
          <RadioGroup
            name="freq"
            value="week"
            onChange={() => {}}
            options={[
              { value: 'day', label: '按天' },
              { value: 'week', label: '按周' },
            ]}
          />
          <Stack direction="horizontal" gap={3} wrap>
            <Select
              label="归属"
              value={sel}
              onChange={setSel}
              options={[
                { value: 'a', label: '选项 A' },
                { value: 'b', label: '选项 B' },
              ]}
            />
            <DateRangePicker value={range} onChange={setRange} />
            <TagInput tags={tags} onChange={setTags} />
          </Stack>
        </Stack>
      </div>

      <div>
        <Title level={2}>展示</Title>
        <Grid columns="repeat(4, 1fr)">
          <Statistic title="今日请求" value={128420} />
          <Progress value={72} label="进度" />
          <Card padding="sm">
            <Text>Card 内容</Text>
          </Card>
          <div>
            <Skeleton width="80%" />
            <Skeleton width="60%" />
          </div>
        </Grid>
        <Tabs
          items={[
            { key: '1', label: '标签一' },
            { key: '2', label: '标签二' },
            { key: '3', label: '标签三', disabled: true },
          ]}
        />
        <Steps steps={['填写', '确认', '完成']} current={1} />
        <SegmentedControl
          value={seg}
          onChange={setSeg}
          options={[
            { value: 'day', label: '日' },
            { value: 'week', label: '周' },
          ]}
        />
        <Pagination current={page} total={95} pageSize={10} onChange={setPage} />
        <Descriptions
          items={[
            { label: '键', value: '值' },
            { label: '键二', value: '值二' },
          ]}
        />
        <Collapse items={[{ key: '1', title: '折叠项一', content: '内容' }]} />
        <Timeline
          items={[
            { title: '事件一', time: '10:00' },
            { title: '事件二', time: '11:00' },
          ]}
        />
      </div>

      <div>
        <Title level={2}>反馈与浮层</Title>
        <Stack direction="horizontal" gap={3} wrap>
          <Button onClick={() => toast.toast({ kind: 'success', message: '已导出到磁盘' })}>Toast</Button>
          <Button onClick={() => toast.toast({ kind: 'error', message: '导出失败——磁盘已满。清理后重试' })}>失败反馈</Button>
          <Button onClick={() => setModal(true)}>Modal</Button>
          <Button onClick={() => setDrawer(true)}>Drawer</Button>
          <Button onClick={() => setTour(true)}>引导</Button>
          <Popover trigger={<Button>Popover</Button>}>弹出内容</Popover>
          <DropdownMenu
            trigger={<Button>菜单 ▾</Button>}
            items={[
              { key: '1', label: '重命名', onSelect: () => {} },
              { key: '2', label: '删除', danger: true, onSelect: () => {} },
            ]}
          />
          <Tooltip label="提示文本">
            <Button>Tooltip</Button>
          </Tooltip>
          <HoverCard content={<div style={{ padding: 8 }}>悬停卡片内容</div>}>
            <Button>HoverCard</Button>
          </HoverCard>
          <TextEllipsis maxWidth={120}>很长很长很长会被截断的文本示例</TextEllipsis>
          <TextEllipsis maxWidth={120}>很长很长很长会被截断的文本示例</TextEllipsis>
        </Stack>
        <Alert tone="warning" title="配额将满">
          当前用量已达 90%，建议清理历史数据。
        </Alert>
      </div>

      <div>
        <Title level={2}>数据</Title>
        <Table
          columns={[
            { key: 'name', title: '名称', sorter: (a, b) => String(a.name).localeCompare(String(b.name)) },
            {
              key: 'owner',
              title: '负责人',
              render: () => <EditableCell value={editable} onCommit={setEditable} />,
            },
            { key: 'size', title: '大小', align: 'right' },
          ]}
          rows={[
            { name: 'a', size: '1 KB' },
            { name: 'b', size: '2 KB' },
          ]}
          rowKey={(r) => String(r.name)}
        />
        <Pagination current={page} total={95} pageSize={10} onChange={setPage} />
        <Tree
          data={[
            { key: '1', label: '分组', children: [{ key: '1-1', label: '子项' }] },
            { key: '2', label: '叶子' },
          ]}
          defaultExpanded={['1']}
        />
        <TreeMenu
          data={[
            { key: 'm1', label: '总览' },
            {
              key: 'm2',
              label: '设置',
              children: [
                { key: 'm2-1', label: '常规' },
                { key: 'm2-2', label: '快捷键' },
              ],
            },
          ]}
          defaultExpanded={['m2']}
        />
        <LinkedSelects
          options={[
            {
              value: 'gd',
              label: '广东',
              children: [
                { value: 'sz', label: '深圳' },
                { value: 'gz', label: '广州' },
              ],
            },
            { value: 'gx', label: '广西', children: [{ value: 'nn', label: '南宁' }] },
          ]}
          value={[]}
          onChange={() => {}}
          placeholders={['省', '市']}
        />
        <Stack direction="horizontal" gap={3} wrap align="flex-start">
          <Cascader
            options={[
              {
                value: 'zh',
                label: '前端',
                children: [
                  { value: 'react', label: 'React' },
                  { value: 'vue', label: 'Vue' },
                ],
              },
              { value: 'go', label: '后端' },
            ]}
            value={cascader}
            onChange={(v) => setCascader(v as string[])}
          />
          <Transfer
            options={[
              { value: '1', label: '成员一' },
              { value: '2', label: '成员二' },
              { value: '3', label: '成员三' },
            ]}
            value={transfer}
            onChange={setTransfer}
          />
          <DateRangePicker value={range} onChange={setRange} />
        </Stack>
        <Stack direction="horizontal" gap={3}>
          <Result status="success" title="已发布" description="版本 v1.0.0 已上线" />
          <Result
            status="error"
            title="发布失败"
            description="签名校验未通过"
            extra={<Button variant="primary">查看日志</Button>}
          />
        </Stack>
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="示例弹窗"
        footer={
          <Button variant="primary" onClick={() => setModal(false)}>
            确定
          </Button>
        }
      >
        模态内容：焦点陷阱、Escape、焦点归还均由 useFocusTrap 提供。
      </Modal>
      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="示例抽屉"
        footer={
          <Button onClick={() => setDrawer(false)}>关闭</Button>
        }
      >
        抽屉内容（与 Modal 共用焦点陷阱 hook）。
      </Drawer>
      <Tour
        open={tour}
        onClose={() => setTour(false)}
        steps={[
          { title: '欢迎', description: '这是组件演示页的引导。' },
          { title: '试试键盘', description: '所有可交互组件都支持键盘路径。' },
        ]}
      />

      <div>
        <Title level={2}>文件与进度</Title>
        <Stack direction="vertical" gap={3}>
          <Stack direction="horizontal" gap={3} wrap>
            <Button onClick={() => setFileDialog(true)}>打开文件对话框</Button>
            <Upload upload={async () => { /* 调用方实现：分片/断点 →《分片上传与断点续传方案》 */ }} accept=".md,.txt" />
            <GlobalProgressBar value={undefined} />
            <GlobalProgressBar value={72} />
          </Stack>
          <Stack direction="horizontal" gap={3} wrap>
            <Rate value={rate} onChange={setRate} />
            <CheckboxGroup
              values={tags}
              onChange={setTags}
              options={[
                { value: '设计', label: '设计' },
                { value: '前端', label: '前端' },
              ]}
            />
            <ToggleGroup
              values={[seg]}
              onChange={(v) => setSeg(v[0] ?? 'day')}
              options={[
                { value: 'day', label: '日' },
                { value: 'week', label: '周' },
              ]}
            />
          </Stack>
          <FormList
            fields={listFields}
            onChange={setListFields}
            createRow={() => ({ key: `f${Date.now()}` })}
            renderRow={(f, i) => (
              <Text>
                第 {i + 1} 项（{f.key.slice(0, 6)}）——移除按钮由 FormList 自带
              </Text>
            )}
          />
          <Countdown target={new Date(Date.now() + 3600_000)} />
          <CodeBlock language="ts" code={'const t = useDebouncedValue(query, 300);'} />
        </Stack>
      </div>
      <FileDialog
        open={fileDialog}
        onClose={() => setFileDialog(false)}
        mode="open"
        accept={['.md', '.txt']}
        entries={[
          { path: '/docs', isDir: true },
          { path: '/docs/readme.md', isDir: false, size: 2048 },
          { path: '/docs/api.txt', isDir: false, size: 512 },
          { path: '/img', isDir: true },
        ]}
        onSelect={({ path }) => toast.toast({ kind: 'success', message: `已选择 ${path}` })}
      />
      <BackTop />
      <NewComponentsSection />
      <Result status="empty" title="以上之外" description="未在本页演示的组件见 docs/COMPONENTS.md 组件卡。" />
    </div>
  );
}

/** 对外入口：ToastProvider 包裹（Toast 类组件依赖）。 */
export function UiDemo() {
  return (
    <ToastProvider>
      <DemoSections />
      <div hidden aria-hidden="true">
        <Spinner size="sm" />
        <Badge tone="neutral">覆盖</Badge>
        <Empty variant="no-network" />
        <Textarea />
        <SearchInput />
        <Slider value={0} onChange={() => {}} />
        <Select value="" onChange={() => {}} options={[]} />
        <Transfer options={[]} value={[]} onChange={() => {}} />
        <RadioGroup name="hidden" value="" onChange={() => {}} options={[]} />
        <Tabs items={[{ key: '1', label: '1' }]} />
        <Tooltip label="x">
          <span>x</span>
        </Tooltip>
        <Textarea />
        <Textarea rows={1} />
        <Divider />
        <Avatar />
        <Tag />
        <Kbd>x</Kbd>
        <Breadcrumb items={[]} />
      </div>
    </ToastProvider>
  );
}

/** 2026-11 批新增速览（完整交互演示见 playground /ui → :5183） */
function NewComponentsSection() {
  const [picked, setPicked] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null>(new Date(2026, 10, 1));
  return (
    <Card padding="md">
      <Title level={2}>多选 / 骨架 / 级联日期</Title>
      <Stack direction="vertical" gap={3}>
        <MultiSelect
          options={[{ value: 'a', label: '选项 A' }, { value: 'b', label: '选项 B' }, { value: 'c', label: '选项 C' }]}
          value={picked}
          onChange={setPicked}
        />
        <DatePicker picker="month" value={date} onChange={setDate} />
        <List header="列表">
          <ListItem title="条目一" description="描述" />
          <ListItem title="条目二" description="描述" />
        </List>
        <Stack direction="horizontal" gap={2}>
          <CheckableTag checked onChange={() => {}}>已选芯片</CheckableTag>
          <CheckableTag checked={false} onChange={() => {}}>未选芯片</CheckableTag>
        </Stack>
        <AppShell header="外壳" sider={<div>侧栏</div>} footer="状态栏">
          内容区
        </AppShell>
      </Stack>
    </Card>
  );
}
