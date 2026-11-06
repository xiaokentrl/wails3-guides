/**
 * 2026-11 批新增组件测试（→ 组件库方案质量保障层四件套延续）。
 * 运行前提同 components.test.tsx：vitest + @testing-library/react + user-event + jest-dom + jsdom。
 * 覆盖：MultiSelect / Cascader 多选三态 / Highlight / EditableText（IME）/
 *       PermissionGate 三策略 / EmojiPicker / VirtualizedTree / Masonry measured 冒烟。
 * 期望值均与浏览器实测（dev server :5183）对齐，非拍脑袋。
 */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Cascader, EditableText, EmojiPicker, Highlight, Masonry, MultiSelect, PermissionGate, PermissionGateOf, PermissionProvider, VirtualizedTree } from '../index';

/* ===== MultiSelect ===== */

describe('MultiSelect', () => {
  const options = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'solid', label: 'Solid' },
    { value: 'legacy', label: 'Legacy（禁用）', disabled: true },
  ];

  it('勾选一项 → onChange 追加；再勾 → 移除（多选切换语义，经受控 harness）', async () => {
    function Harness() {
      const [v, setV] = useState<string[]>([]);
      return <MultiSelect options={options} value={v} onChange={setV} />;
    }
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: '请选择' }));
    await userEvent.click(screen.getByRole('option', { name: 'Vue' }));
    expect(screen.getByRole('button', { name: '已选 1 项' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('option', { name: 'Vue' }));
    expect(screen.getByRole('button', { name: '请选择' })).toBeInTheDocument(); // 切回空
  });

  it('全选排除禁用项', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={options} value={[]} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '请选择' }));
    await userEvent.click(screen.getByRole('button', { name: '全选' }));
    expect(onChange).toHaveBeenLastCalledWith(['react', 'vue', 'solid']);
  });

  it('tag 点击 × → 移除该值', async () => {
    const onChange = vi.fn();
    render(<MultiSelect options={options} value={['react', 'vue']} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '移除 React' }));
    expect(onChange).toHaveBeenLastCalledWith(['vue']);
  });
});

/* ===== Cascader 多选（复选框三态） ===== */

const TREE = [
  {
    value: 'zh',
    label: '前端',
    children: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
    ],
  },
  { value: 'ops', label: '运维' },
];

describe('Cascader multiple', () => {
  it('勾选父级 → 整棵子树叶路径全选', async () => {
    const onChange = vi.fn();
    render(<Cascader options={TREE} multiple value={[]} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '请选择' }));
    await userEvent.click(screen.getByRole('checkbox', { name: '勾选 前端' }));
    expect(onChange).toHaveBeenLastCalledWith([['zh', 'react'], ['zh', 'vue']]);
  });

  it('部分勾选时父级为 mixed', async () => {
    render(<Cascader options={TREE} multiple value={[['zh', 'react']]} onChange={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: '已选 1 项' }));
    expect(screen.getByRole('checkbox', { name: '勾选 前端' })).toHaveAttribute('aria-checked', 'mixed');
  });

  it('单选：选叶子关面板且回显完整路径', async () => {
    const onChange = vi.fn();
    render(<Cascader options={TREE} value={[]} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: '请选择' }));
    await userEvent.click(screen.getByRole('option', { name: /前端/ })); // 展开第二列
    await userEvent.click(screen.getByRole('option', { name: 'React' }));
    expect(onChange).toHaveBeenLastCalledWith(['zh', 'react']);
    expect(screen.getByRole('button', { name: /前端 \/ React/ })).toBeInTheDocument();
  });
});

/* ===== Highlight ===== */

describe('Highlight', () => {
  it('命中段包 <mark>；大小写不敏感默认', () => {
    const { container } = render(<Highlight text="Design Token 唯一来源 design" query="design" />);
    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(2);
    expect(marks[0].textContent).toBe('Design');
    expect(marks[1].textContent).toBe('design');
  });

  it('空 query 原样返回（无 mark）', () => {
    const { container } = render(<Highlight text="任意文本" query="   " />);
    expect(container.querySelectorAll('mark')).toHaveLength(0);
  });

  it('无命中不切段', () => {
    const { container } = render(<Highlight text="纯文本" query="不存在" />);
    expect(container.querySelectorAll('mark')).toHaveLength(0);
    expect(container.textContent).toBe('纯文本');
  });
});

/* ===== EditableText（IME 组合态纪律） ===== */

describe('EditableText', () => {
  it('Enter 提交；校验失败显示错误且不退出编辑态', async () => {
    const onChange = vi.fn();
    render(<EditableText value="标题" onChange={onChange} validate={(v) => (v.trim().length < 2 ? '至少 2 个字符' : null)} />);
    await userEvent.click(screen.getByRole('button', { name: /编辑：标题/ }));
    const input = screen.getByLabelText('编辑文本');
    await userEvent.clear(input);
    await userEvent.type(input, 'A');
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('alert')).toHaveTextContent('至少 2 个字符');
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText('编辑文本')).toBeInTheDocument(); // 仍在编辑态
    await userEvent.clear(input);
    await userEvent.type(input, '新标题');
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('新标题');
  });

  it('IME 组合态 Enter 不提交（库铁律），compositionend 后才提交', async () => {
    const onChange = vi.fn();
    render(<EditableText value="标题" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /编辑：标题/ }));
    const input = screen.getByLabelText('编辑文本');
    await userEvent.clear(input);
    fireEvent.change(input, { target: { value: 'nihao' } });
    fireEvent.compositionStart(input);
    fireEvent.keyDown(input, { key: 'Enter' }); // 组合态确认拼音——不得当提交
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.compositionEnd(input);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenLastCalledWith('nihao');
  });

  it('Escape 取消：不触发 onChange', async () => {
    const onChange = vi.fn();
    render(<EditableText value="标题" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /编辑：标题/ }));
    const input = screen.getByLabelText('编辑文本');
    await userEvent.clear(input);
    await userEvent.type(input, '草稿');
    await userEvent.keyboard('{Escape}');
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByLabelText('编辑文本')).not.toBeInTheDocument();
  });
});

/* ===== PermissionGate 三策略 ===== */

describe('PermissionGate', () => {
  it('hide：不渲染', () => {
    render(
      <PermissionGate allowed={false} strategy="hide">
        <button>删除</button>
      </PermissionGate>,
    );
    expect(screen.queryByRole('button', { name: '删除' })).not.toBeInTheDocument();
  });

  it('disable：可见不可用，点击被拦截，title 带原因', async () => {
    const onClick = vi.fn();
    render(
      <PermissionGate allowed={false} strategy="disable" reason="无权限">
        <button onClick={onClick}>删除</button>
      </PermissionGate>,
    );
    const gate = screen.getByText('删除').closest('span')!;
    expect(gate).toHaveAttribute('aria-disabled', 'true');
    expect(gate).toHaveAttribute('title', '无权限');
    await userEvent.click(screen.getByText('删除'));
    expect(onClick).not.toHaveBeenCalled(); // onClickCapture 拦截
  });

  it('replace：渲染替代节点', () => {
    render(
      <PermissionGate allowed={false} strategy="replace" fallback={<span>需要管理员</span>}>
        <button>导出</button>
      </PermissionGate>,
    );
    expect(screen.queryByRole('button', { name: '导出' })).not.toBeInTheDocument();
    expect(screen.getByText('需要管理员')).toBeInTheDocument();
  });

  it('PermissionGateOf：无 Provider 时安全默认拒绝', () => {
    render(
      <PermissionGateOf permission="admin:export" strategy="hide">
        <button>导出</button>
      </PermissionGateOf>,
    );
    expect(screen.queryByRole('button', { name: '导出' })).not.toBeInTheDocument();
  });

  it('PermissionProvider 授权后放行', () => {
    render(
      <PermissionProvider permissions={['admin:export']}>
        <PermissionGateOf permission="admin:export" strategy="hide">
          <button>导出</button>
        </PermissionGateOf>
      </PermissionProvider>,
    );
    expect(screen.getByRole('button', { name: '导出' })).toBeInTheDocument();
  });
});

/* ===== EmojiPicker ===== */

describe('EmojiPicker', () => {
  beforeEach(() => localStorage.clear());

  it('打开 → 分类页签与格子；搜索关键词过滤；选中回调', async () => {
    const onPick = vi.fn();
    render(<EmojiPicker onPick={onPick} />);
    await userEvent.click(screen.getByRole('button', { name: '选择表情' }));
    expect(screen.getByRole('tab', { name: '表情' })).toHaveAttribute('aria-selected', 'true');
    // 中文关键词搜索："赞" → 👍
    const search = screen.getByLabelText('搜索表情');
    await userEvent.type(search, '赞');
    await userEvent.click(screen.getByRole('button', { name: /插入 thumbs/ }));
    expect(onPick).toHaveBeenCalledWith('👍');
  });

  it('最近使用：选中后写 localStorage，清空搜索词后出现在最近区', async () => {
    const onPick = vi.fn();
    render(<EmojiPicker onPick={onPick} open onClose={() => {}} />);
    await userEvent.type(screen.getByLabelText('搜索表情'), 'fire');
    await userEvent.click(screen.getByRole('button', { name: /插入 fire/ }));
    expect(onPick).toHaveBeenCalledWith('🔥');
    expect(JSON.parse(localStorage.getItem('ui-emojipicker-recent') ?? '[]')).toContain('🔥');
    await userEvent.clear(screen.getByLabelText('搜索表情'));
    expect(screen.getByText('最近使用')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /插入 🔥/ })).toBeInTheDocument();
  });

  it('Escape 关闭（自管开关）', async () => {
    render(<EmojiPicker onPick={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: '选择表情' }));
    expect(screen.getByRole('dialog', { name: '表情选择' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: '表情选择' })).not.toBeInTheDocument();
  });
});

/* ===== VirtualizedTree ===== */

function makeTree(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    key: `n${i}`,
    label: `节点 ${i + 1}`,
    children:
      i === 0
        ? [{ key: 'n0-a', label: '子项 A' }, { key: 'n0-b', label: '子项 B' }]
        : undefined,
  }));
}

describe('VirtualizedTree', () => {
  it('虚拟化：3000 节点只渲染可视窗口', () => {
    render(<VirtualizedTree data={makeTree(3000)} height={96} rowHeight={32} />);
    // 视口 3 行 + overscan 5×2 → 渲染行数远小于总数
    expect(document.querySelectorAll('[role=treeitem]').length).toBeLessThan(20);
  });

  it('键盘：→ 展开父级后子项入列；Enter 选中', async () => {
    const onSelect = vi.fn();
    render(<VirtualizedTree data={makeTree(30)} height={96} rowHeight={32} defaultExpanded={[]} onSelect={onSelect} />);
    const tree = screen.getByRole('tree');
    tree.focus();
    fireEvent.keyDown(tree, { key: 'ArrowRight' }); // 展开节点 1
    expect(screen.getByRole('treeitem', { name: '子项 A' })).toBeInTheDocument();
    fireEvent.keyDown(tree, { key: 'ArrowDown' }); // 进入子项 A
    fireEvent.keyDown(tree, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('n0-a');
  });

  it('aria-activedescendant 随 ↑↓ 移动', () => {
    render(<VirtualizedTree data={makeTree(30)} height={96} rowHeight={32} />);
    const tree = screen.getByRole('tree');
    expect(tree).toHaveAttribute('aria-activedescendant', 'ui-vtree-opt-0');
    fireEvent.keyDown(tree, { key: 'ArrowDown' });
    expect(tree).toHaveAttribute('aria-activedescendant', 'ui-vtree-opt-1');
  });
});

/* ===== Masonry measured（jsdom 无布局引擎 → 结构冒烟） ===== */

describe('Masonry measured', () => {
  it('渲染保留全部子项（jsdom 无 ResizeObserver/布局，仅冒烟；定位正确性以浏览器实测为准）', () => {
    const { container } = render(
      <Masonry columns={3} measured>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i}>卡片 {i + 1}</div>
        ))}
      </Masonry>,
    );
    const measured = container.querySelector('.ui-masonry--measured')!;
    expect(measured.children).toHaveLength(6);
    expect(container.textContent).toContain('卡片 6');
  });
});
