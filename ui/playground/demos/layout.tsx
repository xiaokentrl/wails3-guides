import { useState } from 'react';
import { Button } from '../../components/Button.tsx';
import { Card } from '../../components/Card.tsx';
import { Divider } from '../../components/Divider.tsx';
import { AspectRatio, Center, Container, Grid, Stack, Sticky } from '../../components/Layout.tsx';
import { Masonry } from '../../components/Masonry.tsx';
import { ScrollArea } from '../../components/ScrollArea.tsx';
import { Splitter } from '../../components/Splitter.tsx';
import { Text, Title } from '../../components/Text.tsx';
import { VirtualList } from '../../components/VirtualList.tsx';
import { VirtualizedTree } from '../../components/VirtualizedTree.tsx';
import { AppShell } from '../../components/AppShell.tsx';
import { ZoomableContainer } from '../../components/ZoomableContainer.tsx';
import { useBreakpoint } from '../../lib/media.ts';

/* 布局组件实时演示（→ 规划表「二、布局」） */

/** 演示页通用样式盒 */
export function DemoBox({ children }: { children: React.ReactNode }) {
  return <div className="ui-demo-box">{children}</div>;
}

export function DemoCardStack() {
  const [gap, setGap] = useState<1 | 2 | 3 | 4 | 5>(3);
  return (
    <div>
      <Stack direction="horizontal" gap={2}>
        <Text type="secondary">Stack gap：</Text>
        {[1, 2, 3, 4, 5].map((g) => (
          <Button key={g} size="sm" variant={gap === g ? 'primary' : 'secondary'} onClick={() => setGap(g as 1 | 2 | 3 | 4 | 5)}>
            {g}
          </Button>
        ))}
      </Stack>
      <Stack direction="horizontal" gap={gap}>
        <Card padding="sm">卡片 A</Card>
        <Card padding="sm">卡片 B</Card>
        <Card padding="sm">卡片 C</Card>
      </Stack>
    </div>
  );
}

export function DemoGrid() {
  const bp = useBreakpoint();
  const cols = bp === 'base' ? '1fr' : bp === 'sm' ? '1fr 1fr' : '1fr 1fr 1fr';
  return (
    <div>
      <Text type="secondary">当前断点：{bp} → {cols}</Text>
      <Grid columns={cols}>
        <Card padding="sm">格子 1</Card>
        <Card padding="sm">格子 2</Card>
        <Card padding="sm">格子 3</Card>
        <Card padding="sm">格子 4</Card>
      </Grid>
    </div>
  );
}

export function DemoContainer() {
  return (
    <div style={{ background: 'var(--ui-bg)', padding: 8 }}>
      <Container>
        <Card padding="sm">
          <Text type="secondary">Container：max-width 1200 居中（当前视口下看两侧留白）</Text>
        </Card>
      </Container>
    </div>
  );
}

export function DemoScrollArea() {
  return (
    <ScrollArea maxHeight={160}>
      {Array.from({ length: 20 }, (_, i) => (
        <Text key={i}>滚动行 {i + 1}——滚动条为跨引擎统一令牌化外观</Text>
      ))}
    </ScrollArea>
  );
}

export function DemoSplitter() {
  const [percent, setPercent] = useState(40);
  return (
    <div style={{ height: 220 }}>
      <Splitter
        direction="horizontal"
        percent={percent}
        onResize={setPercent}
        min={20}
        max={80}
        first={
          <Card padding="sm">
            <Text>左面板 {Math.round(percent)}%</Text>
          </Card>
        }
        second={
          <Card padding="sm">
            <Text>右面板 {100 - Math.round(percent)}%</Text>
          </Card>
        }
      />
      <Text type="secondary">拖拽分隔条，或聚焦分隔条后用方向键 ±2（Shift=5）。持久化接状态方案。</Text>
    </div>
  );
}

export function DemoMasonry() {
  return (
    <Stack direction="vertical" gap={3}>
      <div>
        <Text strong>计数均衡版（默认）</Text>
        <Masonry columns={3}>
          {[120, 80, 160, 100, 140, 90, 130, 110].map((h, i) => (
            <Card key={i} padding="sm">
              <div style={{ height: h / 3, display: 'flex', alignItems: 'center' }}>
                <Text>瀑布流卡片 {i + 1}</Text>
              </div>
            </Card>
          ))}
        </Masonry>
      </div>
      <div>
        <Text strong>测量版（measured：ResizeObserver 实测 + 最短列定位，高度差异大时用）</Text>
        <Masonry columns={3} measured>
          {[40, 160, 90, 200, 60, 130, 100, 180, 70, 150, 85, 120].map((h, i) => (
            <Card key={i} padding="sm">
              <div style={{ height: h / 3, display: 'flex', alignItems: 'center' }}>
                <Text>高度差异卡片 {i + 1}</Text>
              </div>
            </Card>
          ))}
        </Masonry>
      </div>
    </Stack>
  );
}

export function DemoStickyCenterAspect() {
  return (
    <Stack direction="vertical" gap={3}>
      <div style={{ height: 180, overflow: 'auto', border: '1px solid var(--ui-border)', borderRadius: 8 }}>
        <Sticky top={0}>
          <div style={{ background: 'var(--ui-primary-soft)', padding: 'var(--ui-space-2) var(--ui-space-3)' }}>
            <Text type="secondary">Sticky 吸顶头（在上方滚动容器内试试）</Text>
          </div>
        </Sticky>
        {Array.from({ length: 12 }, (_, i) => (
          <Text key={i}>滚动内容 {i + 1}</Text>
        ))}
      </div>
      <Center className="ui-demo-box">
        <Text>Center 居中</Text>
      </Center>
      <AspectRatio ratio={16 / 9} className="ui-demo-box">
        <Center className="ui-demo-box">
          <Text>AspectRatio 16:9</Text>
        </Center>
      </AspectRatio>
    </Stack>
  );
}

export function DemoZoomable() {
  return (
    <div style={{ height: 260 }}>
      <ZoomableContainer min={0.4} max={3}>
        <Card padding="lg">
          <Title level={3}>可缩放内容</Title>
          <Text>Ctrl/⌘ + 滚轮缩放（以光标为锚点）</Text>
          <br />
          <Text>双指捏合缩放 · 拖拽平移 · 双击重置</Text>
        </Card>
      </ZoomableContainer>
    </div>
  );
}

export function DemoVirtualList() {
  const rows = Array.from({ length: 5000 }, (_, i) => `虚拟行 ${i + 1}`);
  return (
    <div>
      <Text type="secondary">5000 行固定行高虚拟列表——只渲染可视窗口（→ 性能方案）</Text>
      <VirtualList
        items={rows}
        rowHeight={32}
        height={200}
        render={(row) => (
          <div style={{ padding: '0 12px', lineHeight: '32px' }}>{row}</div>
        )}
      />
    </div>
  );
}

/* 页内小节分隔（Playground 按组件粒度展示，此组件用于布局类开头总览） */
export function DemoVirtualizedTree() {
  const [selected, setSelected] = useState<string | null>(null);
  // 3000 个节点 × 3 层：虚拟化在万级才见价值，此处演示规模减半保流畅
  const data = Array.from({ length: 30 }, (_, s) => ({
    key: `s${s}`,
    label: `分区 ${s + 1}`,
    children: Array.from({ length: 100 }, (_, f) => ({
      key: `s${s}-f${f}`,
      label: `文件夹 ${s + 1}-${f + 1}`,
      children:
        f % 10 === 0
          ? Array.from({ length: 3 }, (_, d) => ({ key: `s${s}-f${f}-d${d}`, label: `文档 ${s + 1}-${f + 1}-${d + 1}` }))
          : undefined,
    })),
  }));
  return (
    <div>
      <Text type="secondary">3000+ 节点虚拟化树：折叠子树不进列表，只渲染可视窗口；容器持焦点（activedescendant 模式）</Text>
      <VirtualizedTree data={data} height={240} defaultExpanded={['s0', 's0-f0']} selectedKey={selected ?? undefined} onSelect={setSelected} />
      <Text type="secondary">已选：{selected ?? '（未选）'}——↑↓ 移动、→ 展开、← 折叠/回父级、Enter 选中</Text>
    </div>
  );
}

export function DemoAppShell() {
  const navItems = ['总览', '项目', '任务', '设置'];
  return (
    <AppShell
      collapsible
      header={<strong>桌面应用外壳</strong>}
      sider={
        <div style={{ padding: 'var(--ui-space-2)' }}>
          {navItems.map((t) => (
            <div key={t} style={{ padding: '6px 8px', borderRadius: 6, color: 'var(--ui-text)', whiteSpace: 'nowrap' }}>
              {t}
            </div>
          ))}
        </div>
      }
      footer={<span>就绪 · v1.1.0</span>}
    >
      <Text>主内容区——Header/Sider/Footer 由 AppShell 编排，折叠把手内建（collapsible）。</Text>
      <Text type="secondary">只管布局，不管路由/菜单数据（→ 菜单方案、前端目录结构方案 AppShell 形态）。</Text>
    </AppShell>
  );
}

export function DemoLayoutOverview() {
  return (
    <div>
      <Title level={2}>布局</Title>
      <Divider />
      <Text type="secondary">左侧选择具体组件查看实时演示。</Text>
      <DemoBox>
        <DemoGrid />
      </DemoBox>
    </div>
  );
}
