import { useState } from 'react';
import { Badge, BadgeRibbon } from '../../components/Badge.tsx';
import { Button } from '../../components/Button.tsx';
import { Calendar } from '../../components/Calendar.tsx';
import { Card, CardMeta } from '../../components/Card.tsx';
import { CodeBlock } from '../../components/CodeBlock.tsx';
import { Countdown } from '../../components/Countdown.tsx';
import { Collapse, Descriptions, EditableCell, Empty, Progress, Skeleton, Statistic, Table, Timeline } from '../../components/Data.tsx';
import { Gauge } from '../../components/Gauge.tsx';
import { Heatmap } from '../../components/Heatmap.tsx';
import { Comment } from '../../components/Comment.tsx';
import { Image } from '../../components/Image.tsx';
import { Grid, Stack } from '../../components/Layout.tsx';
import { List, ListItem } from '../../components/List.tsx';
import { Popselect } from '../../components/Popselect.tsx';
import { Text, Title } from '../../components/Text.tsx';
import { Thing, GradientText } from '../../components/Thing.tsx';
import { Time } from '../../components/Time.tsx';
import { exportCsv } from '../../lib/download.ts';
import { Tree } from '../../components/Tree.tsx';

/* 数据展示组件实时演示（→ 规划表「五、数据展示」） */

const TABLE_ROWS = [
  { name: '组件导航.md', owner: '甲', size: 2048 },
  { name: '组件库全景.md', owner: '乙', size: 51200 },
  { name: '令牌设计.md', owner: '甲', size: 4096 },
];

export function DemoTable() {
  const [cells, setCells] = useState<Record<string, string>>({});
  return (
    <Table
      columns={[
        {
          key: 'name',
          title: '文件名',
          sorter: (a, b) => String(a.name).localeCompare(String(b.name)),
        },
        {
          key: 'owner',
          title: '负责人',
          render: (row) => {
            const key = `${row.name}:owner`;
            return (
              <EditableCell
                value={cells[key] ?? String(row.owner)}
                onCommit={(v) => setCells((prev) => ({ ...prev, [key]: v }))}
              />
            );
          },
        },
        {
          key: 'size',
          title: '大小',
          align: 'right',
          sorter: (a, b) => Number(a.size) - Number(b.size),
        },
      ]}
      rows={TABLE_ROWS}
      rowKey={(r) => String(r.name)}
      empty="暂无文件"
    />
  );
}

export function DemoDescriptions() {
  return (
    <Descriptions
      items={[
        { label: '版本', value: 'v1.0.0' },
        { label: '构建号', value: '20261105.1' },
        { label: '通道', value: 'beta' },
      ]}
    />
  );
}

export function DemoProgressSkeleton() {
  return (
    <Stack direction="vertical" gap={3}>
      <Progress value={72} label="上传" />
      <Progress value={45} kind="ring" label="处理中" />
      <Skeleton width="80%" />
      <Skeleton width="60%" />
      <Skeleton width="40%" height={48} />
    </Stack>
  );
}

export function DemoEmptyVariants() {
  return (
    <Grid columns="repeat(2, 1fr)">
      <Empty variant="no-data" description="暂无数据" />
      <Empty
        variant="no-permission"
        description="没有访问权限"
        action={
          <Button size="sm">申请权限</Button>
        }
      />
      <Empty variant="no-network" description="网络不可用，请检查连接" />
      <Empty
        variant="no-result"
        description="没有匹配的结果"
        action={
          <Button size="sm" variant="ghost">
            清除筛选
          </Button>
        }
      />
    </Grid>
  );
}

export function DemoTimelineCollapse() {
  return (
    <Stack direction="vertical" gap={3}>
      <Timeline
        items={[
          { title: 'v1.0.0 发布', description: '指南库成型：33 份专题', time: '2026-11-04' },
          { title: '组件库首批', description: '12 个组件', time: '2026-11-05' },
          { title: '通用层全覆盖', description: '105 个导出', time: '2026-11-05' },
        ]}
      />
      <Collapse
        items={[
          { key: '1', title: '什么是组件卡？', content: '组件的 API/状态/无障碍登记，入库四件套之一。' },
          { key: '2', title: '什么是三次规则？', content: '第 1 次不抽象、第 2 次复制、第 3 次强制提取。' },
        ]}
      />
    </Stack>
  );
}

export function DemoStatisticCountdown() {
  const [target] = useState(() => new Date(Date.now() + 7200_000));
  return (
    <Grid columns="repeat(3, 1fr)">
      <Statistic title="今日请求" value={128420} />
      <Statistic title="构建倒计时" value={<Countdown target={target} />} />
      <Statistic title="完成率" value={98.6} suffix="%" />
    </Grid>
  );
}

export function DemoCalendarHeatmapGauge() {
  const heat = Array.from({ length: 35 }, (_, i) => ({
    date: `2026-10-${String(i + 1).padStart(2, '0')}`,
    count: Math.floor(Math.abs(Math.sin(i)) * 20),
  }));
  return (
    <Grid columns="repeat(3, 1fr)">
      <Calendar initialView={new Date(2026, 10, 1)} />
      <Heatmap data={heat} tooltip={(d) => `${d.date}：${d.count} 次`} />
      <Gauge value={76} label="本月进度" />
    </Grid>
  );
}

export function DemoCodeImage() {
  return (
    <Grid columns="1fr 1fr">
      <CodeBlock
        language="ts"
        code={`const tokens = defineTokens({
  primary: '#2f6fed',
  radius: '8px',
});`}
      />
      <Image
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='140'%3E%3Crect width='240' height='140' fill='%23e8effd'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%232f6fed' font-size='14'%3EImage 组件%3C/text%3E%3C/svg%3E"
        alt="示例图"
        rounded="lg"
      />
    </Grid>
  );
}

export function DemoTreeComment() {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div>
      <Tree
        data={[
          {
            key: 'src',
            label: 'src',
            children: [
              { key: 'src/ui', label: 'ui', children: [{ key: 'src/ui/lib', label: 'lib' }] },
              { key: 'src/app', label: 'app' },
            ],
          },
          { key: 'readme', label: 'README.md' },
        ]}
        defaultExpanded={['src']}
        selectedKey={sel ?? undefined}
        onSelect={(k) => setSel(k ?? null)}
      />
      <Text type="secondary">选中：{sel ?? '（未选）'}</Text>
      <Comment
        author="甲"
        time="10:24"
        actions={
          <Button size="sm" variant="ghost">
            回复
          </Button>
        }
      >
        组件卡的待验证项要在项目期定案。
      </Comment>
    </div>
  );
}

export function DemoDisplayOverview() {
  return (
    <div>
      <Title level={2}>数据展示</Title>
      <Text type="secondary">左侧选择具体组件查看实时演示。</Text>
      <Stack direction="horizontal" gap={2}>
        <Badge>展示</Badge>
        <Badge tone="primary">演示</Badge>
      </Stack>
    </div>
  );
}

export function DemoList() {
  return (
    <List
      header="导出任务"
      footer={<Text type="secondary">共 3 项</Text>}
    >
      <ListItem
        prefix={<Badge tone="success">完成</Badge>}
        title="report.pdf"
        description="2026-11-06 14:02 · 2.4 MB"
        actions={<Button size="sm" variant="ghost">下载</Button>}
      />
      <ListItem
        prefix={<Badge tone="primary">进行中</Badge>}
        title="全量数据导出"
        description="已完成 62%"
      />
      <ListItem
        prefix={<Badge tone="danger">失败</Badge>}
        title="加密附件导出"
        description="密钥未配置"
      />
    </List>
  );
}

export function DemoThingGradient() {
  return (
    <Stack direction="vertical" gap={3}>
      <Thing
        avatar={<span style={{ fontSize: 24 }}>🛠️</span>}
        title="构建完成"
        description={<Time value={Date.now() - 5 * 60_000} autoRefreshMs={30_000} />}
        actions={<Button size="sm" variant="ghost">查看日志</Button>}
      >
        <Text>main 分支构建耗时 42s，测试 128/128 通过。</Text>
      </Thing>
      <Thing
        avatar={<span style={{ fontSize: 24 }}>📦</span>}
        title="依赖更新可用"
        description={<Time value={Date.now() - 3 * 3_600_000} />}
      >
        <Text type="secondary">vite 5.4 → 6.0（含 breaking changes）</Text>
      </Thing>
      <div>
        <GradientText colors={['var(--ui-primary)', 'var(--ui-success)', 'var(--ui-warning)']}>
          渐变标题文字
        </GradientText>
        <Text type="secondary">—— GradientText：颜色数组走 linear-gradient + background-clip:text</Text>
      </div>
    </Stack>
  );
}

export function DemoPopselect() {
  const [density, setDensity] = useState('舒适');
  return (
    <Popselect
      trigger={<Button size="sm">密度：{density} ▾</Button>}
      options={[
        { value: '紧凑', label: '紧凑' },
        { value: '舒适', label: '舒适' },
        { value: '宽松', label: '宽松' },
      ]}
      value={density}
      onChange={setDensity}
    />
  );
}

export function DemoCardMetaRibbon() {
  return (
    <Grid columns="repeat(2, 1fr)">
      <Card padding="none" style={{ overflow: 'hidden' }}>
        <CardMeta
          cover={<div style={{ background: 'linear-gradient(120deg, var(--ui-primary), var(--ui-success))' }} />}
          title="设计令牌手册"
          description="三层色彩系统 · 组件卡 · 命名规范"
          actions={<Button size="sm">打开</Button>}
        />
      </Card>
      <div>
        <BadgeRibbon text="热门" color="var(--ui-danger)">
          <Card padding="md">
            <Text strong>多端同步方案</Text>
            <Text type="secondary">跨设备冲突裁决全链路</Text>
          </Card>
        </BadgeRibbon>
        <Text type="secondary">Ribbon 文案同步进 aria-label（颜色第二通道纪律）</Text>
      </div>
    </Grid>
  );
}

export function DemoTableScroll() {
  const rows = Array.from({ length: 30 }, (_, i) => ({ id: `row-${i + 1}`, name: `记录 ${i + 1}`, owner: i % 2 ? '甲' : '乙', size: (i + 1) * 128 }));
  return (
    <div>
      <Table
        columns={[
          { key: 'name', title: '名称', width: 220 },
          { key: 'owner', title: '负责人' },
          { key: 'size', title: '大小', align: 'right' },
        ]}
        rows={rows}
        rowKey={(r) => r.id}
        scrollY={200}
      />
      <Text type="secondary">scrollY=200：表体容器内滚动、表头 sticky 吸顶；scrollX 可配横向最小宽</Text>
    </div>
  );
}

export function DemoTableGrid() {
  const [selected, setSelected] = useState<string[]>([]);
  const rows = Array.from({ length: 2000 }, (_, i) => ({
    id: `r${i + 1}`,
    name: `文件 ${i + 1}`,
    owner: i % 2 ? '甲' : '乙',
    size: (i + 1) * 37,
    note: `备注内容 ${i + 1}（展开可见）`,
  }));
  return (
    <div>
      <Stack direction="horizontal" gap={2} align="center">
        <Button
          size="sm"
          onClick={() => exportCsv('文件清单', ['名称', '负责人', '大小'], rows.map((r) => [r.name, r.owner, r.size]))}
        >
          导出 CSV
        </Button>
        <Text type="secondary">已选 {selected.length} 行 · 虚拟 2000 行 · 名称列固定 · 「元信息」分组表头（负责人带筛选/大小可排序）· 表头右缘拖拽调宽</Text>
      </Stack>
      <Table
        columns={[
          { key: 'name', title: '名称', width: 200, fixed: 'left' },
          {
            key: 'meta',
            title: '元信息',
            children: [
              { key: 'owner', title: '负责人', width: 110, filters: [{ text: '甲', value: '甲' }, { text: '乙', value: '乙' }], onFilter: (v: string, r: { owner: string }) => r.owner === v },
              { key: 'size', title: '大小', align: 'right', sorter: (a: { size: number }, b: { size: number }) => a.size - b.size },
            ],
          },
        ]}
        rows={rows}
        rowKey={(r) => r.id}
        selection={{ selected, onChange: setSelected }}
        expandable={(r) => <Text type="secondary">{r.note}</Text>}
        summary={(rs) => [undefined, undefined, '合计', undefined, `${rs.length} 项`]}
        scrollY={260}
        scrollX={520}
        virtual={{ rowHeight: 36 }}
        resizable
      />
    </div>
  );
}
