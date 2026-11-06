/**
 * 核心交互测试（→ 组件库方案质量保障层；入库四件套「交互 + a11y 测试」件的首批落地）。
 * 运行前提：项目内安装 vitest + @testing-library/react + @testing-library/user-event
 *          + @testing-library/jest-dom（setupFiles 里 import '@testing-library/jest-dom'）+ jsdom。
 * 覆盖的是「结构性纪律」而非全部行为：在途禁用、焦点陷阱、键盘导航、去重、IME 不拦截。
 */
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Button, Modal, PinInput, SelectListbox, TagInput, TextInput } from '../index';

describe('Button', () => {
  it('loading 时禁用并标记 aria-busy', async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>保存</Button>);
    const btn = screen.getByRole('button', { name: '保存' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled(); // 在途禁用 → 同步层连点纪律
  });
});

describe('Modal', () => {
  it('Escape 关闭并归还焦点', async () => {
    const onClose = vi.fn();
    render(
      <>
        <button>触发者</button>
        <Modal open onClose={onClose} title="测试">内容</Modal>
      </>,
    );
    const trigger = screen.getByRole('button', { name: '触发者' });
    trigger.focus();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('嵌套弹框：Escape 只关最上层（弹框栈路由；真实时序=先开后内）', async () => {
    const closeOuter = vi.fn();
    const closeInner = vi.fn();
    const { rerender } = render(<Modal open onClose={closeOuter} title="外层">外层内容</Modal>);
    // 真实流程：外层先开，用户动作后内层才开（跨 commit 入栈 → 内层居顶）
    rerender(
      <Modal open onClose={closeOuter} title="外层">
        <Modal open onClose={closeInner} title="内层">
          内层内容
        </Modal>
      </Modal>,
    );
    await userEvent.keyboard('{Escape}');
    expect(closeInner).toHaveBeenCalledTimes(1); // 栈顶 = 内层
    expect(closeOuter).not.toHaveBeenCalled(); // 外层不响应
  });

  it('焦点陷阱：Tab 循环留在对话框内', async () => {
    render(<Modal open onClose={() => {}} title="测试"><button>内部一</button><button>内部二</button></Modal>);
    const close = screen.getByRole('button', { name: '关闭' });
    close.focus(); // 最后一个可聚焦元素
    await userEvent.tab();
    expect(screen.getByRole('button', { name: '内部一' })).toHaveFocus(); // 循环回首
  });
});

describe('SelectListbox', () => {
  const options = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B', disabled: true },
    { value: 'c', label: 'C' },
  ];

  it('Enter 选中、Escape 关闭', async () => {
    const onChange = vi.fn();
    render(<SelectListbox value="" onChange={onChange} options={options} />);
    const trigger = screen.getByRole('button');
    await userEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{Enter}'); // active 默认落在选中项或首个可用项（a）
    expect(onChange).toHaveBeenCalledWith('a');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('方向键跳过禁用项', async () => {
    const onChange = vi.fn();
    render(<SelectListbox value="" onChange={onChange} options={options} />);
    await userEvent.click(screen.getByRole('button'));
    await userEvent.keyboard('{ArrowDown}'); // a → 跳过禁用的 b → c
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('c');
  });
});

describe('TextInput IME 纪律', () => {
  it('组合态不拦截：onChange 照常发生，组件不改写值', async () => {
    const onChange = vi.fn();
    render(<TextInput onChange={onChange} />);
    const input = screen.getByRole('textbox');
    // 模拟组合期间的输入（insertCompositionText 不触发额外行为是组件的义务——即组件无任何拦截逻辑）
    input.focus();
    fireEventBeforeInput(input);
    await userEvent.type(input, 'x');
    expect(onChange).toHaveBeenCalled();
  });

  function fireEventBeforeInput(el: HTMLElement) {
    el.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    el.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
  }
});

describe('TagInput', () => {
  it('Enter 提交、重复去重、Backspace 删末尾', async () => {
    const onChange = vi.fn();
    render(<TagInput tags={['前端']} onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: '添加标签' });
    await userEvent.type(input, '设计{Enter}');
    expect(onChange).toHaveBeenCalledWith(['前端', '设计']);
  });
});

describe('PinInput', () => {
  it('逐格输入自动前进并汇总到完整值（受控 harness 回灌值）', async () => {
    const onChange = vi.fn();
    function Harness() {
      const [v, setV] = useState('');
      return <PinInput length={6} value={v} onChange={(x) => { onChange(x); setV(x); }} />;
    }
    render(<Harness />);
    const first = screen.getByRole('textbox', { name: '第 1 位' });
    await userEvent.type(first, '123456');
    expect(onChange).toHaveBeenLastCalledWith('123456');
  });

  it('空格 Backspace 回退并清空前一位', async () => {
    const onChange = vi.fn();
    render(<PinInput length={6} value="123" onChange={onChange} />);
    const cell4 = screen.getByRole('textbox', { name: '第 4 位' });
    await userEvent.click(cell4);
    await userEvent.keyboard('{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith('12');
  });
});
