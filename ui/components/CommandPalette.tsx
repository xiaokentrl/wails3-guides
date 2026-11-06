import { ReactNode, useEffect, useMemo, useRef, useState, KeyboardEvent } from 'react';
import { useFocusTrap } from '../lib/useFocusTrap';
import { usePortalContainer } from '../lib/portal';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import './Composite.css';

export interface CommandItem {
  id: string;
  title: string;
  hint?: string;
  run: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  /** 命令清单通常来自命令注册表（→ 菜单方案），此处只消费 */
  commands: CommandItem[];
  placeholder?: string;
}

/** 命令面板（⌘K）：输入过滤、↑↓ 选择、Enter 执行、Escape 关闭。 */
export function CommandPalette({ open, onClose, commands, placeholder = '输入命令…' }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // 接入弹框栈：Escape 只关最上层、滚动锁引用计数、z-index 随栈深（与 Modal/Lightbox 嵌套共存）
  const { zIndex } = useFocusTrap(panelRef, open, onClose);

  // 打开时聚焦输入框（⌘K 面板的第一交互位）
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const container = usePortalContainer('palette');

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
  }, [open]);

  const filtered = useMemo(
    () => commands.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())),
    [commands, query],
  );

  useEffect(() => {
    listRef.current?.querySelectorAll('[role=option]')[active]?.scrollIntoView?.({ block: 'nearest' });
  }, [active, filtered.length]);

  if (!open || !container) return null;

  const run = (i: number) => {
    const c = filtered[i];
    if (!c) return;
    onClose();
    c.run();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(active);
    }
  };

  return createPortal(
    <div
      className="ui-modal__overlay"
      style={{ zIndex: zIndex ?? undefined }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="命令面板" className="ui-palette__panel">
        <input
          ref={inputRef}
          className="ui-palette__input"
          role="combobox"
          aria-expanded="true"
          aria-controls="ui-palette-list"
          aria-autocomplete="list"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKey}
        />
        {filtered.length === 0 ? (
          <div className="ui-palette__empty">没有匹配的命令</div>
        ) : (
          <ul id="ui-palette-list" ref={listRef} role="listbox" aria-label="命令" className="ui-listbox__list ui-palette__list">
            {filtered.map((c, i) => (
              <li
                key={c.id}
                role="option"
                aria-selected={i === active}
                className={cn('ui-menu__item', i === active && 'ui-menu__item--active')}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  run(i);
                }}
              >
                <span className="ui-palette__title">{c.title}</span>
                {c.hint && <span className="ui-palette__hint">{c.hint}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    container,
  );
}

/** 面板内命令行的右对齐提示（如快捷键 Kbd） */
export function CommandHint({ children }: { children: ReactNode }) {
  return <span className="ui-palette__hint">{children}</span>;
}
