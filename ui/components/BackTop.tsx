import { useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import './BackTop.css';

export interface BackTopProps {
  /** 出现阈值（scrollY 超过后显示，默认 400） */
  threshold?: number;
  className?: string;
}

/** 返回顶部：阈值出现、平滑滚动；监听在卸载时清理。 */
export function BackTop({ threshold = 400, className }: BackTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    <button
      type="button"
      className={cn('ui-backtop', className)}
      aria-label="返回顶部"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ↑
    </button>
  );
}
