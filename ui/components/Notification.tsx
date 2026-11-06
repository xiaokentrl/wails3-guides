import { ReactNode, useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import './Notification.css';

export interface NotificationCardProps {
  title: ReactNode;
  description?: ReactNode;
  /** 角标类型 */
  tone?: 'info' | 'success' | 'warning' | 'danger';
  /** 自动关闭毫秒数（0 = 不自动关） */
  duration?: number;
  onClose?: () => void;
  className?: string;
}

/** 角落通知卡片（与 Toast 的区别：Toast 是短消息流，Notification 是需要用户关注的卡片）。 */
export function NotificationCard({ title, description, tone = 'info', duration = 0, onClose, className }: NotificationCardProps) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (duration > 0) {
      const t = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(t);
    }
  }, [duration]);
  if (!visible) return null;
  return (
    <div className={cn('ui-notification', `ui-notification--${tone}`, className)} role="alert">
      <div className="ui-notification__title">{title}</div>
      {description && <div className="ui-notification__desc">{description}</div>}
      {onClose && (
        <button type="button" className="ui-notification__close" aria-label="关闭" onClick={() => { setVisible(false); onClose(); }}>
          ×
        </button>
      )}
    </div>
  );
}

/** 角落通知容器（固定在右上角，多个通知垂直排列）。 */
export function NotificationArea({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('ui-notification-area', className)}>{children}</div>;
}
