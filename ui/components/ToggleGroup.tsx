import { KeyboardEvent } from 'react';
import { cn } from '../lib/cn';
import './Nav.css';

export interface ToggleGroupProps {
  options: { value: string; label: string }[];
  /** 选中值集合（多选） */
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

/**
 * 多选分段（与 SegmentedControl 单选相对）：role=group + aria-pressed。
 * 键盘：Tab 进入、Space/Enter 切换（→ 无障碍方案）。
 */
export function ToggleGroup({ options, values, onChange, className }: ToggleGroupProps) {
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, value: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);
    }
  };
  return (
    <div role="group" className={cn('ui-toggle-group', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={values.includes(o.value)}
          className={cn('ui-segmented__item', values.includes(o.value) && 'ui-segmented__item--active')}
          onClick={() => onChange(values.includes(o.value) ? values.filter((v) => v !== o.value) : [...values, o.value])}
          onKeyDown={(e) => onKey(e, o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
