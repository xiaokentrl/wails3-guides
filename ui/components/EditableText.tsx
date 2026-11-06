import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './EditableText.css';

export interface EditableTextProps {
  value: string;
  onChange: (v: string) => void;
  /** 多行模式（textarea） */
  multiline?: boolean;
  maxLength?: number;
  placeholder?: string;
  /** 提交前校验：返回错误文案则阻止提交 */
  validate?: (v: string) => string | null;
  /** 是否可编辑（false 时退化为纯文本展示） */
  editable?: boolean;
  /** 空值占位 */
  className?: string;
}

/**
 * 行内编辑文本（click-to-edit）：展示态点击进入编辑态，Enter 提交、Escape 取消、失焦提交。
 * IME 纪律：组合态（compositionstart→compositionend 之间）Enter 不触发提交（→ 库铁律「IME 组合态不改写」）。
 * 校验失败显示错误且不退出编辑态。
 */
export function EditableText({ value, onChange, multiline, maxLength, placeholder = '点击编辑', validate, editable = true, className }: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const composingRef = useRef(false);

  useEffect(() => {
    if (editing) {
      setDraft(value);
      setError(null);
      // 等 DOM 挂载后聚焦并全选（覆盖式修改的第一动作位）
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [editing, value]);

  const start = () => {
    if (!editable) return;
    setEditing(true);
  };

  const commit = () => {
    const trimmed = draft;
    const err = validate?.(trimmed) ?? null;
    if (err) {
      setError(err);
      return;
    }
    if (trimmed !== value) onChange(trimmed);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setError(null);
    setEditing(false);
  };

  if (editing) {
    const common = {
      ref: inputRef as never,
      value: draft,
      maxLength,
      'aria-label': '编辑文本',
      'aria-invalid': error ? true : undefined,
      onChange: (e: { target: { value: string } }) => setDraft(e.target.value),
      onCompositionStart: () => {
        composingRef.current = true;
      },
      onCompositionEnd: () => {
        composingRef.current = false;
      },
      onBlur: commit,
    };
    return (
      <span className={cn('ui-editable', 'ui-editable--editing', className)}>
        {multiline ? (
          <textarea
            {...common}
            className={cn('ui-editable__input', 'ui-editable__input--area', error && 'ui-editable__input--error')}
            rows={3}
            onKeyDown={(e) => {
              // 多行：Enter 换行不提交；Escape 仍取消
              if (e.key === 'Escape') {
                e.preventDefault();
                cancel();
              }
            }}
          />
        ) : (
          <input
            {...common}
            type="text"
            className={cn('ui-editable__input', error && 'ui-editable__input--error')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !composingRef.current) {
                e.preventDefault();
                commit();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                cancel();
              }
            }}
          />
        )}
        {error && (
          <span role="alert" className="ui-editable__error">
            {error}
          </span>
        )}
      </span>
    );
  }

  return (
    <span
      className={cn('ui-editable', editable && 'ui-editable--clickable', className)}
      onClick={start}
      onKeyDown={(e) => {
        if (editable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          start();
        }
      }}
      role={editable ? 'button' : undefined}
      tabIndex={editable ? 0 : undefined}
      aria-label={editable ? `编辑：${value || placeholder}` : undefined}
    >
      {value || <span className="ui-editable__placeholder">{placeholder}</span>}
      {editable && (
        <span className="ui-editable__pen" aria-hidden="true">
          ✎
        </span>
      )}
    </span>
  );
}
