import { ReactNode, useEffect, useId, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './Feedback.css';

export interface PopoverProps {
  /** 触发元素（点击切换） */
  trigger: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom';
  className?: string;
}

/**
 * 点击弹出、light dismiss（点击外部 / Escape 关闭）。
 * 定位锚定触发元素；边界翻转与滚动跟随 → 下一批（与 ContextMenu/Dropdown 共用）。
 */
export function Popover({ trigger, children, side = 'bottom', className }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [actualSide, setActualSide] = useState(side);
  const id = useId();
  const wrapRef = useRef<HTMLSpanElement>(null);

  // 定位翻转：打开时实测视口剩余空间（→ 弹框横切机制「触发源锚定」）
  useEffect(() => {
    if (!open) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom;
      setActualSide(below < 180 && rect.top > 180 ? 'top' : 'bottom');
    }
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className={cn('ui-popover__wrapper', className)}>
      {typeof trigger === 'object' && trigger !== null && 'type' in (trigger as object) ? (
        <span
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? id : undefined}
          style={{ display: 'inline-flex' }}
        >
          {trigger}
        </span>
      ) : (
        trigger
      )}
      {open && (
        <span role="dialog" id={id} className={cn('ui-popover', `ui-popover--${actualSide}`)}>
          {children}
        </span>
      )}
    </span>
  );
}
