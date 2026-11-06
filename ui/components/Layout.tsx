import { CSSProperties, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Layout.css';

export interface StackProps {
  direction?: 'vertical' | 'horizontal';
  /** 间距档位（对应 --ui-space-1..6） */
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
  className?: string;
  children: ReactNode;
}

export function Stack({ direction = 'vertical', gap = 3, align, justify, wrap, className, children }: StackProps) {
  const style: CSSProperties = { gap: `var(--ui-space-${gap})`, alignItems: align, justifyContent: justify, flexWrap: wrap ? 'wrap' : undefined };
  return (
    <div className={cn('ui-stack', `ui-stack--${direction}`, className)} style={style}>
      {children}
    </div>
  );
}

export interface GridProps {
  /** 列定义（grid-template-columns） */
  columns?: string;
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: ReactNode;
}

export function Grid({ columns = 'repeat(3, 1fr)', gap = 4, className, children }: GridProps) {
  return (
    <div className={cn('ui-grid', className)} style={{ gridTemplateColumns: columns, gap: `var(--ui-space-${gap})` }}>
      {children}
    </div>
  );
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('ui-container', className)}>{children}</div>;
}

export interface StickyProps {
  top?: number | string;
  children: ReactNode;
  className?: string;
}

/** 吸顶容器（原生 position:sticky，父级不得 overflow:hidden）。 */
export function Sticky({ top = 0, children, className }: StickyProps) {
  return (
    <div className={cn('ui-sticky', className)} style={{ top }}>
      {children}
    </div>
  );
}

export function Center({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('ui-center', className)}>{children}</div>;
}

export interface AspectRatioProps {
  ratio: number;
  children: ReactNode;
  className?: string;
}

/** 固定宽高比容器（CSS aspect-ratio；三引擎支持随基线核实）。 */
export function AspectRatio({ ratio, children, className }: AspectRatioProps) {
  return (
    <div className={cn('ui-aspect', className)} style={{ aspectRatio: String(ratio) }}>
      {children}
    </div>
  );
}
