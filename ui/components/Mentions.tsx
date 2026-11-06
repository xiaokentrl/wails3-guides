import { ReactNode, useEffect, useRef, useState, KeyboardEvent } from 'react';
import { cn } from '../lib/cn';
import './Mentions.css';

export interface MentionUser {
  id: string;
  name: string;
}

export interface MentionsProps {
  value: string;
  onChange: (v: string) => void;
  users: MentionUser[];
  placeholder?: string;
  /** 触发字符（默认 @） */
  trigger?: string;
  /** 渲染已选中的 mention 为可点击标签 */
  renderMention?: (userId: string) => ReactNode;
  className?: string;
}

/**
 * @提及输入框（→ 输入验证方案：mention ID 由调用方解析）。
 * 输入 trigger 字符后弹出用户列表，↑↓ 选择、Enter 确认、Escape 关闭。
 */
export function Mentions({ value, onChange, users, placeholder = '输入 @ 提及…', trigger = '@', className }: MentionsProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [anchorPos, setAnchorPos] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const candidates = users.filter(
    (u) => query && u.name.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const detectTrigger = (text: string, pos: number) => {
    const before = text.slice(0, pos);
    const idx = before.lastIndexOf(trigger);
    if (idx < 0) return null;
    const q = before.slice(idx + trigger.length);
    return { idx, query: q };
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    onChange(v);
    const pos = e.target.selectionStart ?? v.length;
    const t = detectTrigger(v, pos);
    if (t) {
      setQuery(t.query);
      setOpen(true);
      setActive(0);
      setAnchorPos(t.idx);
    } else {
      setOpen(false);
    }
  };

  const selectUser = (u: MentionUser) => {
    if (anchorPos < 0) return;
    const before = value.slice(0, anchorPos);
    const after = value.slice(anchorPos + trigger.length + query.length);
    onChange(`${before}${trigger}${u.name} ${after}`);
    setOpen(false);
    setQuery('');
    setAnchorPos(-1);
    inputRef.current?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!open || candidates.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, candidates.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); selectUser(candidates[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div ref={rootRef} className={cn('ui-mentions', className)}>
      <textarea
        ref={inputRef}
        className="ui-mentions__input"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={onKey}
      />
      {open && candidates.length > 0 && (
        <ul className="ui-mentions__panel" role="listbox">
          {candidates.map((u, i) => (
            <li
              key={u.id}
              role="option"
              aria-selected={i === active}
              className={cn('ui-mentions__option', i === active && 'ui-mentions__option--active')}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => { e.preventDefault(); selectUser(u); }}
            >
              {u.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
