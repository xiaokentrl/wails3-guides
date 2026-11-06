import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './OfflineIndicator.css';

export interface OfflineIndicatorProps {
  /** 离线文案 */
  offlineLabel?: string;
  /** 恢复在线的提示文案（自动隐藏） */
  onlineLabel?: string;
  /** 在线提示自动隐藏毫秒数（0 = 不自动隐藏，默认 3000） */
  onlineToastMs?: number;
  /** 渲染为底部固定横幅（默认 true）；false 时返回内联状态供自定义布局 */
  fixed?: boolean;
  className?: string;
}

/**
 * 离线状态指示（→《网络与离线弹性技术方案》UI 层出口）：
 * navigator.onLine + online/offline 事件驱动。离线时常驻横幅；
 * 恢复在线时短暂提示「已恢复连接」后自动隐藏。
 * 待验证：Wails 环境 WebView 对 online/offline 事件的可靠性（项目期用真实断网验证）。
 */
export function OfflineIndicator({ offlineLabel = '当前离线，操作将在恢复连接后同步', onlineLabel = '已恢复连接', onlineToastMs = 3000, fixed = true, className }: OfflineIndicatorProps) {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const toastTimer = useRef(0);

  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      setShowOnlineToast(true);
      window.clearTimeout(toastTimer.current);
      if (onlineToastMs > 0) {
        toastTimer.current = window.setTimeout(() => setShowOnlineToast(false), onlineToastMs);
      }
    };
    const goOffline = () => {
      setOnline(false);
      window.clearTimeout(toastTimer.current);
      setShowOnlineToast(false);
    };
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
      window.clearTimeout(toastTimer.current);
    };
  }, [onlineToastMs]);

  const content = !online ? (
    <div role="status" className={cn('ui-offline', 'ui-offline--offline', fixed && 'ui-offline--fixed', className)}>
      <span className="ui-offline__dot" aria-hidden="true" />
      {offlineLabel}
    </div>
  ) : showOnlineToast ? (
    <div role="status" className={cn('ui-offline', 'ui-offline--online', fixed && 'ui-offline--fixed', className)}>
      <span className="ui-offline__dot" aria-hidden="true" />
      {onlineLabel}
    </div>
  ) : null;

  return content;
}
