import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import './IconButton.css';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 必填：读屏播报文本（纯图标按钮没有可见文字，label 就是它的名称） */
  label: string;
  variant?: 'secondary' | 'ghost';
}

/** 图标按钮。label 必填是无障碍硬约束，编译期由类型强制。 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = 'ghost', className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={rest.type ?? 'button'}
      aria-label={label}
      title={label}
      className={cn('ui-icon-button', `ui-icon-button--${variant}`, className)}
      {...rest}
    >
      {children}
    </button>
  );
});
