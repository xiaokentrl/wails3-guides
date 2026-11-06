import { KeyboardEvent, ReactNode, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './Splitter.css';

export interface SplitterProps {
  /** horizontal = 左右分栏；vertical = 上下分栏 */
  direction?: 'horizontal' | 'vertical';
  /** 首面板百分比（受控） */
  percent?: number;
  /** 非受控初始值 */
  initial?: number;
  /** 首面板百分比上下限（默认 10–90） */
  min?: number;
  max?: number;
  /** 尺寸变化回调（拖拽中节流由调用方决定；拖拽结束必回调） */
  onResize?: (percent: number) => void;
  first: ReactNode;
  second: ReactNode;
  className?: string;
}

/**
 * 可拖拽分割面板（→《多平台一致组件库方案》布局类）：
 * - Pointer Events 统一鼠标与触屏（手势双模 → 横切关注点）；
 * - 键盘可调：分隔条 role=separator + 方向键 ±2（→ 无障碍键盘路径）；
 * - 百分比持久化由调用方接状态方案（→ 布局记忆）。
 */
export function Splitter(props: SplitterProps) {
  const { direction = 'horizontal', initial = 50, min = 10, max = 90, onResize, first, second, className } = props;
  const [inner, setInner] = useState(initial);
  const percent = props.percent ?? inner;
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const apply = (p: number) => {
    const clamped = Math.max(min, Math.min(max, p));
    setInner(clamped);
    onResize?.(clamped);
    return clamped;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const p =
      direction === 'horizontal'
        ? ((e.clientX - rect.left) / rect.width) * 100
        : ((e.clientY - rect.top) / rect.height) * 100;
    apply(p);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    onResize?.(percent);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 5 : 2;
    const fwd = direction === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    const back = direction === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    if (e.key === fwd) {
      e.preventDefault();
      apply(percent + step);
    } else if (e.key === back) {
      e.preventDefault();
      apply(percent - step);
    }
  };

  const firstSize = direction === 'horizontal' ? `${percent}%` : `${percent}%`;

  return (
    <div ref={containerRef} className={cn('ui-splitter', `ui-splitter--${direction}`, className)}>
      <div className="ui-splitter__pane" style={direction === 'horizontal' ? { width: firstSize } : { height: firstSize }}>
        {first}
      </div>
      <div
        role="separator"
        aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
        aria-valuenow={Math.round(percent)}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-label="调整面板大小"
        tabIndex={0}
        className="ui-splitter__handle"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => onKey(e)}
      />
      <div className="ui-splitter__pane ui-splitter__pane--fill">{second}</div>
    </div>
  );
}
