import { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Feedback.css';

export interface AlertProps {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  title?: ReactNode;
  children: ReactNode;
  /** 页内常驻横幅（→ 操作反馈层级路由：随流渲染，非浮层） */
  className?: string;
}

/** 页内提示横幅。danger 场景须配下一步动作（失败三件套 → 操作反馈方案）。 */
export function Alert({ tone = 'info', title, children, className }: AlertProps) {
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cn('ui-alert', `ui-alert--${tone}`, className)}>
      {title && <div className="ui-alert__title">{title}</div>}
      <div className="ui-alert__body">{children}</div>
    </div>
  );
}

export interface ResultProps {
  status: 'success' | 'error' | 'empty';
  title: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  className?: string;
}

/** 全页结果页（操作完成 / 失败终态）。error 必须带 extra 恢复入口。 */
export function Result({ status, title, description, extra, className }: ResultProps) {
  return (
    <div className={cn('ui-result', `ui-result--${status}`, className)}>
      <div className="ui-result__icon" aria-hidden="true">
        {status === 'success' ? '✓' : status === 'error' ? '✕' : '···'}
      </div>
      <h2 className="ui-result__title">{title}</h2>
      {description && <div className="ui-result__desc">{description}</div>}
      {extra && <div className="ui-result__extra">{extra}</div>}
    </div>
  );
}
