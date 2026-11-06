import { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './ScrollArea.css';

export interface ScrollAreaProps {
  children: ReactNode;
  /** 视口高度（超出滚动） */
  maxHeight?: number | string;
  className?: string;
}

/**
 * 滚动容器：原生 overflow + 令牌化滚动条（三引擎 scrollbar 外观差异大，统一在此封装）。
 * 保留原生滚动语义与触控/键盘行为，不自造滚动。
 */
export function ScrollArea({ children, maxHeight = 240, className }: ScrollAreaProps) {
  return (
    <div className={cn('ui-scrollarea', className)} style={{ maxHeight }}>
      {children}
    </div>
  );
}
