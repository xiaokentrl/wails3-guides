import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { cn } from '../lib/cn';
import './Listbox.css';
import './MultiSelect.css';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  value: string[];
  onChange: (v: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  /** 触发器最多直显的 tag 数，超出折叠为 +N（默认 2） */
  maxTags?: number;
  /** 面板底部是否显示全选/清空（默认显示） */
  showSelectAll?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * 下拉多选框：触发器以 tag 回显选中（超出 maxTags 折叠 +N，tag 可单独移除），
 * 面板为 checkbox listbox——点击/空格/回车切换，↑↓/Home/End 导航，Escape 关闭。
 * 外部点击关闭；禁用项跳过全选；长列表窗口化（>60 项，→ SelectListbox 同一模式）。
 */
export function MultiSelect({ value, onChange, options, placeholder = '请选择', maxTags = 2, showSelectAll = true, disabled, className }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [scrollTop, setScrollTop] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const selectedSet = new Set(value);
  const enabled = options.filter((o) => !o.disabled);
  const allChecked = enabled.length > 0 && enabled.every((o) => selectedSet.has(o.value));
  const someChecked = enabled.some((o) => selectedSet.has(o.value));
  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;
  const visible = value.slice(0, maxTags);
  const overflow = value.length - visible.length;

  // 长列表窗口化（→ SelectListbox 同一模式）
  const ROW = 32;
  const VIEW = 240;
  const OVER = 6;
  const windowed = options.length > 60;
  const winStart = windowed ? Math.max(0, Math.floor(scrollTop / ROW) - OVER) : 0;
  const winEnd = windowed ? Math.min(options.length, winStart + Math.ceil(VIEW / ROW) + OVER * 2) : options.length;

  const openList = () => {
    if (disabled) return;
    setOpen(true);
    const firstEnabled = options.findIndex((o) => !o.disabled);
    setActive(value.length > 0 ? options.findIndex((o) => o.value === value[0]) : firstEnabled);
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

  const toggle = (v: string) => {
    const next = selectedSet.has(v) ? value.filter((x) => x !== v) : [...value, v];
    onChange(next);
  };

  const toggleAll = () => {
    onChange(allChecked ? value.filter((v) => !selectedSet.has(v) || options.find((o) => o.value === v)?.disabled) : enabled.map((o) => o.value));
  };

  const removeTag = (v: string) => {
    onChange(value.filter((x) => x !== v));
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
      setActive(options.findIndex((o) => !o.disabled));
    } else if (e.key === 'End') {
      e.preventDefault();
      for (let i = options.length - 1; i >= 0; i--) {
        if (!options[i].disabled) {
          setActive(i);
          break;
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const o = options[active];
      if (o && !o.disabled) toggle(o.value);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn('ui-multiselect', disabled && 'ui-multiselect--disabled', className)}>
      <button
        ref={triggerRef}
        type="button"
        className={cn('ui-listbox__trigger', 'ui-multiselect__trigger', value.length === 0 && 'ui-listbox__trigger--placeholder')}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={value.length > 0 ? `已选 ${value.length} 项` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e: KeyboardEvent) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            openList();
          }
        }}
      >
        {value.length === 0 ? (
          <span className="ui-listbox__placeholder">{placeholder}</span>
        ) : (
          <span className="ui-multiselect__tags">
            {visible.map((v) => (
              <span
                key={v}
                className="ui-multiselect__tag"
                role="button"
                tabIndex={-1}
                aria-label={`移除 ${labelOf(v)}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(v);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    removeTag(v);
                  }
                }}
              >
                {labelOf(v)}
                <span className="ui-multiselect__tag-x" aria-hidden="true">×</span>
              </span>
            ))}
            {overflow > 0 && <span className="ui-multiselect__more">+{overflow}</span>}
          </span>
        )}
        <span className="ui-listbox__arrow" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div className="ui-multiselect__panel">
          <ul
            ref={listRef}
            role="listbox"
            aria-multiselectable="true"
            tabIndex={-1}
            className="ui-listbox__list ui-multiselect__list"
            onKeyDown={onListKey}
            onScroll={windowed ? (e) => setScrollTop(e.currentTarget.scrollTop) : undefined}
          >
            <div style={windowed ? { height: options.length * ROW, position: 'relative' } : undefined}>
              {options.slice(winStart, winEnd).map((o, k) => {
                const i = winStart + k;
                const checked = selectedSet.has(o.value);
                return (
                  <li
                    key={o.value}
                    ref={(el) => {
                      optionRefs.current[i] = el;
                    }}
                    role="option"
                    aria-selected={checked}
                    aria-disabled={o.disabled || undefined}
                    className={cn('ui-listbox__option', 'ui-multiselect__option', i === active && 'ui-listbox__option--active', checked && 'ui-listbox__option--selected', o.disabled && 'ui-listbox__option--disabled')}
                    style={windowed ? { position: 'absolute', top: i * ROW, left: 0, right: 0, height: ROW, lineHeight: `${ROW - 8}px` } : undefined}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => !o.disabled && toggle(o.value)}
                  >
                    <span className={cn('ui-multiselect__checkbox', checked && 'ui-multiselect__checkbox--checked')} aria-hidden="true" />
                    <span className="ui-multiselect__label">{o.label}</span>
                  </li>
                );
              })}
            </div>
          </ul>
          {showSelectAll && (
            <div className="ui-multiselect__footer">
              <button type="button" className="ui-multiselect__footer-btn" onClick={toggleAll}>
                {allChecked ? '清空' : someChecked ? '全选（部分已选）' : '全选'}
              </button>
              <span className="ui-multiselect__count">已选 {value.length}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
