import { cn } from '../lib/cn';
import './Data.css';

export interface GlobalProgressBarProps {
  /** 0–100；不传为不定态（来回滑动，用于无法量化的等待） */
  value?: number;
  className?: string;
}

/**
 * 顶部全局进度条（→ 弹框家族零打断档）：
 * 长任务进行中的全局信号——不打断、不挡操作（与 LoadingOverlay 相反的取舍）。
 */
export function GlobalProgressBar({ value, className }: GlobalProgressBarProps) {
  const indeterminate = value === undefined;
  const pct = indeterminate ? undefined : Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn('ui-global-progress', indeterminate && 'ui-global-progress--indeterminate', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-label="全局进度"
    >
      <span className="ui-global-progress__fill" style={pct !== undefined ? { width: `${pct}%` } : undefined} />
    </div>
  );
}
