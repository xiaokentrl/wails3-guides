import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { cn } from '../lib/cn';
import './Listbox.css';

export interface ListboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * 自绘下拉选择（listbox 版）：完整键盘导航——
 * Enter/Space 开、↑↓ 移动（跳过禁用）、Home/End、Enter 选中、Escape 关闭并归还焦点、Tab 关闭。
 * 外部点击关闭；aria-haspopup=listbox + aria-expanded + role=listbox/option。
 */
export function SelectListbox({
  value,
  onChange,
  options,
  placeholder = '请选择',
  disabled,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: ListboxOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [scrollTop, setScrollTop] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  // 长列表窗口化：>60 项时只渲染可视窗口（→ 性能方案大数据量渲染）
  const ROW = 32;
  const VIEW = 240;
  const OVER = 6;
  const windowed = options.length > 60;
  const winStart = windowed ? Math.max(0, Math.floor(scrollTop / ROW) - OVER) : 0;
  const winEnd = windowed ? Math.min(options.length, winStart + Math.ceil(VIEW / ROW) + OVER * 2) : options.length;

  const selected = options.find((o) => o.value === value);
  const enabledIdx = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    const cur = options.findIndex((o) => o.value === value);
    setActive(cur >= 0 ? cur : (enabledIdx[0] ?? -1));
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) listRef.current.focus();
  }, [open]);

  useEffect(() => {
    optionRefs.current[active]?.scrollIntoView?.({ block: 'nearest' });
  }, [active]);

  const commit = (i: number) => {
    const o = options[i];
    if (!o || o.disabled) return;
    onChange(o.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const move = (e: KeyboardEvent, dir: 1 | -1) => {
    e.preventDefault();
    let i = active;
    do {
      i += dir;
      if (i < 0) i = options.length - 1;
      if (i >= options.length) i = 0;
    } while (options[i]?.disabled && i !== active);
    setActive(i);
  };

  const onListKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') move(e, 1);
    else if (e.key === 'ArrowUp') move(e, -1);
    else if (e.key === 'Home') {
      e.preventDefault();
      setActive(enabledIdx[0] ?? -1);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(enabledIdx[enabledIdx.length - 1] ?? -1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      commit(active);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn('ui-listbox', className)}>
      <button
        ref={triggerRef}
        type="button"
        className={cn('ui-listbox__trigger', !selected && 'ui-listbox__trigger--placeholder')}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e: KeyboardEvent) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            openList();
          }
        }}
      >
        {selected ? selected.label : <span className="ui-listbox__placeholder">{placeholder}</span>}
        <span className="ui-listbox__arrow" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="ui-listbox__list"
          onKeyDown={onListKey}
          onScroll={windowed ? (e) => setScrollTop(e.currentTarget.scrollTop) : undefined}
        >
          <div style={windowed ? { height: options.length * ROW, position: 'relative' } : undefined}>
            {options.slice(winStart, winEnd).map((o, k) => {
              const i = winStart + k;
              return (
                <li
                  key={o.value}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  role="option"
                  aria-selected={o.value === value}
                  aria-disabled={o.disabled || undefined}
                  className={cn('ui-listbox__option', i === active && 'ui-listbox__option--active', o.value === value && 'ui-listbox__option--selected', o.disabled && 'ui-listbox__option--disabled')}
                  style={windowed ? { position: 'absolute', top: i * ROW, left: 0, right: 0, height: ROW, lineHeight: `${ROW - 8}px` } : undefined}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => commit(i)}
                >
                  {o.label}
                </li>
              );
            })}
          </div>
        </ul>
      )}
    </div>
  );
}
