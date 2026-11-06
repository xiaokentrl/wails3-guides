import { ReactNode, useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import './Banner.css';

export interface BannerProps {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  children: ReactNode;
  /** 操作区（右侧按钮组） */
  action?: ReactNode;
  /** 可关闭 */
  closable?: boolean;
  onClose?: () => void;
  /** 是否默认关闭（受控关闭由调用方管理） */
  defaultOpen?: boolean;
  className?: string;
}

/** 页级横幅（与 Alert 的区别：Alert 是内容流内的局部提示，Banner 是页面顶部的全局通告）。 */
export function Banner({ tone = 'info', children, action, closable, onClose, defaultOpen = true, className }: BannerProps) {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => { setOpen(defaultOpen); }, [defaultOpen]);
  if (!open) return null;
  return (
    <div className={cn('ui-banner', `ui-banner--${tone}`, className)} role="status">
      <div className="ui-banner__body">{children}</div>
      {action && <div className="ui-banner__action">{action}</div>}
      {closable && (
        <button type="button" className="ui-banner__close" aria-label="关闭" onClick={() => { setOpen(false); onClose?.(); }}>
          ×
        </button>
      )}
    </div>
  );
}
