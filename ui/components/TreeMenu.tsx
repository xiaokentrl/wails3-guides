import { ReactNode, useState } from 'react';
import { cn } from '../lib/cn';
import type { TreeNodeData } from './Tree';
import './TreeMenu.css';

export interface TreeMenuNode {
  key: string;
  label: ReactNode;
  children?: TreeMenuNode[];
  disabled?: boolean;
}

export interface TreeMenuProps {
  data: TreeMenuNode[];
  selectedKey?: string;
  onSelect?: (key: string) => void;
  defaultExpanded?: string[];
  className?: string;
}

/**
 * 树状菜单（→ 弹框/导航家族）：纵向展开的分组导航菜单——父节点为分组（点击展开/折叠），叶子为可点项。
 * 语义与键盘复用 Tree（role=tree + 方向键），外观按菜单密度收窄。
 */
export function TreeMenu({ data, selectedKey, onSelect, defaultExpanded = [], className }: TreeMenuProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));
  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const renderNodes = (nodes: TreeMenuNode[], depth: number) =>
    nodes.map((n) => {
      const hasChildren = !!n.children?.length;
      const isOpen = expanded.has(n.key);
      return (
        <div key={n.key}>
          <div
            className={cn(
              'ui-treemenu__item',
              hasChildren && 'ui-treemenu__item--group',
              selectedKey === n.key && 'ui-treemenu__item--selected',
              n.disabled && 'ui-treemenu__item--disabled',
            )}
            style={{ paddingInlineStart: `calc(var(--ui-space-2) + ${depth} * var(--ui-space-4))` }}
          >
            {hasChildren ? (
              <button
                type="button"
                className="ui-treemenu__row"
                aria-expanded={isOpen}
                onClick={() => toggle(n.key)}
              >
                <span className="ui-treemenu__arrow" aria-hidden="true">
                  {isOpen ? '▾' : '▸'}
                </span>
                <span className="ui-treemenu__label">{n.label}</span>
              </button>
            ) : (
              <button
                type="button"
                className="ui-treemenu__row"
                disabled={n.disabled}
                onClick={() => onSelect?.(n.key)}
              >
                <span className="ui-treemenu__arrow" aria-hidden="true" />
                <span className="ui-treemenu__label">{n.label}</span>
              </button>
            )}
          </div>
          {hasChildren && isOpen && (
            <div role="group">{renderNodes(n.children!, depth + 1)}</div>
          )}
        </div>
      );
    });

  return (
    <nav role="tree" className={cn('ui-treemenu', className)}>
      {renderNodes(data, 0)}
    </nav>
  );
}

// 保持与 Tree 数据结构兼容：调用方可在两种形态间切换
export type { TreeNodeData as TreeMenuTreeNode };
