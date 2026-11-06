import { ReactNode, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { cn } from '../lib/cn';
import './Listbox.css';
import './Popselect.css';

export interface PopselectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface PopselectProps {
  /** 触发器（任意节点——Popselect 与 SelectListbox 的本质差异：触发器不由组件造） */
  trigger: ReactNode;
  options: PopselectOption[];
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 弹出单选面板（→ Naive UI Popselect）：Popover×Select 的组合件。
 * 与 SelectListbox 的分工：Listbox 自带触发器且键盘全导航；Popselect 触发器任意化、
 * 面板轻键盘（↑↓ + Enter + Escape），适合工具栏里的小选择。
 */
export function Popselect({ trigger, options, value, onChange, placeholder = '请选择', disabled, className }: PopselectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const firstEnabled = options.findIndex((o) => !o.disabled);
    setActive(value ? options.findIndex((o) => o.value === value) : firstEnabled);
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      const onKeyNav = (dir: 1 | -1) => {
        e.preventDefault();
        let i = active;
        do {
          i += dir;
          if (i < 0) i = options.length - 1;
          if (i >= options.length) i = 0;
        } while (options[i]?.disabled && i !== active);
        setActive(i);
      };
      if (e.key === 'ArrowDown') onKeyNav(1);
      else if (e.key === 'ArrowUp') onKeyNav(-1);
      else if (e.key === 'Enter') {
        e.preventDefault();
        const o = options[active];
        if (o && !o.disabled) {
          onChange?.(o.value);
          setOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, active, options, value]);

  const commit = (o: PopselectOption) => {
    if (o.disabled) return;
    onChange?.(o.value);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn('ui-popselect', disabled && 'ui-popselect--disabled', className)}>
      <span
        className="ui-popselect__trigger"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={(e: ReactKeyboardEvent<HTMLSpanElement>) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {trigger}
      </span>
      {open && (
        <ul role="listbox" aria-label={typeof trigger === 'string' ? trigger : '选项'} className="ui-popselect__panel">
          {options.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              aria-disabled={o.disabled || undefined}
              className={cn('ui-listbox__option', 'ui-popselect__option', i === active && 'ui-listbox__option--active', o.value === value && 'ui-listbox__option--selected', o.disabled && 'ui-listbox__option--disabled')}
              onMouseEnter={() => setActive(i)}
              onClick={() => commit(o)}
            >
              {o.label}
            </li>
          ))}
          {options.length === 0 && <li className="ui-popselect__empty">{placeholder}</li>}
        </ul>
      )}
    </div>
  );
}
