import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { cn } from '../lib/cn';
import './Listbox.css';

/**
 * 自动完成（combobox）：输入过滤 + 方向键选择 + Enter 提交。
 * role=combobox + aria-expanded + aria-controls + aria-autocomplete=list；
 * 选中回填后关闭；IME 安全：过滤在 onChange 自然进行，不做组合态改写。
 */
export function AutoComplete({
  value,
  onChange,
  options,
  onSelect,
  placeholder = '输入以筛选…',
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  onSelect?: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) => o.toLowerCase().includes(value.toLowerCase()) && o !== value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    setActive(-1);
  }, [value]);

  const select = (v: string) => {
    onChange(v);
    onSelect?.(v);
    setOpen(false);
    inputRef.current?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && filtered.length > 0) {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp' && open) {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && active >= 0 && filtered[active]) {
        e.preventDefault();
        select(filtered[active]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn('ui-listbox', className)}>
      <input
        ref={inputRef}
        role="combobox"
        aria-expanded={open && filtered.length > 0}
        aria-controls="ui-autocomplete-list"
        aria-autocomplete="list"
        className="ui-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onKeyDown={onKey}
        onFocus={() => value && setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <ul id="ui-autocomplete-list" role="listbox" className="ui-listbox__list">
          {filtered.map((o, i) => (
            <li
              key={o}
              role="option"
              aria-selected={i === active}
              className={cn('ui-listbox__option', i === active && 'ui-listbox__option--active')}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                select(o);
              }}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
