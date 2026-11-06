import { useEffect, Children, cloneElement, isValidElement, ReactElement, useId, useRef, useState, HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import './Tooltip.css';

export interface TooltipProps {
  /** 提示文本 */
  label: string;
  /** 单一可聚焦元素（组件通过 cloneElement 注入 aria-describedby） */
  children: ReactElement<HTMLAttributes<HTMLElement>>;
  side?: 'top' | 'bottom';
  /** 显示延迟毫秒数（默认 300） */
  delay?: number;
  /** 受控显隐（传入后内部 hover 只触发 onHide 回调语义） */
  open?: boolean;
  onHide?: () => void;
}

/**
 * 工具提示：hover / 键盘焦点显示（键盘可达，→ 无障碍方案）、Escape 隐藏、延迟防误触（默认 300ms 可配）。
 * 定位翻转：打开时实测视口剩余空间，默认侧放不下自动换另一侧。
 * 提示文本不承载唯一信息——触达不了 tooltip 的用户不能因此缺失内容。
 */
export function Tooltip({ label, children, side = 'top', delay = 300, open: controlledOpen, onHide }: TooltipProps) {
  const id = useId();
  const [innerOpen, setInnerOpen] = useState(false);
  const open = controlledOpen ?? innerOpen;
  const [actualSide, setActualSide] = useState(side);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const timer = useRef(0);

  // 打开时实测视口空间，决定翻转（受控模式下随 open 变化重测）
  useEffect(() => {
    if (!open) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (rect) {
      const below = window.innerHeight - rect.bottom;
      setActualSide(below < 60 && rect.top > 60 ? 'top' : 'bottom');
    }
  }, [open]);

  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setInnerOpen(true), delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setInnerOpen(false);
    onHide?.();
  };

  const child = Children.only(children);
  const trigger = isValidElement<HTMLAttributes<HTMLElement>>(child)
    ? cloneElement(child, { 'aria-describedby': open ? id : undefined })
    : child;

  return (
    <span
      ref={wrapRef}
      className="ui-tooltip__wrapper"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape') hide();
      }}
    >
      {trigger}
      {open && (
        <span role="tooltip" id={id} className={cn('ui-tooltip', `ui-tooltip--${actualSide}`)}>
          {label}
        </span>
      )}
    </span>
  );
}
