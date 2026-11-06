import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './Affix.css';

export interface AffixProps {
  /** 距视口顶部的偏移（触发固定的 scrollY 阈值） */
  offsetTop?: number;
  children: ReactNode;
  className?: string;
}

/** 固钉：滚动超过目标位置后固定在视口指定偏移处（position: sticky 实现）。 */
export function Affix({ offsetTop = 0, children, className }: AffixProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [fixed, setFixed] = useState(false);
  const [initialTop, setInitialTop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setInitialTop(el.getBoundingClientRect().top + window.scrollY);
    const onScroll = () => {
      setFixed(window.scrollY > initialTop - offsetTop);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [initialTop, offsetTop]);

  return (
    <div
      ref={ref}
      className={cn('ui-affix', fixed && 'ui-affix--fixed', className)}
      style={fixed ? { position: 'fixed', top: offsetTop, width: ref.current?.offsetWidth } : undefined}
    >
      {children}
    </div>
  );
}
