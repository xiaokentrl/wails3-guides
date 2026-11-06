import { cn } from '../lib/cn';
import './Spinner.css';

export interface SpinnerProps {
  /** 尺寸档位 */
  size?: 'sm' | 'md' | 'lg';
  /** 读屏播报文本（默认「加载中」） */
  label?: string;
  /** 纯装饰形态：aria-hidden（用于按钮内——busy 语义由按钮的 aria-busy 承担，避免污染按钮可达名） */
  decorative?: boolean;
  className?: string;
}

/** 加载指示器。独立使用 role=status 读屏可感知；按钮内用 decorative；动画时长走令牌，尊重减少动效。 */
export function Spinner({ size = 'md', label = '加载中', decorative = false, className }: SpinnerProps) {
  return (
    <span
      {...(decorative ? { 'aria-hidden': true } : { role: 'status', 'aria-label': label })}
      className={cn('ui-spinner', `ui-spinner--${size}`, className)}
    />
  );
}
