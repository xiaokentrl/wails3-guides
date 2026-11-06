import { ReactNode, useMemo, useState } from 'react';
import { cn } from '../lib/cn';
import { SearchInput } from '../components/InputExtra';
import { TreeSelect, type TreeNodeData } from '../components/Tree';
import './OrgSelector.css';

export interface OrgSelectorProps {
  /** 组织树数据 */
  data: TreeNodeData[];
  value?: string;
  onChange: (key: string) => void;
  placeholder?: string;
  /** 面板内搜索：命中节点及其祖先保留 */
  searchable?: boolean;
  className?: string;
}

/** 通用业务组件 · 组织选择器：TreeSelect + 面板内搜索（命中保留祖先链）。 */
export function OrgSelector({ data, value, onChange, placeholder, searchable = true, className }: OrgSelectorProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return data;
    const q = query.trim().toLowerCase();
    // 保留命中节点与其祖先链（children 只保留命中分支）
    const keep = (nodes: TreeNodeData[]): TreeNodeData[] =>
      nodes
        .map((n): TreeNodeData | null => {
          const children = n.children ? keep(n.children) : undefined;
          const selfHit = String(n.label).toLowerCase().includes(q);
          if (selfHit || (children && children.length > 0)) {
            return { ...n, children: children && children.length > 0 ? children : n.children };
          }
          return null;
        })
        .filter((n): n is TreeNodeData => n !== null);
    return keep(data);
  }, [data, query, searchable]);

  return (
    <div className={cn('ui-orgselect', className)}>
      <TreeSelect data={filtered} value={value} onChange={onChange} placeholder={placeholder} />
      {searchable && (
        <div className="ui-orgselect__search">
          <SearchInput
            aria-label="搜索组织"
            placeholder="搜索…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {searchable && query && filtered.length === 0 && (
            <p className="ui-orgselect__empty">没有匹配的组织（{childrenCount(data)} 个节点已过滤）</p>
          )}
        </div>
      )}
    </div>
  );
}

function childrenCount(nodes: TreeNodeData[]): number {
  return nodes.reduce((s, n) => s + 1 + (n.children ? childrenCount(n.children) : 0), 0);
}

export type { TreeNodeData as OrgTreeNode };
export function OrgSelectorFooter({ children }: { children: ReactNode }) {
  return <div className="ui-orgselect__footer">{children}</div>;
}
