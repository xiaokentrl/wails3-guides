import { useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import { formatDate, formatRelative } from '../lib/format';
import './Time.css';

export interface TimeProps {
  /** 时间（Date 或时间戳） */
  value: Date | number;
  /** relative = 相对时间（3 分钟前）；datetime = 绝对时间 */
  format?: 'relative' | 'datetime';
  /** 自动刷新毫秒数（0 = 不刷新；relative 场景建议 30000） */
  autoRefreshMs?: number;
  className?: string;
}

/**
 * 时间展示（→ Naive UI Time）：相对/绝对两种形态。
 * 相对态 hover 有绝对时间兜底（title）；autoRefreshMs 让"x 分钟前"自己长大。
 * 语境规则（→ 格式化与货币本地化方案）：全部走 lib/format 的 FormatContext。
 */
export function Time({ value, format = 'relative', autoRefreshMs = 0, className }: TimeProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (autoRefreshMs <= 0) return;
    const t = window.setInterval(() => setTick((n) => n + 1), autoRefreshMs);
    return () => window.clearInterval(t);
  }, [autoRefreshMs]);

  const date = value instanceof Date ? value : new Date(value);
  const text = format === 'relative' ? formatRelative(date) : formatDate(date, 'datetime');

  return (
    <time dateTime={date.toISOString()} title={formatDate(date, 'datetime')} className={cn('ui-time', className)}>
      {text}
    </time>
  );
}
