import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './ZoomableContainer.css';

export interface ZoomableContainerProps {
  children: ReactNode;
  min?: number;
  max?: number;
  /** 每次 Ctrl+滚轮 的缩放步进倍率 */
  wheelStep?: number;
  initialZoom?: number;
  /** 单指拖拽平移（缩放后才有意义；内容自身可滚动时应关闭） */
  pannable?: boolean;
  className?: string;
}

/**
 * 可放大缩小的内容容器（→ 组件库方案布局类；画布/文档/图片类内容的底座）：
 * - Ctrl/⌘ + 滚轮 缩放（以光标为锚点），双指捏合缩放（Pointer Events，触屏双模）；
 * - 平移：拖拽（pannable）；
 * - 缩放范围 min/max 钳制；状态持久化由调用方接状态方案。
 * 注意：内容交互元素多时应关闭 pannable，或由调用方按 hitTest 决定。
 */
export function ZoomableContainer({
  children,
  min = 0.2,
  max = 4,
  wheelStep = 1.15,
  initialZoom = 1,
  pannable = true,
  className,
}: ZoomableContainerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(initialZoom);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDist = useRef(0);
  const panLast = useRef<{ x: number; y: number } | null>(null);

  const clampZoom = (z: number) => Math.max(min, Math.min(max, z));

  /** 以视口点 (cx, cy) 为锚点缩放：保持锚点下的内容点不动。 */
  const zoomAt = useCallback(
    (cx: number, cy: number, factor: number) => {
      setZoom((z) => {
        const next = clampZoom(z * factor);
        if (next === z) return z;
        setOffset((o) => ({
          x: cx - (cx - o.x) * (next / z),
          y: cy - (cy - o.y) * (next / z),
        }));
        return next;
      });
    },
    [min, max],
  );

  const onWheel = (e: WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return; // 普通滚轮留给页面滚动
    e.preventDefault();
    const rect = hostRef.current!.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? wheelStep : 1 / wheelStep);
  };

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1 && pannable) panLast.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchDist.current = Math.hypot(a.x - b.x, a.y - b.y);
      panLast.current = null;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDist.current > 0) {
        const rect = hostRef.current!.getBoundingClientRect();
        const mid = {
          x: (a.x + b.x) / 2 - rect.left,
          y: (a.y + b.y) / 2 - rect.top,
        };
        zoomAt(mid.x, mid.y, dist / pinchDist.current);
      }
      pinchDist.current = dist;
      return;
    }

    if (pannable && panLast.current) {
      const dx = e.clientX - panLast.current.x;
      const dy = e.clientY - panLast.current.y;
      panLast.current = { x: e.clientX, y: e.clientY };
      setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchDist.current = 0;
    if (pointers.current.size === 0) panLast.current = null;
  };

  const reset = () => {
    setZoom(initialZoom);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={hostRef}
      className={cn('ui-zoom', className)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={reset}
      style={{ touchAction: 'none' }}
    >
      <div
        className="ui-zoom__content"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: '0 0' }}
      >
        {children}
      </div>
      {zoom !== initialZoom && (
        <button type="button" className="ui-zoom__reset" aria-label="重置缩放" onClick={reset}>
          {Math.round(zoom * 100)}% · 重置
        </button>
      )}
    </div>
  );
}
