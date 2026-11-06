import { cn } from '../lib/cn';
import './Form.css';

export interface SliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/** 原生 range + 令牌化外观（原生控件承载语义与键盘，自绘的只是轨道）。 */
export function Slider({ value, onChange, min = 0, max = 100, step = 1, label, disabled, id, className }: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <label className={cn('ui-slider', className)}>
      {label && <span className="ui-slider__label">{label}</span>}
      <input
        id={id}
        type="range"
        className="ui-slider__input"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--ui-slider-percent' as string]: `${percent}%` }}
      />
    </label>
  );
}

export interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  label?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

/**
 * 原生 select + 令牌化外观（→ 组件库方案：原生控件承载语义，自绘只做皮）。
 * 自绘 listbox 版（完全键盘导航 + 虚拟化）列为下一批。
 */
export function Select({ value, onChange, options, label, disabled, id, className }: SelectProps) {
  return (
    <label className={cn('ui-select', className)}>
      {label && <span className="ui-select__label">{label}</span>}
      <select className="ui-select__input" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
