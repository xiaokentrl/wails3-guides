import { KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './Nav.css';

export interface TabItem {
  key: string;
  label: ReactNode;
  disabled?: boolean;
  /** editable 模式下显示关闭钮（默认 true；守卫页签设 false） */
  closable?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  /** 受控切换回调；不传则为非受控 */
  onChange?: (key: string) => void;
  /** 可编辑卡片型：页签显示关闭钮 */
  editable?: boolean;
  /** 新增页签（提供即渲染 + 把手；items 增删由调用方管理） */
  onAdd?: () => void;
  /** 关闭页签（调用方负责从 items 移除；关当前页时建议把激活切到相邻项） */
  onClose?: (key: string) => void;
  className?: string;
}

/**
 * 标签页。tablist 语义 + roving tabindex（→ 无障碍方案）：
 * ←→ 在标签间移动焦点并切换（跳过禁用项）、Home/End 跳首尾。
 */
export function Tabs({ items, activeKey, onChange, editable, onAdd, onClose, className }: TabsProps) {
  const [inner, setInner] = useState(items[0]?.key);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const current = activeKey ?? inner;

  // 溢出滚动：标签总宽超容器时显示 ‹ › 滚动按钮
  const [overflow, setOverflow] = useState<'none' | 'left' | 'right' | 'both'>('none');
  useEffect(() => {
    const update = () => {
      const el = listRef.current;
      if (!el) return;
      const canL = el.scrollLeft > 1;
      const canR = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      setOverflow(canL && canR ? 'both' : canL ? 'left' : canR ? 'right' : 'none');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [items]);
  const scrollTabs = (dir: 1 | -1) => listRef.current?.scrollBy({ left: dir * 160, behavior: 'smooth' });

  const activate = (key: string) => {
    setInner(key);
    onChange?.(key);
  };

  const onTablistKey = (e: KeyboardEvent) => {
    const idx = items.findIndex((it) => it.key === current);
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % items.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + items.length) % items.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = items.length - 1;
    else return;
    e.preventDefault();
    const it = items[next];
    if (it.disabled) return;
    activate(it.key);
    refs.current[next]?.focus();
  };

  return (
    <div className={cn('ui-tabs', `ui-tabs--overflow-${overflow}`, className)}>
      {overflow !== 'none' && overflow !== 'right' && (
        <button type="button" className="ui-tabs__navbtn" aria-label="向左滚动" onClick={() => scrollTabs(-1)}>
          ‹
        </button>
      )}
      <div ref={listRef} role="tablist" className="ui-tabs__list" onKeyDown={onTablistKey}>
        {items.map((it, i) => (
          <button
            key={it.key}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={current === it.key}
            tabIndex={current === it.key ? 0 : -1}
            disabled={it.disabled}
            className={cn('ui-tabs__tab', current === it.key && 'ui-tabs__tab--active')}
            onClick={() => activate(it.key)}
          >
            {it.label}
            {editable && it.closable !== false && (
              <span
                role="button"
                tabIndex={-1}
                aria-label={`关闭 ${typeof it.label === 'string' ? it.label : '页签'}`}
                className="ui-tabs__close"
                onClick={(e) => {
                  e.stopPropagation(); // 关闭 ≠ 激活
                  onClose?.(it.key);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.stopPropagation();
                    onClose?.(it.key);
                  }
                }}
              >
                ×
              </span>
            )}
          </button>
        ))}
      </div>
      {overflow !== 'none' && overflow !== 'left' && (
        <button type="button" className="ui-tabs__navbtn" aria-label="向右滚动" onClick={() => scrollTabs(1)}>
          ›
        </button>
      )}
      {editable && onAdd && (
        <button type="button" className="ui-tabs__add" aria-label="新增页签" onClick={onAdd}>
          +
        </button>
      )}
    </div>
  );
}

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="面包屑" className={cn('ui-breadcrumb', className)}>
      {items.map((it, i) => (
        <span key={i} className="ui-breadcrumb__item">
          {i > 0 && (
            <span className="ui-breadcrumb__sep" aria-hidden="true">
              /
            </span>
          )}
          {it.href || it.onClick ? (
            <a className="ui-breadcrumb__link" href={it.href ?? '#'} onClick={it.onClick}>
              {it.label}
            </a>
          ) : (
            <span className="ui-breadcrumb__current" aria-current={i === items.length - 1 ? 'page' : undefined}>
              {it.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  className?: string;
}

function pageList(current: number, pages: number): (number | '…')[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const out: (number | '…')[] = [1];
  if (current > 3) out.push('…');
  for (let p = Math.max(2, current - 1); p <= Math.min(pages - 1, current + 1); p++) out.push(p);
  if (current < pages - 2) out.push('…');
  out.push(pages);
  return out;
}

export function Pagination({ current, total, pageSize, onChange, className }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const prev = () => onChange(Math.max(1, current - 1));
  const next = () => onChange(Math.min(pages, current + 1));
  return (
    <nav aria-label="分页" className={cn('ui-pagination', className)}>
      <button type="button" className="ui-pagination__btn" disabled={current <= 1} onClick={prev} aria-label="上一页">
        ‹
      </button>
      {pageList(current, pages).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="ui-pagination__ellipsis">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={cn('ui-pagination__btn', p === current && 'ui-pagination__btn--active')}
            aria-current={p === current ? 'page' : undefined}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className="ui-pagination__btn" disabled={current >= pages} onClick={next} aria-label="下一页">
        ›
      </button>
    </nav>
  );
}

export interface StepsProps {
  steps: string[];
  /** 当前进行到的步骤（0 起；完成的是 < current） */
  current: number;
  className?: string;
}

export function Steps({ steps, current, className }: StepsProps) {
  return (
    <ol className={cn('ui-steps', className)}>
      {steps.map((s, i) => (
        <li
          key={s}
          className={cn('ui-steps__item', i < current && 'ui-steps__item--done', i === current && 'ui-steps__item--active')}
          aria-current={i === current ? 'step' : undefined}
        >
          <span className="ui-steps__dot">{i < current ? '✓' : i + 1}</span>
          <span className="ui-steps__label">{s}</span>
        </li>
      ))}
    </ol>
  );
}

export interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  return (
    <div role="radiogroup" className={cn('ui-segmented', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          className={cn('ui-segmented__item', o.value === value && 'ui-segmented__item--active')}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
