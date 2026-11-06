import { CSSProperties, KeyboardEvent, ReactNode, UIEvent, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import type { TreeNodeData } from './Tree';
import './Tree.css';
import './VirtualTree.css';

export interface VirtualizedTreeProps {
  data: TreeNodeData[];
  /** 视口高度（虚拟化的必填项） */
  height: number;
  /** 固定行高（虚拟化前提，默认 32） */
  rowHeight?: number;
  defaultExpanded?: string[];
  selectedKey?: string;
  onSelect?: (key: string) => void;
  className?: string;
}

interface FlatRow {
  key: string;
  label: ReactNode;
  depth: number;
  hasChildren: boolean;
  disabled?: boolean;
}

/**
 * 虚拟化树（→ 性能方案大数据量渲染）：万级节点的展开/选择树。
 * 复用 VirtualList 的固定行高窗口化（rowHeight 必须固定——这是虚拟化的前提约束）。
 * ARIA 采用 tree + aria-activedescendant 模式（容器持焦点，行节点动态挂 DOM，ref 直指不可行）。
 * 键盘：↑↓ 移动、→ 展开、← 折叠/回父级、Enter/Space 选中、Home/End。
 * checkable / 拖拽 / 动态行高：下一批（→ Tree 组件承担静态场景）。
 */
export function VirtualizedTree({ data, height, rowHeight = 32, defaultExpanded = [], selectedKey, onSelect, className }: VirtualizedTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultExpanded));
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 扁平可见序（折叠子树不进列表——虚拟化的索引基础）
  const flat: FlatRow[] = [];
  const walk = (nodes: TreeNodeData[], depth: number) => {
    for (const nd of nodes) {
      const hasChildren = !!nd.children?.length;
      flat.push({ key: nd.key, label: nd.label, depth, hasChildren, disabled: nd.disabled });
      if (hasChildren && expanded.has(nd.key)) walk(nd.children!, depth + 1);
    }
  };
  walk(data, 0);

  // 窗口化（与 VirtualList 同一公式）
  const OVERSCAN = 5;
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN);
  const visibleCount = Math.ceil(height / rowHeight) + OVERSCAN * 2;
  const end = Math.min(flat.length, start + visibleCount);
  const totalHeight = flat.length * rowHeight;

  // 展开态变化后把 active 收敛回可见范围
  useEffect(() => {
    setActiveIndex((i) => Math.min(i, Math.max(0, flat.length - 1)));
  }, [flat.length]);

  const scrollToIndex = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const top = i * rowHeight;
    if (top < el.scrollTop) el.scrollTop = top;
    else if (top + rowHeight > el.scrollTop + height) el.scrollTop = top + rowHeight - height;
  };

  const toggle = (row: FlatRow) => {
    if (!row.hasChildren) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(row.key)) next.delete(row.key);
      else next.add(row.key);
      return next;
    });
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const row = flat[activeIndex];
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const i = Math.min(activeIndex + 1, flat.length - 1);
      setActiveIndex(i);
      scrollToIndex(i);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const i = Math.max(activeIndex - 1, 0);
      setActiveIndex(i);
      scrollToIndex(i);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (row?.hasChildren && !expanded.has(row.key)) toggle(row);
      else if (row?.hasChildren) {
        const i = Math.min(activeIndex + 1, flat.length - 1);
        setActiveIndex(i);
        scrollToIndex(i);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (row?.hasChildren && expanded.has(row.key)) toggle(row);
      else {
        // 已折叠/叶子：跳到父级
        let pi = -1;
        for (let i = activeIndex - 1; i >= 0; i--) {
          if (flat[i].depth < (row?.depth ?? 0)) {
            pi = i;
            break;
          }
        }
        if (pi >= 0) {
          setActiveIndex(pi);
          scrollToIndex(pi);
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (row && !row.disabled) {
        if (row.hasChildren) toggle(row);
        onSelect?.(row.key);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
      scrollToIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      const i = flat.length - 1;
      setActiveIndex(i);
      scrollToIndex(i);
    }
  };

  return (
    <div
      ref={containerRef}
      role="tree"
      aria-activedescendant={`ui-vtree-opt-${activeIndex}`}
      tabIndex={0}
      className={cn('ui-vtree', className)}
      style={{ height, overflowY: 'auto' } as CSSProperties}
      onKeyDown={onKey}
      onScroll={(e: UIEvent<HTMLDivElement>) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {flat.slice(start, end).map((row, k) => {
          const i = start + k;
          const selected = row.key === selectedKey;
          return (
            <div
              key={row.key}
              id={`ui-vtree-opt-${i}`}
              role="treeitem"
              aria-level={row.depth + 1}
              aria-expanded={row.hasChildren ? expanded.has(row.key) : undefined}
              aria-selected={selected}
              aria-disabled={row.disabled || undefined}
              className={cn(
                'ui-vtree__row',
                i === activeIndex && 'ui-vtree__row--active',
                selected && 'ui-vtree__row--selected',
                row.disabled && 'ui-vtree__row--disabled',
              )}
              style={{ height: rowHeight, transform: `translateY(${i * rowHeight}px)` }}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => {
                setActiveIndex(i);
                if (!row.disabled) {
                  if (row.hasChildren) toggle(row);
                  onSelect?.(row.key);
                }
              }}
            >
              <span style={{ width: row.depth * 16, flex: 'none' }} aria-hidden="true" />
              <span className={cn('ui-vtree__chevron', row.hasChildren && 'ui-vtree__chevron--open')} aria-hidden="true">
                {row.hasChildren ? '▸' : '·'}
              </span>
              <span className="ui-vtree__label">{row.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
