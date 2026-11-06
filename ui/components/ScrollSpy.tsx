import { ReactNode, useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import './ScrollSpy.css';

export interface ScrollSpyItem {
  id: string;
  label: ReactNode;
  children?: ScrollSpyItem[];
}

export interface ScrollSpyProps {
  items: ScrollSpyItem[];
  /** 监听的滚动容器选择器（默认 window） */
  containerSelector?: string;
  /** 激活偏移（当前节距视口顶部的距离阈值，默认 80） */
  offset?: number;
  className?: string;
}

/** 滚动监听锚点导航（scroll spy）：滚动到目标区域时高亮对应链接。 */
export function ScrollSpy({ items, containerSelector, offset = 80, className }: ScrollSpyProps) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const flat = items.flatMap((i) => [i, ...(i.children ?? [])]);
    const onScroll = () => {
      let current = flat[0]?.id ?? '';
      for (const item of flat) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= offset) current = item.id;
      }
      setActive(current);
    };
    const container = containerSelector ? document.querySelector(containerSelector) : window;
    (container as HTMLElement | Window).addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => (container as HTMLElement | Window).removeEventListener('scroll', onScroll);
  }, [items, offset, containerSelector]);

  const renderItem = (item: ScrollSpyItem, depth: number) => (
    <div key={item.id}>
      <button
        type="button"
        className={cn('ui-scrollspy__link', depth > 0 && `ui-scrollspy__link--depth${depth}`, active === item.id && 'ui-scrollspy__link--active')}
        onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
      >
        {item.label}
      </button>
      {item.children?.map((c) => renderItem({ ...c }, depth + 1))}
    </div>
  );

  return (
    <nav aria-label="锚点导航" className={cn('ui-scrollspy', className)}>
      {items.map((item) => renderItem(item, 0))}
    </nav>
  );
}
