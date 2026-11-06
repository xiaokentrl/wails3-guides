import { cn } from '../lib/cn';
import './SliderRange.css';

export interface SliderRangeProps {
  value: [number, number];
  onChange: (v: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/** 双滑块范围选择器：两个原生 range 叠加，min/max 互不越界。 */
export function SliderRange({ value: [lo, hi], onChange, min = 0, max = 100, step = 1, label, disabled, className }: SliderRangeProps) {
  const range = max - min;
  const loPct = ((lo - min) / range) * 100;
  const hiPct = ((hi - min) / range) * 100;

  const clamp = (v: number, isLo: boolean) => {
    if (isLo) return Math.max(min, Math.min(v, hi - step));
    return Math.max(lo + step, Math.min(v, max));
  };

  return (
    <div className={cn('ui-slider-range', disabled && 'ui-slider-range--disabled', className)}>
      {label && <span className="ui-slider-range__label">{label}</span>}
      <div className="ui-slider-range__track-wrap">
        <div className="ui-slider-range__track" />
        <div className="ui-slider-range__range" style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }} />
        <input
          type="range" className="ui-slider-range__input" min={min} max={max} step={step} value={lo}
          disabled={disabled} aria-label="最小值"
          onChange={(e) => onChange([clamp(Number(e.target.value), true), hi])}
        />
        <input
          type="range" className="ui-slider-range__input" min={min} max={max} step={step} value={hi}
          disabled={disabled} aria-label="最大值"
          onChange={(e) => onChange([lo, clamp(Number(e.target.value), false)])}
        />
      </div>
      <span className="ui-slider-range__values">{lo} – {hi}</span>
    </div>
  );
}
