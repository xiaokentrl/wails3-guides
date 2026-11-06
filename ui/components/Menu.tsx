import { ReactNode, useEffect, useRef, useState, KeyboardEvent } from 'react';
import { cn } from '../lib/cn';
import './Listbox.css';

export interface MenuItem {
  key: string;
  label: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

/** 分隔线 / 分组标题：键盘导航自动跳过，仅 DropdownMenu 支持 */
export type MenuEntry = MenuItem | { key: string; type: 'separator' } | { key: string; type: 'group'; label: ReactNode };

const isItem = (e: MenuEntry): e is MenuItem => 'onSelect' in e;

/**
 * 菜单键盘导航（DropdownMenu / ContextMenu 共用内部逻辑）：
 * ↑↓ 循环、Enter 选中、Escape 关闭、Home/End。
 */
function useMenuNav(close: () => void, count: number) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    listRef.current?.focus();
  }, []);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % count);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + count) % count);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(count - 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      close();
    }
  };
  return { active, setActive, onKey, listRef };
}

/** 下拉菜单：trigger 点击开合、light dismiss、aria-haspopup=menu。 */
export function DropdownMenu({ trigger, items, className }: { trigger: ReactNode; items: MenuEntry[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemIdx = items.flatMap((e, i) => (isItem(e) && !e.disabled ? [i] : []));
  const nav = useMenuNav(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, itemIdx.length);
  // 落点校正：active 映射到分隔线/分组标题时推进到相邻可选条目
  const onKey = (e: KeyboardEvent) => {
    nav.onKey(e);
    const mapped = itemIdx[nav.active] ?? -1;
    if (mapped === -1 && itemIdx.length > 0) {
      const next = itemIdx.find((i) => i > (nav.active * items.length) / Math.max(itemIdx.length, 1));
      const target = next ?? itemIdx[itemIdx.length - 1];
      setActive(itemIdx.indexOf(target));
    }
  };
  const { active, setActive, listRef } = nav;

  // 长菜单窗口化（→ SelectListbox 同一模式，>60 项自动启用）
  const ROW = 32;
  const VIEW = 240;
  const OVER = 6;
  const windowed = items.length > 60;
  const winStart = windowed ? Math.max(0, Math.floor(scrollTop / ROW) - OVER) : 0;
  const winEnd = windowed ? Math.min(items.length, winStart + Math.ceil(VIEW / ROW) + OVER * 2) : items.length;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // 键盘目标映射：active（可选序号）→ items 索引
  const activeItemIdx = itemIdx[active] ?? -1;

  return (
    <div ref={rootRef} className={cn('ui-listbox', className)}>
      <button
        ref={triggerRef}
        type="button"
        className="ui-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {trigger}
      </button>
      {open && (
        <ul
          ref={listRef}
          role="menu"
          tabIndex={-1}
          className="ui-listbox__list ui-menu__list"
          onKeyDown={onKey}
          onScroll={windowed ? (e) => setScrollTop(e.currentTarget.scrollTop) : undefined}
        >
          <div style={windowed ? { height: items.length * ROW, position: 'relative' } : undefined}>
            {items.slice(winStart, winEnd).map((e, k) => {
              const i = winStart + k;
              if ('type' in e) {
                if (e.type === 'separator') {
                  return <li key={e.key} role="separator" className="ui-menu__sep" style={windowed ? { position: 'absolute', top: i * ROW, left: 0, right: 0 } : undefined} />;
                }
                return (
                  <li key={e.key} role="presentation" className="ui-menu__group-label" style={windowed ? { position: 'absolute', top: i * ROW, left: 0, right: 0 } : undefined}>
                    {e.label}
                  </li>
                );
              }
              return (
                <li key={e.key} role="none" style={windowed ? { position: 'absolute', top: i * ROW, left: 0, right: 0 } : undefined}>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={e.disabled}
                    className={cn('ui-menu__item', i === activeItemIdx && 'ui-menu__item--active', e.danger && 'ui-menu__item--danger')}
                    onMouseEnter={() => setActive(itemIdx.indexOf(i))}
                    onClick={() => {
                      e.onSelect();
                      setOpen(false);
                    }}
                  >
                    {e.label}
                  </button>
                </li>
              );
            })}
          </div>
        </ul>
      )}
    </div>
  );
}

/** 右键菜单：contextmenu 事件在光标处打开（fixed 定位），选外即关。 */
export function ContextMenu({ items, children, className }: { items: MenuItem[]; children: ReactNode; className?: string }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const { active, setActive, onKey, listRef } = useMenuNav(() => setPos(null), items.length);

  useEffect(() => {
    if (!pos) return;
    const onDown = () => setPos(null);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('scroll', onDown, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('scroll', onDown, true);
    };
  }, [pos]);

  return (
    <div
      ref={rootRef}
      className={cn('ui-contextmenu', className)}
      onContextMenu={(e) => {
        e.preventDefault();
        // 视口钳制：菜单宽高近似值，贴边不溢出（→ 弹框横切机制）
        const W = 180, H = Math.min(items.length * 32 + 8, 260);
        setPos({
          x: Math.min(e.clientX, window.innerWidth - W - 8),
          y: Math.min(e.clientY, window.innerHeight - H - 8),
        });
      }}
    >
      {children}
      {pos && (
        <ul
          ref={listRef}
          role="menu"
          tabIndex={-1}
          className="ui-listbox__list ui-menu__list ui-contextmenu__panel"
          style={{ left: pos.x, top: pos.y }}
          onKeyDown={onKey}
        >
          {items.map((it, i) => (
            <li key={it.key} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={it.disabled}
                className={cn('ui-menu__item', i === active && 'ui-menu__item--active', it.danger && 'ui-menu__item--danger')}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  it.onSelect();
                  setPos(null);
                }}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
