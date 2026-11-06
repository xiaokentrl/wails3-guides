import { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import './Layout.css';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  /** 带文字的分隔线（仅水平） */
  label?: string;
}

export function Divider({ orientation = 'horizontal', label, className, ...rest }: DividerProps) {
  if (label) {
    return (
      <div role="separator" className={cn('ui-divider-label', className)} {...rest}>
        <hr className="ui-divider ui-divider--horizontal ui-divider--flex" />
        <span className="ui-divider__label">{label}</span>
        <hr className="ui-divider ui-divider--horizontal ui-divider--flex" />
      </div>
    );
  }
  return (
    <hr
      role="separator"
      aria-orientation={orientation}
      className={cn('ui-divider', `ui-divider--${orientation}`, className)}
      {...rest}
    />
  );
}
