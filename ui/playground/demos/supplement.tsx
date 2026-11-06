import { useState } from 'react';
import {
  Button, EditableText, EmojiPicker, FileDialog, Highlight, HoverCard, LinkedSelects, OfflineIndicator,
  PermissionGateOf, PermissionProvider, Stack, Text, TextInput,
  Tooltip, TreeSelect, useToast,
} from '../../index';

/* 补充组件实时演示（覆盖组件库全景中此前无独立入口的 7 个导出） */

export function DemoTreeSelect() {
  const [v, setV] = useState<string | undefined>(undefined);
  return (
    <div style={{ maxWidth: 240 }}>
      <TreeSelect
        data={[
          {
            key: 'src',
            label: 'src',
            children: [
              { key: 'src-ui', label: 'ui', children: [{ key: 'src-ui-lib', label: 'lib' }] },
              { key: 'src-app', label: 'app' },
            ],
          },
          { key: 'readme', label: 'README.md' },
        ]}
        value={v}
        onChange={setV}
        placeholder="选择目录或文件"
      />
      <Text type="secondary">已选：{v ?? '（未选）'}——点击展开/折叠，叶子可选</Text>
    </div>
  );
}

export function DemoHoverCard() {
  return (
    <Stack direction="horizontal" gap={3} align="center">
      <Tooltip label="这是 Tooltip，短提示">
        <Button size="sm">Tooltip</Button>
      </Tooltip>
      <HoverCard
        content={
          <div style={{ padding: 'var(--ui-space-3)' }}>
            <Text strong>HoverCard</Text>
            <br />
            <Text type="secondary">悬停显示的富内容卡片，Esc 关闭，支持键盘焦点。</Text>
          </div>
        }
      >
        <Button size="sm">悬停查看 HoverCard</Button>
      </HoverCard>
    </Stack>
  );
}

export function DemoLinkedSelects() {
  const [path, setPath] = useState<string[]>([]);
  return (
    <div>
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
          {
            value: 'gx',
            label: '广西',
            children: [{ value: 'nn', label: '南宁' }],
          },
        ]}
        value={path}
        onChange={setPath}
        placeholders={['省份', '城市']}
      />
      <Text type="secondary">路径：{path.length ? path.join(' / ') : '（未选）'}——与 Cascader 面板版同构可互换</Text>
    </div>
  );
}

export function DemoFileDialog() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'open' | 'save' | 'folder'>('open');
  const [selected, setSelected] = useState('（未选择）');
  const toast = useToast();
  const entries = [
    { path: '/docs', isDir: true },
    { path: '/docs/readme.md', isDir: false, size: 2048 },
    { path: '/docs/api.txt', isDir: false, size: 512 },
    { path: '/src', isDir: true },
    { path: '/src/main.go', isDir: false, size: 10240 },
    { path: '/img', isDir: true },
    { path: '/img/logo.png', isDir: false, size: 8192 },
  ];
  return (
    <div>
      <Stack direction="horizontal" gap={2}>
        <Button size="sm" onClick={() => { setMode('open'); setOpen(true); }}>打开文件</Button>
        <Button size="sm" onClick={() => { setMode('save'); setOpen(true); }}>保存文件</Button>
        <Button size="sm" onClick={() => { setMode('folder'); setOpen(true); }}>选择文件夹</Button>
      </Stack>
      <Text type="secondary">已选：{selected}</Text>
      <FileDialog
        open={open}
        onClose={() => setOpen(false)}
        mode={mode}
        entries={entries}
        defaultName="new-file.md"
        accept={['.md', '.txt']}
        onSelect={({ path }) => {
          setSelected(path);
          toast.toast({ kind: 'success', message: `已选择 ${path}` });
        }}
      />
    </div>
  );
}

export function DemoCommandHint() {
  return (
    <div>
      <Text>CommandHint 用于命令面板中的快捷键提示（→ CommandPalette demo 间接展示）。</Text>
    </div>
  );
}

export function DemoFileDialogNav() {
  return (
    <div>
      <Text>FileDialogNav 是 FileDialog 内部的面包屑导航（→ FileDialog demo 中的面包屑区域）。</Text>
    </div>
  );
}

export function DemoOrgSelectorFooter() {
  return (
    <div>
      <Text>OrgSelectorFooter 是 OrgSelector 的底部操作区（→ 业务组件 demo 的 OrgSelector）。</Text>
    </div>
  );
}

export function DemoHighlight() {
  const [q, setQ] = useState('令牌');
  return (
    <div style={{ maxWidth: 420 }}>
      <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="输入高亮词（如：令牌）" />
      <Text>
        <Highlight text="设计令牌是唯一色彩来源；组件样式只引用设计令牌，禁止裸值。" query={q} />
      </Text>
      <Text type="secondary">命中段用 &lt;mark&gt; 语义标签；Fragment 切段实现，无 innerHTML（免疫 XSS）</Text>
    </div>
  );
}

export function DemoEmojiPicker() {
  const [picked, setPicked] = useState<string[]>([]);
  return (
    <div>
      <Stack direction="horizontal" gap={2} align="center">
        <EmojiPicker onPick={(e) => setPicked((p) => [...p, e])} />
        <Text>已插入：{picked.join(' ') || '（无）'}</Text>
      </Stack>
      <Text type="secondary">分类页签 + 中英文关键词搜索 + 最近使用（localStorage）；Esc/点外关闭</Text>
    </div>
  );
}

export function DemoEditableText() {
  const [title, setTitle] = useState('发布计划 v2');
  const [bio, setBio] = useState('');
  return (
    <Stack direction="vertical" gap={3}>
      <div>
        <EditableText
          value={title}
          onChange={setTitle}
          validate={(v) => (v.trim().length < 2 ? '至少 2 个字符' : null)}
        />
        <Text type="secondary">点击编辑；Enter 提交（IME 组合态不提交）、Esc 取消、失焦提交；校验失败不退出</Text>
      </div>
      <div>
        <EditableText value={bio} onChange={setBio} multiline placeholder="点击填写简介（多行）" />
        <Text type="secondary">多行模式：Enter 换行不提交，Esc 取消</Text>
      </div>
    </Stack>
  );
}

export function DemoOfflineIndicator() {
  return (
    <div>
      <OfflineIndicator />
      <Text type="secondary">底部横幅由 online/offline 事件驱动：离线常驻；恢复后短暂提示自动隐藏。Wails WebView 下的事件可靠性标「待验证」</Text>
    </div>
  );
}

export function DemoPermissionGate() {
  // 只授予 post:read——下面三个门各自的权限键都未授予，完整展示三种无权限策略
  return (
    <PermissionProvider permissions={['post:read']}>
      <Stack direction="vertical" gap={3}>
        <Stack direction="horizontal" gap={2} align="center">
          <PermissionGateOf permission="comment:write" strategy="disable" reason="无评论权限">
            <Button size="sm">发表评论</Button>
          </PermissionGateOf>
          <Text type="secondary">disable：可见不可用，点击被拦截，title 显示原因</Text>
        </Stack>
        <Stack direction="horizontal" gap={2} align="center">
          <PermissionGateOf permission="admin:export" strategy="replace" fallback={<Text type="secondary">（需要管理员权限）</Text>}>
            <Button size="sm" variant="primary">导出全部数据</Button>
          </PermissionGateOf>
          <Text type="secondary">replace：渲染替代节点</Text>
        </Stack>
        <Stack direction="horizontal" gap={2} align="center">
          <PermissionGateOf permission="admin:delete" strategy="hide">
            <Button size="sm" variant="danger">永久删除项目</Button>
          </PermissionGateOf>
          <Text type="secondary">hide：不渲染（上面这颗按钮看不到）</Text>
        </Stack>
      </Stack>
    </PermissionProvider>
  );
}
