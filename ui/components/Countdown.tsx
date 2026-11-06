import { useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import './Data.css';

export interface CountdownProps {
  /** 目标时间（未来） */
  target: Date;
  /** 归零回调 */
  onZero?: () => void;
  className?: string;
}

function split(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(total / 86400),
    h: String(Math.floor((total % 86400) / 3600)).padStart(2, '0'),
    m: String(Math.floor((total % 3600) / 60)).padStart(2, '0'),
    s: String(total % 60).padStart(2, '0'),
  };
}

/** 文本倒计时（距目标时间的 天:时:分:秒）。interval 挂卸载清理（→ 防抖与节流方案可清理不变式）。 */
export function Countdown({ target, onZero, className }: CountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = window.setInterval(() => {
      const n = Date.now();
      setNow(n);
      if (n >= target.getTime()) {
        window.clearInterval(t);
        onZero?.();
      }
    }, 1000);
    return () => window.clearInterval(t);
    // target/onZero 经 ref 稳定性由调用方保证（memo/回调不变）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.getTime()]);

  const { d, h, m, s } = split(target.getTime() - now);
  return (
    <span className={cn('ui-countdown', className)} role="timer" aria-label="倒计时">
      {d > 0 && `${d} 天 `}
      {h}:{m}:{s}
    </span>
  );
}
