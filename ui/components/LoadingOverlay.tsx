import { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './LoadingOverlay.css';

export interface LoadingOverlayProps {
  /** 是否显示（false 时移除遮罩） */
  active: boolean;
  /** 加载文本 */
  label?: string;
  /** 阻止底层交互（默认 true） */
  block?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * 区域级加载遮罩（→ 与 GlobalProgressBar 的区别：Global 是页面顶部非阻断信号，
 * LoadingOverlay 是**局部阻断**——包裹区域内的所有交互被暂停）。
 * 慎用：阻断式加载应限定在最小必要区域（→ 操作反馈方案时效预算）。
 */
export function LoadingOverlay({ active, label, block = true, children, className }: LoadingOverlayProps) {
  return (
    <div className={cn('ui-loading-overlay__host', className)}>
      {children}
      {active && (
        <div
          className={cn('ui-loading-overlay', !block && 'ui-loading-overlay--non-blocking')}
          role="status"
          aria-label={label ?? '加载中'}
        >
          <span className="ui-loading-overlay__spinner" aria-hidden="true" />
          {label && <span className="ui-loading-overlay__text">{label}</span>}
        </div>
      )}
    </div>
  );
}
