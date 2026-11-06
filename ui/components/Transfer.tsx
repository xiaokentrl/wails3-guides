import { useState } from 'react';
import { cn } from '../lib/cn';
import { ScrollArea } from './ScrollArea';
import './Composite.css';

export interface TransferOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TransferProps {
  options: TransferOption[];
  /** 右侧（已选）的值集合 */
  value: string[];
  onChange: (v: string[]) => void;
  titles?: [string, string];
  className?: string;
}

/** 穿梭框：双面板 + 复选 + 批量移动。移动后右侧保持 options 原始顺序（顺序感来自数据，不来自操作次序）。 */
export function Transfer({ options, value, onChange, titles = ['未选择', '已选择'], className }: TransferProps) {
  const [leftChecked, setLeftChecked] = useState<string[]>([]);
  const [rightChecked, setRightChecked] = useState<string[]>([]);

  const rightSet = new Set(value);
  const left = options.filter((o) => !rightSet.has(o.value));
  const right = options.filter((o) => rightSet.has(o.value));

  const moveRight = () => {
    if (leftChecked.length === 0) return;
    onChange([...value, ...leftChecked]);
    setLeftChecked([]);
  };
  const moveLeft = () => {
    if (rightChecked.length === 0) return;
    onChange(value.filter((v) => !rightChecked.includes(v)));
    setRightChecked([]);
  };

  const panel = (items: TransferOption[], checked: string[], setChecked: (v: string[]) => void) => (
    <ScrollArea maxHeight={220} className="ui-transfer__list">
      {items.length === 0 && <div className="ui-transfer__empty">（空）</div>}
      {items.map((o) => (
        <label key={o.value} className={cn('ui-transfer__option', o.disabled && 'ui-transfer__option--disabled')}>
          <input
            type="checkbox"
            disabled={o.disabled}
            checked={checked.includes(o.value)}
            onChange={(e) =>
              setChecked(e.target.checked ? [...checked, o.value] : checked.filter((v) => v !== o.value))
            }
          />
          <span className="ui-transfer__label">{o.label}</span>
        </label>
      ))}
    </ScrollArea>
  );

  const moveButtons = (dir: 'right' | 'left') => (
    <div className="ui-transfer__actions">
      <button
        type="button"
        className="ui-transfer__move"
        disabled={dir === 'right' ? leftChecked.length === 0 : rightChecked.length === 0}
        onClick={dir === 'right' ? moveRight : moveLeft}
        aria-label={dir === 'right' ? '移到已选择' : '移到未选择'}
      >
        {dir === 'right' ? '›' : '‹'}
      </button>
    </div>
  );

  return (
    <div className={cn('ui-transfer', className)}>
      <section className="ui-transfer__panel">
        <header className="ui-transfer__title">
          {titles[0]}（{left.length}）
        </header>
        {panel(left, leftChecked, setLeftChecked)}
      </section>
      {moveButtons('right')}
      <section className="ui-transfer__panel">
        <header className="ui-transfer__title">
          {titles[1]}（{right.length}）
        </header>
        {panel(right, rightChecked, setRightChecked)}
      </section>
      {moveButtons('left')}
    </div>
  );
}
