import { Children, ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './Masonry.css';

export interface MasonryProps {
  children: ReactNode;
  /** 列数（响应式可结合 useBreakpoint 传入） */
  columns?: number;
  /**
   * 测量版开关（默认 false = 计数均衡近似）：
   * true 时用 ResizeObserver 实测各子项高度并按「最短列优先」绝对定位——
   * 适用于子项高度差异极大的场景；首帧未测完前按 0 高度占位（渐进稳定）。
   */
  measured?: boolean;
  className?: string;
}

/**
 * 瀑布流。
 * 计数版（默认）：子项按「最短列优先」分配——不测量真实高度，对高度相近的卡片效果良好。
 * 测量版（measured）：实测高度后绝对定位，高度差异极大时使用。
 */
export function Masonry({ children, columns = 3, measured = false, className }: MasonryProps) {
  const items = Children.toArray(children);
  if (measured) return <MasonryMeasured items={items} columns={columns} className={className} />;
  return <MasonryCounted items={items} columns={columns} className={className} />;
}

/* ===== 计数均衡近似版（原实现） ===== */

function MasonryCounted({ items, columns, className }: { items: ReactNode[]; columns: number; className?: string }) {
  const cols: ReactNode[][] = Array.from({ length: Math.max(1, columns) }, () => []);
  let i = 0;
  items.forEach((child) => {
    cols[i % cols.length].push(child);
    i += 1;
  });
  return (
    <div className={cn('ui-masonry', className)}>
      {cols.map((col, ci) => (
        <div key={ci} className="ui-masonry__col">
          {col}
        </div>
      ))}
    </div>
  );
}

/* ===== 测量版：ResizeObserver 实测 + 最短列绝对定位 ===== */

function MasonryMeasured({ items, columns, className }: { items: ReactNode[]; columns: number; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [heights, setHeights] = useState<Record<number, number>>({});
  const [containerWidth, setContainerWidth] = useState(0);

  const n = Math.max(1, columns);

  // 容器宽度监测（列宽/换行重算的输入）
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return; // jsdom 等环境无 RO
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth);
    const ro = new ResizeObserver(() => setContainerWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 子项高度实测（内容/视口变化都会触发）
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return; // jsdom 等环境无 RO——冒烟场景跳过测量
    const els = containerRef.current
      ? (Array.from(containerRef.current.children) as HTMLElement[])
      : [];
    if (els.length === 0) return;
    const measure = () => {
      setHeights((prev) => {
        const next: Record<number, number> = { ...prev };
        let changed = false;
        els.forEach((el, i) => {
          const h = el.offsetHeight;
          if (Math.abs((next[i] ?? 0) - h) > 1) {
            next[i] = h;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    };
    const ro = new ResizeObserver(measure);
    els.forEach((el) => ro.observe(el));
    measure();
    return () => ro.disconnect();
  }, [items]);

  // 最短列优先放置
  const gap = 0; // 间距由子项自身 margin/下侧留白承担（与计数版 __col gap 语义对齐由调用方给 Card 加 margin）
  const colWidth = containerWidth > 0 ? (containerWidth - gap * (n - 1)) / n : 0;
  const colY: number[] = Array.from({ length: n }, () => 0);
  const positions: Array<{ x: number; y: number }> = [];
  items.forEach((_, i) => {
    const h = heights[i] ?? 0;
    let shortest = 0;
    for (let c = 1; c < n; c++) if (colY[c] < colY[shortest]) shortest = c;
    positions.push({ x: shortest * (colWidth + gap), y: colY[shortest] });
    colY[shortest] += h + gap;
  });
  const totalHeight = Math.max(...colY, 0);

  return (
    <div
      ref={containerRef}
      className={cn('ui-masonry', 'ui-masonry--measured', className)}
      style={{ position: 'relative', height: totalHeight || undefined }}
      aria-label="瀑布流"
    >
      {items.map((child, i) => {
        const pos = positions[i] ?? { x: 0, y: 0 };
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: colWidth || undefined,
              transform: `translate(${pos.x}px, ${pos.y}px)`,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
