import { CSSProperties, ReactNode, UIEvent, useRef, useState } from 'react';

/**
 * 最小虚拟列表：固定行高窗口化（→ 性能方案大数据量渲染）。
 * 动态行高 / 双向滚动为下一批；表格虚拟化基于同一 hook 组合。
 */
export function useVirtualList<T>(items: T[], rowHeight: number, viewportHeight: number, overscan = 5) {
  const [scrollTop, setScrollTop] = useState(0);
  const onScroll = (e: UIEvent<HTMLDivElement>) => setScrollTop(e.currentTarget.scrollTop);
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / rowHeight) + overscan * 2;
  const end = Math.min(items.length, start + visibleCount);
  const virtualItems = items.slice(start, end).map((item, i) => ({
    index: start + i,
    item,
    style: { height: rowHeight, transform: `translateY(${(start + i) * rowHeight}px)` } as CSSProperties,
  }));
  return {
    totalHeight: items.length * rowHeight,
    virtualItems,
    containerProps: {
      onScroll,
      style: { overflowY: 'auto', height: viewportHeight } as CSSProperties,
    },
  };
}

export interface VirtualListProps<T> {
  items: T[];
  rowHeight: number;
  height: number;
  render: (item: T, index: number) => ReactNode;
  className?: string;
}

export function VirtualList<T>({ items, rowHeight, height, render, className }: VirtualListProps<T>) {
  const { totalHeight, virtualItems, containerProps } = useVirtualList(items, rowHeight, height);
  const innerRef = useRef<HTMLDivElement>(null);
  return (
    <div {...containerProps} className={className}>
      <div ref={innerRef} style={{ height: totalHeight, position: 'relative' }}>
        {virtualItems.map((v) => (
          <div key={v.index} style={{ position: 'absolute', top: 0, left: 0, right: 0, ...v.style }}>
            {render(v.item, v.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- 动态行高：先按估值占位，渲染后实测校正（→ 组件库方案：动态行高虚拟化） ---- */

export function useVirtualListDynamic<T>(items: T[], estimateHeight: number, viewportHeight: number, overscan = 3) {
  const [scrollTop, setScrollTop] = useState(0);
  const [heights, setHeights] = useState<Record<number, number>>({});
  const heightsRef = useRef(heights);
  heightsRef.current = heights;

  const getHeight = (i: number) => heightsRef.current[i] ?? estimateHeight;

  // 前缀偏移（线性扫描足够；万级条目再换二分）
  const offsets: number[] = [0];
  for (let i = 0; i < items.length; i++) offsets.push(offsets[i] + getHeight(i));

  const findStart = () => {
    for (let i = 0; i < items.length; i++) {
      if (offsets[i + 1] > scrollTop) return i;
    }
    return Math.max(0, items.length - 1);
  };

  const start = Math.max(0, findStart() - overscan);
  const end = (() => {
    let i = start;
    while (i < items.length && offsets[i] < scrollTop + viewportHeight + overscan * estimateHeight) i++;
    return Math.min(items.length, i + overscan);
  })();

  const measure = (index: number, h: number) => {
    if (Math.abs((heightsRef.current[index] ?? estimateHeight) - h) > 1) {
      setHeights((prev) => ({ ...prev, [index]: h }));
    }
  };

  const onScroll = (e: UIEvent<HTMLDivElement>) => setScrollTop(e.currentTarget.scrollTop);

  return {
    totalHeight: offsets[items.length],
    containerProps: { onScroll, style: { overflowY: 'auto', height: viewportHeight } as CSSProperties },
    range: { start, end },
    getHeight,
    measure,
  };
}

export interface VirtualListDynamicProps<T> {
  items: T[];
  /** 估值（未实测前的占位与预滚动依据） */
  estimateHeight: number;
  height: number;
  render: (item: T, index: number) => ReactNode;
  className?: string;
}

export function VirtualListDynamic<T>({ items, estimateHeight, height, render, className }: VirtualListDynamicProps<T>) {
  const { totalHeight, containerProps, range, getHeight, measure } = useVirtualListDynamic(items, estimateHeight, height);
  return (
    <div {...containerProps} className={className}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        {items.slice(range.start, range.end).map((item, i) => {
          const index = range.start + i;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                transform: `translateY(${offsetsAt(getHeight, index)}px)`,
              }}
              ref={(el) => {
                if (el) measure(index, el.offsetHeight);
              }}
            >
              {render(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function offsetsAt(getHeight: (i: number) => number, index: number): number {
  let y = 0;
  for (let i = 0; i < index; i++) y += getHeight(i);
  return y;
}
