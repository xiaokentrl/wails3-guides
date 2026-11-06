import { useState } from 'react';
import { BackTop } from '../../components/BackTop.tsx';
import { Button } from '../../components/Button.tsx';
import { Stack } from '../../components/Layout.tsx';
import { ContextMenu, DropdownMenu } from '../../components/Menu.tsx';
import { NavMenu } from '../../components/NavMenu.tsx';
import { Breadcrumb, Pagination, SegmentedControl, Steps, Tabs } from '../../components/Nav.tsx';
import { Text, Title } from '../../components/Text.tsx';
import { ToggleGroup } from '../../components/ToggleGroup.tsx';
import { TreeMenu } from '../../components/TreeMenu.tsx';

/* 导航组件实时演示（→ 规划表「三、导航」） */

export function DemoTabs() {
  const [tab, setTab] = useState('1');
  return (
    <div>
      <Tabs
        items={[
          { key: '1', label: '标签一' },
          { key: '2', label: '标签二' },
          { key: '3', label: '禁用', disabled: true },
          { key: '4', label: '标签四' },
        ]}
        activeKey={tab}
        onChange={setTab}
      />
      <Text type="secondary">当前：{tab}（←→ 方向键移动，Home/End 跳首尾）</Text>
    </div>
  );
}

export function DemoBreadcrumb() {
  return <Breadcrumb items={[{ label: '首页', href: '#' }, { label: '设置', href: '#' }, { label: '通知' }]} />;
}

export function DemoPagination() {
  const [page, setPage] = useState(4);
  return (
    <div>
      <Pagination current={page} total={187} pageSize={10} onChange={setPage} />
      <Text type="secondary">当前第 {page} 页 / 共 19 页</Text>
    </div>
  );
}

export function DemoSteps() {
  const [step, setStep] = useState(1);
  return (
    <div>
      <Steps steps={['填写信息', '确认订单', '完成支付']} current={step} />
      <div style={{ marginTop: 8 }}>
        <Stack direction="horizontal" gap={2}>
          <Button size="sm" disabled={step <= 0} onClick={() => setStep(step - 1)}>
            上一步
          </Button>
          <Button size="sm" disabled={step >= 2} onClick={() => setStep(step + 1)}>
            下一步
          </Button>
        </Stack>
      </div>
    </div>
  );
}

export function DemoSegmented() {
  const [v, setV] = useState('day');
  return (
    <div>
      <SegmentedControl
        value={v}
        onChange={setV}
        options={[
          { value: 'day', label: '日视图' },
          { value: 'week', label: '周视图' },
          { value: 'month', label: '月视图' },
        ]}
      />
      <Text type="secondary">当前：{v}</Text>
    </div>
  );
}

export function DemoToggleGroup() {
  const [values, setValues] = useState<string[]>(['前端']);
  return (
    <div>
      <ToggleGroup
        values={values}
        onChange={setValues}
        options={[
          { value: '设计', label: '设计' },
          { value: '前端', label: '前端' },
          { value: '后端', label: '后端' },
        ]}
      />
      <Text type="secondary">已选：{values.length ? values.join('、') : '（无）'}</Text>
    </div>
  );
}

export function DemoTreeMenu() {
  const [selected, setSelected] = useState('m1');
  return (
    <div style={{ maxWidth: 240 }}>
      <TreeMenu
        data={[
          { key: 'm1', label: '总览' },
          {
            key: 'm2',
            label: '设置',
            children: [
              { key: 'm2-1', label: '常规' },
              { key: 'm2-2', label: '快捷键' },
              { key: 'm2-3', label: '账户' },
            ],
          },
          { key: 'm3', label: '关于' },
        ]}
        defaultExpanded={['m2']}
        selectedKey={selected}
        onSelect={setSelected}
      />
      <Text type="secondary">当前选中：{selected}</Text>
    </div>
  );
}

export function DemoDropdownMenu() {
  const [last, setLast] = useState('（尚未选择）');
  return (
    <div>
      <DropdownMenu
        trigger={<Button>操作 ▾</Button>}
        items={[
          { key: 'sep', type: 'separator' },
          { key: 'g', type: 'group', label: '文件操作' },
          { key: 'rename', label: '重命名', onSelect: () => setLast('重命名') },
          { key: 'copy', label: '复制', onSelect: () => setLast('复制') },
          { key: 'sep2', type: 'separator' },
          { key: 'del', label: '删除', danger: true, onSelect: () => setLast('删除') },
        ]}
      />
      <Text type="secondary">最后动作：{last}（↑↓ 导航自动跳过分隔线）</Text>
    </div>
  );
}

export function DemoContextMenu() {
  const [log, setLog] = useState('（右键下方区域）');
  return (
    <div>
      <div
        style={{
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed var(--ui-border-strong)',
          borderRadius: 8,
        }}
      >
        <ContextMenu
          items={[
            { key: 'open', label: '打开', onSelect: () => setLog('打开') },
            { key: 'del', label: '删除', danger: true, onSelect: () => setLog('删除') },
          ]}
        >
          <span style={{ padding: '0 24px' }}>在此区域右键</span>
        </ContextMenu>
      </div>
      <Text type="secondary">最后动作：{log}（贴边自动钳制）</Text>
    </div>
  );
}

export function DemoBackTop() {
  return (
    <div>
      <Text type="secondary">向下滚动页面，右下角出现「返回顶部」按钮。</Text>
      <BackTop threshold={100} />
    </div>
  );
}

export function DemoNavOverview() {
  return (
    <div>
      <Title level={2}>导航</Title>
      <Text type="secondary">左侧选择具体组件查看实时演示。</Text>
    </div>
  );
}

export function DemoNavMenu() {
  const [active, setActive] = useState('home');
  return (
    <div>
      <NavMenu
        items={[
          { key: 'home', label: '首页' },
          {
            key: 'project',
            label: '项目',
            children: [
              { key: 'project-list', label: '项目列表' },
              { key: 'project-new', label: '新建项目' },
              { key: 'project-archive', label: '归档', disabled: true },
            ],
          },
          { key: 'about', label: '关于' },
        ]}
        activeKey={active}
        onSelect={setActive}
      />
      <Text type="secondary">当前激活：{active}——子菜单选中时顶项联动高亮；点外/Esc 收起</Text>
    </div>
  );
}

export function DemoTabsEditable() {
  const [items, setItems] = useState([
    { key: 't1', label: '文件 A' },
    { key: 't2', label: '文件 B' },
  ]);
  const [active, setActive] = useState('t1');
  return (
    <div>
      <Tabs
        editable
        items={items}
        activeKey={active}
        onChange={setActive}
        onAdd={() => {
          const key = `t${Date.now()}`;
          setItems((its) => [...its, { key, label: `文件 ${String.fromCharCode(65 + its.length)}` }]);
          setActive(key);
        }}
        onClose={(key) => {
          setItems((its) => {
            const next = its.filter((it) => it.key !== key);
            if (key === active && next.length > 0) {
              const idx = its.findIndex((it) => it.key === key);
              setActive(next[Math.min(idx, next.length - 1)].key);
            }
            return next;
          });
        }}
      />
      <Text type="secondary">可编辑卡片型：× 关闭（关当前页自动切相邻）、+ 新增；关闭 ≠ 激活（stopPropagation）</Text>
    </div>
  );
}
