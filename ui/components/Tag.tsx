import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Tag.css';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  closable?: boolean;
  onClose?: () => void;
  tone?: 'neutral' | 'primary';
}

/** 可关闭标签。关闭是显式动作（→ 操作反馈矩阵登记）。 */
export function Tag({ closable, onClose, tone = 'neutral', className, children, ...rest }: TagProps) {
  return (
    <span className={cn('ui-tag', `ui-tag--${tone}`, className)} {...rest}>
      <span className="ui-tag__text">{children as ReactNode}</span>
      {closable && (
        <button
          type="button"
          className="ui-tag__close"
          aria-label="移除"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}

export interface CheckableTagProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

/** 可勾选标签（→ antd CheckableTag）：筛选芯片的独立形态；多枚互斥/多选用 ToggleGroup。 */
export function CheckableTag({ checked, onChange, disabled, children, className }: CheckableTagProps) {
  return (
    <button
      type="button"
      className={cn('ui-tag', 'ui-tag--checkable', checked && 'ui-tag--checked', disabled && 'ui-tag--checkable-disabled', className)}
      aria-pressed={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
    >
      {children}
    </button>
  );
}
