import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './CountUp.css';

export interface CountUpProps {
  /** 目标数值 */
  value: number;
  /** 动画时长（默认 800ms；prefers-reduced-motion 下直接呈现终值） */
  duration?: number;
  /** 小数位数 */
  decimals?: number;
  className?: string;
}

/** 数字滚动（→ 展示类动效；减少动效偏好下不动画）。区域格式化走 Intl（→ 国际化方案）。 */
export function CountUp({ value, duration = 800, decimals = 0, className }: CountUpProps) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const from = fromRef.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(from + (value - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return (
    <span className={cn('ui-countup', className)}>
      {new Intl.NumberFormat(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(display)}
    </span>
  );
}
