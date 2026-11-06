import { cn } from '../lib/cn';
import './Gauge.css';

export interface GaugeProps {
  /** 0–100 */
  value: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

/** 半圆仪表盘（conic-gradient 扇形，无外部图表库的轻量场景）。 */
export function Gauge({ value, label, showValue = true, className }: GaugeProps) {
  const pct = Math.max(0, Math.min(100, value));
  // 半圆：180° 扇区，从 -90°（左）扫到 +90°（右）
  const angle = (pct / 100) * 180;
  return (
    <div
      className={cn('ui-gauge', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      style={{ ['--ui-gauge-angle' as string]: `${angle}deg` }}
    >
      <div className="ui-gauge__arc">
        <span className="ui-gauge__needle" aria-hidden="true" />
      </div>
      <div className="ui-gauge__text">
        {showValue && <span className="ui-gauge__value">{pct}</span>}
        {label && <span className="ui-gauge__label">{label}</span>}
      </div>
    </div>
  );
}
