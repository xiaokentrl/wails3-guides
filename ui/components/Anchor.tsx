import { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Anchor.css';

export interface AnchorItem {
  id: string;
  label: ReactNode;
  children?: AnchorItem[];
}

export interface AnchorProps {
  items: AnchorItem[];
  /** 当前激活的锚点 id */
  activeId?: string;
  onClick?: (id: string) => void;
  className?: string;
}

/** 锚点导航（scroll spy 需调用方接线 IntersectionObserver，此处提供 UI 结构）。 */
export function Anchor({ items, activeId, onClick, className }: AnchorProps) {
  const renderItems = (nodes: AnchorItem[], depth: number) =>
    nodes.map((n) => (
      <div key={n.id}>
        <button
          type="button"
          className={cn('ui-anchor__link', depth > 0 && `ui-anchor__link--depth${depth}`, activeId === n.id && 'ui-anchor__link--active')}
          onClick={() => onClick?.(n.id)}
        >
          {n.label}
        </button>
        {n.children && renderItems(n.children, depth + 1)}
      </div>
    ));
  return <nav aria-label="锚点导航" className={cn('ui-anchor', className)}>{renderItems(items, 0)}</nav>;
}
