import { ReactNode, useCallback, useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import { Icon } from './Icon';
import './Carousel.css';

export interface CarouselProps {
  items: ReactNode[];
  /** 自动轮播间隔（0 = 不自动） */
  autoplay?: number;
  /** 是否显示指示器 */
  showDots?: boolean;
  /** 是否显示箭头 */
  showArrows?: boolean;
  className?: string;
}

/** 走马灯：内容轮播（支持箭头、指示器、自动播放、键盘 ←→）。 */
export function Carousel({ items, autoplay = 0, showDots = true, showArrows = true, className }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const go = useCallback((i: number) => {
    const len = items.length;
    if (len === 0) return;
    setCurrent(((i % len) + len) % len);
  }, [items.length]);

  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  useEffect(() => {
    if (autoplay <= 0 || items.length <= 1) return;
    const t = setInterval(next, autoplay);
    return () => clearInterval(t);
  }, [autoplay, next, items.length]);

  if (items.length === 0) return null;

  return (
    <div className={cn('ui-carousel', className)} role="region" aria-roledescription="轮播" aria-label={`第 ${current + 1} / ${items.length} 项`}>
      <div className="ui-carousel__viewport">
        <div className="ui-carousel__track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {items.map((item, i) => (
            <div key={i} className="ui-carousel__slide" aria-hidden={i !== current}>
              {item}
            </div>
          ))}
        </div>
      </div>
      {showArrows && items.length > 1 && (
        <>
          <button type="button" className="ui-carousel__arrow ui-carousel__arrow--left" aria-label="上一张" onClick={prev}>
            <Icon name="chevron-left" size={18} />
          </button>
          <button type="button" className="ui-carousel__arrow ui-carousel__arrow--right" aria-label="下一张" onClick={next}>
            <Icon name="chevron-right" size={18} />
          </button>
        </>
      )}
      {showDots && items.length > 1 && (
        <div className="ui-carousel__dots" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === current}
              className={cn('ui-carousel__dot', i === current && 'ui-carousel__dot--active')}
              aria-label={`第 ${i + 1} 张`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
