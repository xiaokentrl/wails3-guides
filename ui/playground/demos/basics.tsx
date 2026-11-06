import { useState } from 'react';
import { Avatar, AvatarGroup } from '../../components/Avatar.tsx';
import { CheckableTag } from '../../components/Tag.tsx';
import { Badge } from '../../components/Badge.tsx';
import { Button } from '../../components/Button.tsx';
import { CopyToClipboard } from '../../components/CopyToClipboard.tsx';
import { CountUp } from '../../components/CountUp.tsx';
import { Divider } from '../../components/Divider.tsx';
import { Icon, registerIcon } from '../../components/Icon.tsx';
import { Kbd, VisuallyHidden } from '../../components/Kbd.tsx';
import { Stack } from '../../components/Layout.tsx';
import { Link } from '../../components/Link.tsx';
import { Spinner } from '../../components/Spinner.tsx';
import { Tag } from '../../components/Tag.tsx';
import { Text, Title } from '../../components/Text.tsx';
import { TextEllipsis } from '../../components/TextEllipsis.tsx';

/* 基础组件实时演示——每项均带状态与交互（→ 组件导航提前规划表「一、基础」） */

export function DemoTitleText() {
  return (
    <div>
      <Title level={1}>一级标题</Title>
      <Title level={2}>二级标题</Title>
      <Text>正文文本，line-height 1.6。</Text>
      <Text type="secondary">次要文本</Text>
      <Text type="danger" strong>危险强调</Text>
    </div>
  );
}

export function DemoLink() {
  return (
    <div>
      <Link href="#" onClick={(e) => e.preventDefault()}>内部链接（阻止跳转演示）</Link>
      <br />
      <Link href="https://wails.io" target="_blank" rel="noopener noreferrer">外部链接（白名单由调用方裁决 → 安全方案）</Link>
    </div>
  );
}

export function DemoKbd() {
  return (
    <Text>
      按下 <Kbd>Mod</Kbd> + <Kbd>K</Kbd> 打开命令面板，<Kbd>Esc</Kbd> 关闭。
      <VisuallyHidden>（视觉隐藏文本：读屏用户可见此句）</VisuallyHidden>
    </Text>
  );
}

export function DemoTextEllipsis() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <TextEllipsis maxWidth={220} fullText="这是一段很长很长会被截断的文本，悬停查看完整内容">
        这是一段很长很长会被截断的文本，悬停查看完整内容
      </TextEllipsis>
      <TextEllipsis maxWidth={220}>短文本不截断</TextEllipsis>
    </div>
  );
}

export function DemoTag() {
  const [tags, setTags] = useState(['设计', '前端']);
  return (
    <Stack direction="horizontal" gap={2}>
      {tags.map((t) => (
        <Tag key={t} closable onClose={() => setTags(tags.filter((x) => x !== t))}>
          {t}
        </Tag>
      ))}
      <Tag tone="primary">主色标签</Tag>
      {tags.length === 0 && (
        <Button size="sm" onClick={() => setTags(['设计', '前端'])}>
          重置
        </Button>
      )}
    </Stack>
  );
}

export function DemoAvatar() {
  return (
    <Stack direction="horizontal" gap={3} align="center">
      <Avatar fallback="单" size="sm" />
      <Avatar fallback="双" size="md" />
      <Avatar
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='%232f6fed'/%3E%3C/svg%3E"
        alt="示例"
        size="lg"
      />
      <AvatarGroup max={2}>
        <Avatar fallback="甲" />
        <Avatar fallback="乙" />
        <Avatar fallback="丙" />
      </AvatarGroup>
    </Stack>
  );
}

export function DemoDivider() {
  return (
    <div>
      <Text>上方内容</Text>
      <Divider />
      <Text>无标签分隔线</Text>
      <Divider label="带标签" />
      <Text>下方内容</Text>
    </div>
  );
}

export function DemoIcon() {
  return (
    <Stack direction="horizontal" gap={3} align="center">
      <Icon name="star" size={20} />
      <Icon name="search" size={20} />
      <Icon name="calendar" size={20} />
      <Icon name="settings" size={20} />
      <Button
        size="sm"
        onClick={() =>
          registerIcon(
            'demo-heart',
            <path d="M12 21s-7-4.6-9.5-8.5C.5 9 2.5 5 6 5c2 0 3.5 1 4 2.5C10.5 6 12 5 14 5c3.5 0 5.5 4 3.5 7.5C19 16.4 12 21 12 21z" />,
          )
        }
      >
        注册 demo-heart
      </Button>
      <Icon name="demo-heart" size={20} />
    </Stack>
  );
}

export function DemoCopyToClipboard() {
  return (
    <CopyToClipboard text="来自组件导航的文本">
      <Button size="sm">复制这段文本</Button>
    </CopyToClipboard>
  );
}

export function DemoCountUp() {
  const [value, setValue] = useState(128420);
  return (
    <Stack direction="horizontal" gap={3} align="center">
      <CountUp value={value} duration={1000} />
      <Button size="sm" onClick={() => setValue(Math.floor(Math.random() * 500000))}>
        随机变化
      </Button>
    </Stack>
  );
}

export function DemoBadge() {
  return (
    <Stack direction="horizontal" gap={2}>
      <Badge>中性</Badge>
      <Badge tone="primary">主色</Badge>
      <Badge tone="success">成功</Badge>
      <Badge tone="warning">警告</Badge>
      <Badge tone="danger">危险</Badge>
    </Stack>
  );
}

export function DemoSpinner() {
  return (
    <Stack direction="horizontal" gap={3} align="center">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="md" label="导出中" />
    </Stack>
  );
}

export function DemoCheckableTag() {
  const [picked, setPicked] = useState<string[]>(['前端']);
  const tags = ['前端', '后端', '运维', '设计'];
  return (
    <Stack direction="horizontal" gap={2} align="center">
      {tags.map((t) => (
        <CheckableTag key={t} checked={picked.includes(t)} onChange={(c) => setPicked((p) => (c ? [...p, t] : p.filter((x) => x !== t)))}>
          {t}
        </CheckableTag>
      ))}
      <Text type="secondary">已选：{picked.join('、') || '（无）'}——aria-pressed 表达勾选态</Text>
    </Stack>
  );
}
