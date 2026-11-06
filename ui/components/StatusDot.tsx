
import { cn } from '../lib/cn';
import './StatusDot.css';

export interface StatusDotProps {
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  /** 是否带脉冲动画 */
  pulse?: boolean;
  className?: string;
}

/** 状态指示点（→ 无障碍：颜色不是唯一通道，须配文字）。 */
export function StatusDot({ tone = 'neutral', pulse, className }: StatusDotProps) {
  return (
    <span className={cn('ui-status-dot', `ui-status-dot--${tone}`, pulse && 'ui-status-dot--pulse', className)} aria-hidden="true" />
  );
}
