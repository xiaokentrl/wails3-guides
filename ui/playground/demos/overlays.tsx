import { useState } from 'react';
import { Button } from '../../components/Button.tsx';
import { Card } from '../../components/Card.tsx';
import { CommandPalette } from '../../components/CommandPalette.tsx';
import { Drawer } from '../../components/Drawer.tsx';
import { Image } from '../../components/Image.tsx';
import { Grid, Stack } from '../../components/Layout.tsx';
import { Lightbox } from '../../components/Lightbox.tsx';
import { Popover } from '../../components/Popover.tsx';
import { Text, Title } from '../../components/Text.tsx';
import { Tooltip } from '../../components/Tooltip.tsx';
import { Tour } from '../../components/Tour.tsx';

/* 浮层组件实时演示（→ 规划表「七、浮层」）。CommandPalette 由外壳 ⌘K 触发，此处为内嵌版。 */

export function DemoPopover() {
  return (
    <Stack direction="horizontal" gap={3} align="center">
      <Popover trigger={<Button>点击弹出</Button>}>
        <div style={{ maxWidth: 220 }}>
          <Text>Popover 内容：light dismiss（点外即关）、Escape 关闭、视口空间不足自动翻转。</Text>
        </div>
      </Popover>
      <Tooltip label="Tooltip 提示文本">
        <Button>悬停我</Button>
      </Tooltip>
    </Stack>
  );
}

export function DemoLightbox() {
  const images = [
    {
      src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect width='400' height='260' fill='%232f6fed'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='white' font-size='18'%3E第 1 张%3C/text%3E%3C/svg%3E",
      caption: '封面',
    },
    {
      src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect width='400' height='260' fill='%232e8a4f'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='white' font-size='18'%3E第 2 张%3C/text%3E%3C/svg%3E",
      caption: '图表页',
    },
    {
      src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260'%3E%3Crect width='400' height='260' fill='%23d64545'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='white' font-size='18'%3E第 3 张%3C/text%3E%3C/svg%3E",
      caption: '错误态设计',
    },
  ];
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Grid columns="repeat(3, 1fr)">
        {images.map((img, i) => (
          <Image key={i} src={img.src} alt={img.caption ?? ''} rounded="md" />
        ))}
      </Grid>
      <Button size="sm" onClick={() => setOpen(true)}>
        打开灯箱（{images.length} 张，方向键切换）
      </Button>
      {open && <Lightbox images={images} index={index} onIndexChange={setIndex} onClose={() => setOpen(false)} />}
    </div>
  );
}

export function DemoCommandPalette() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>打开命令面板（内嵌版）</Button>
      <Text type="secondary">应用级入口由外壳 ⌘K 注册（→ 菜单方案命令注册表）。</Text>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={[
          { id: 'nav-basics', title: '导航到：基础组件', run: () => {} },
          { id: 'nav-inputs', title: '导航到：数据录入', run: () => {} },
          { id: 'toggle-dark', title: '切换深色主题', run: () => {} },
          { id: 'copy-tokens', title: '复制设计令牌', run: () => {} },
        ]}
      />
    </div>
  );
}

export function DemoDrawerTour() {
  const [drawer, setDrawer] = useState(false);
  const [tour, setTour] = useState(false);
  return (
    <div>
      <Stack direction="horizontal" gap={2}>
        <Button onClick={() => setDrawer(true)}>打开抽屉</Button>
        <Button variant="ghost" onClick={() => setTour(true)}>
          播放引导（2 步）
        </Button>
      </Stack>
      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="详情抽屉"
        footer={
          <Button variant="primary" onClick={() => setDrawer(false)}>
            完成
          </Button>
        }
      >
        <Text>抽屉承载复杂内容：与 Modal 共用焦点陷阱 hook，与弹框栈共存。</Text>
      </Drawer>
      <Tour
        open={tour}
        onClose={() => setTour(false)}
        steps={[
          { title: '第一步', description: 'Tour 定位目标元素或居中呈现，Esc/跳过可退。' },
          { title: '第二步', description: '引导完成后不再出现（由调用方持久化 → 状态方案）。' },
        ]}
      />
    </div>
  );
}

export function DemoOverlaysOverview() {
  return (
    <div>
      <Title level={2}>浮层</Title>
      <Text type="secondary">左侧选择具体组件查看实时演示。</Text>
      <Card padding="sm">
        <Text type="secondary">弹框打断阶梯：Tooltip（零）→ Popover（轻）→ Popconfirm（中）→ Modal/Drawer（高）——选型 → 操作反馈方案。</Text>
      </Card>
    </div>
  );
}
