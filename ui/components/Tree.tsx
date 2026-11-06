import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './Tree.css';

export interface TreeNodeData {
  key: string;
  label: ReactNode;
  children?: TreeNodeData[];
  disabled?: boolean;
}

export interface TreeProps {
  data: TreeNodeData[];
  /** 选中节点 key（单选，叶子节点；与 checkable 互斥使用） */
  selectedKey?: string;
  onSelect?: (key: string) => void;
  /** 多选勾选模式：勾选父节点 = 全选子树；父节点呈半选态 */
  checkable?: boolean;
  checked?: string[];
  onCheck?: (keys: string[]) => void;
  /** 默认展开的 key */
  defaultExpanded?: string[];
  /** 开启节点拖拽（HTML5 DnD）；重排逻辑（含跨父移动的合法性）由调用方裁决 */
  draggable?: boolean;
  onDropNode?: (p: { draggedKey: string; targetKey: string }) => void;
  className?: string;
}

interface FlatItem {
  key: string;
  depth: number;
  parentKey: string | null;
}

/** 树：展开/折叠 + 单选 + checkable 多选（父勾选 = 子树全选，父呈半选态）+ 方向键导航。 */
export function Tree({ data, selectedKey, onSelect, checkable, checked = [], onCheck, defaultExpanded = [], draggable, onDropNode, className }: TreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const checkRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // 扁平可见序（键盘导航的索引基础）
  const visible: FlatItem[] = [];
  const walk = (nodes: TreeNodeData[], depth: number, parentKey: string | null) => {
    for (const n of nodes) {
      visible.push({ key: n.key, depth, parentKey });
      if (n.children?.length && expanded.has(n.key)) walk(n.children, depth + 1, n.key);
    }
  };
  walk(data, 0, null);

  const checkedSet = new Set(checked);
  const collectKeys = (n: TreeNodeData): string[] => [n.key, ...(n.children?.flatMap(collectKeys) ?? [])];
  const nodeCheckState = (n: TreeNodeData): 'all' | 'none' | 'some' => {
    const keys = collectKeys(n);
    const count = keys.filter((k) => checkedSet.has(k)).length;
    return count === 0 ? 'none' : count === keys.length ? 'all' : 'some';
  };

  const toggleExpand = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toggleCheck = (n: TreeNodeData) => {
    const keys = collectKeys(n);
    const shouldCheck = nodeCheckState(n) !== 'all';
    const next = new Set(checked);
    keys.forEach((k) => (shouldCheck ? next.add(k) : next.delete(k)));
    onCheck?.([...next]);
  };

  const focusItem = (key: string) => {
    setFocusKey(key);
    itemRefs.current[key]?.focus();
  };

  const onTreeKey = (e: KeyboardEvent) => {
    const idx = visible.findIndex((v) => v.key === focusKey);
    const cur = idx >= 0 ? visible[idx] : visible[0];
    if (!cur) return;
    const node = data.find((n) => n.key === cur.key) ?? findNode(data, cur.key);
    const hasChildren = !!node?.children?.length;
    const isOpen = node ? expanded.has(node.key) : false;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = visible[Math.min(idx + 1, visible.length - 1)];
      if (next) focusItem(next.key);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = visible[Math.max(idx - 1, 0)];
      if (prev) focusItem(prev.key);
    } else if (e.key === 'ArrowRight' && hasChildren) {
      e.preventDefault();
      if (!isOpen) toggleExpand(cur.key);
      else {
        const child = visible.find((v) => v.parentKey === cur.key);
        if (child) focusItem(child.key);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (hasChildren && isOpen) toggleExpand(cur.key);
      else if (cur.parentKey) focusItem(cur.parentKey);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!node) return;
      if (checkable) toggleCheck(node);
      else if (hasChildren) toggleExpand(node.key);
      else onSelect?.(node.key);
    }
  };

  const findNode = (nodes: TreeNodeData[], key: string): TreeNodeData | null => {
    for (const n of nodes) {
      if (n.key === key) return n;
      const hit = n.children ? findNode(n.children, key) : null;
      if (hit) return hit;
    }
    return null;
  };

  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dropKey, setDropKey] = useState<string | null>(null);

  const isDescendant = (ancestorKey: string, key: string): boolean => {
    const a = findNode(data, ancestorKey);
    return !!a && collectKeys(a).includes(key) && ancestorKey !== key;
  };

  const renderNodes = (nodes: TreeNodeData[], depth: number, parentKey: string | null) =>
    nodes.map((n) => {
      const hasChildren = !!n.children?.length;
      const isOpen = expanded.has(n.key);
      const checkState = checkable ? nodeCheckState(n) : 'none';
      const canDrop = draggable && dragKey && dragKey !== n.key && !isDescendant(dragKey, n.key);
      return (
        <div key={n.key}>
          <div
            role="treeitem"
            aria-expanded={hasChildren ? isOpen : undefined}
            aria-selected={!checkable && selectedKey === n.key ? true : undefined}
            aria-checked={checkable ? checkState !== 'none' : undefined}
            aria-disabled={n.disabled || undefined}
            draggable={draggable && !n.disabled}
            onDragStart={() => setDragKey(n.key)}
            onDragEnd={() => {
              setDragKey(null);
              setDropKey(null);
            }}
            onDragOver={(e) => {
              if (canDrop) {
                e.preventDefault();
                setDropKey(n.key);
              }
            }}
            onDragLeave={() => setDropKey((k) => (k === n.key ? null : k))}
            onDrop={(e) => {
              e.preventDefault();
              if (canDrop && dragKey) onDropNode?.({ draggedKey: dragKey, targetKey: n.key });
              setDragKey(null);
              setDropKey(null);
            }}
            className={cn(
              'ui-tree__item',
              !checkable && selectedKey === n.key && 'ui-tree__item--selected',
              dropKey === n.key && 'ui-tree__item--drop',
              n.disabled && 'ui-tree__item--disabled',
            )}
            style={{ paddingInlineStart: `calc(var(--ui-space-2) + ${depth} * var(--ui-space-5))` }}
          >
            {checkable ? (
              <input
                ref={(el) => {
                  checkRefs.current[n.key] = el;
                  itemRefs.current[n.key] = el;
                }}
                type="checkbox"
                className="ui-tree__check"
                checked={checkState === 'all'}
                disabled={n.disabled}
                onChange={() => toggleCheck(n)}
              />
            ) : hasChildren ? (
              <button
                type="button"
                className="ui-tree__switcher"
                aria-label={isOpen ? '折叠' : '展开'}
                onClick={() => toggleExpand(n.key)}
              >
                {isOpen ? '▾' : '▸'}
              </button>
            ) : (
              <span className="ui-tree__switcher ui-tree__switcher--leaf" aria-hidden="true" />
            )}
            <button
              ref={(el) => {
                itemRefs.current[n.key] = el;
              }}
              type="button"
              className="ui-tree__label"
              disabled={n.disabled}
              onClick={() => {
                if (checkable) toggleCheck(n);
                else if (hasChildren) toggleExpand(n.key);
                else onSelect?.(n.key);
              }}
            >
              {n.label}
            </button>
          </div>
          {hasChildren && isOpen && <div role="group">{renderNodes(n.children!, depth + 1, n.key)}</div>}
        </div>
      );
    });

  return (
    <div role="tree" className={cn('ui-tree', className)} onKeyDown={onTreeKey}>
      {renderNodes(data, 0, null)}
    </div>
  );
}

export interface TreeSelectProps {
  data: TreeNodeData[];
  value?: string;
  onChange: (key: string) => void;
  placeholder?: string;
  className?: string;
}

/** 树选择：弹层内嵌 Tree（点外关闭 + Escape，→ 弹框横切机制）。多选勾选模式见 Tree。 */
export function TreeSelect({ data, value, onChange, placeholder = '请选择', className }: TreeSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const findLabel = (nodes: TreeNodeData[]): ReactNode | null => {
    for (const n of nodes) {
      if (n.key === value) return n.label;
      const inChild = n.children ? findLabel(n.children) : null;
      if (inChild) return inChild;
    }
    return null;
  };

  return (
    <div ref={rootRef} className={cn('ui-listbox', className)}>
      <button
        type="button"
        className={cn('ui-listbox__trigger', !value && 'ui-listbox__trigger--placeholder')}
        aria-haspopup="tree"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {value ? (findLabel(data) ?? value) : <span className="ui-listbox__placeholder">{placeholder}</span>}
        <span className="ui-listbox__arrow" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div className="ui-listbox__list">
          <Tree
            data={data}
            selectedKey={value}
            onSelect={(k) => {
              onChange(k);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
