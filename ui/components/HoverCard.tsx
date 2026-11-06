import { ReactElement, ReactNode, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './Tooltip.css';

export interface HoverCardProps {
  /** 卡片内容（富内容：头像+描述+链接） */
  content: ReactNode;
  /** 单一可聚焦触发元素 */
  children: ReactElement;
  side?: 'top' | 'bottom';
  className?: string;
}

/**
 * 悬停卡片：Tooltip 的富内容版。hover/焦点显示（键盘可达）、Escape 隐藏。
 * 定位翻转：打开时实测视口剩余空间，默认侧放不下自动换另一侧。
 */
export function HoverCard({ content, children, side = 'top', className }: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const [actualSide, setActualSide] = useState(side);
  const timer = useRef(0);
  const wrapRef = useRef<HTMLSpanElement>(null);

  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (rect) {
        const spaceBelow = window.innerHeight - rect.bottom;
        setActualSide(spaceBelow < 220 && spaceBelow < rect.top ? 'top' : 'bottom');
      }
      setOpen(true);
    }, 200);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  return (
    <span
      ref={wrapRef}
      className="ui-popover__wrapper"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape') hide();
      }}
    >
      {children}
      {open && (
        <span role="dialog" aria-label="详情" className={cn('ui-popover', `ui-popover--${actualSide}`, className)}>
          {content}
        </span>
      )}
    </span>
  );
}
