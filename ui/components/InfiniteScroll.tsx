import { ReactNode, useEffect, useRef } from 'react';
import { cn } from '../lib/cn';
import './InfiniteScroll.css';

export interface InfiniteScrollProps<T> {
  /** 当前已加载的数据（由调用方管理分页） */
  items: T[];
  /** 是否还有更多数据 */
  hasMore: boolean;
  /** 加载更多回调 */
  onLoadMore: () => void;
  /** 是否正在加载 */
  loading?: boolean;
  renderItem: (item: T, index: number) => ReactNode;
  loader?: ReactNode;
  className?: string;
}

/**
 * 无限滚动容器：滚动到底部时触发 onLoadMore（→ 性能方案：与 VirtualList 互斥选择——
 * VirtualList 适合固定行高大数据，InfiniteScroll 适合动态高度追加加载）。
 */
export function InfiniteScroll<T>({ items, hasMore, onLoadMore, loading, renderItem, loader, className }: InfiniteScrollProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMore(); },
      { rootMargin: '100px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  return (
    <div className={cn('ui-infinite-scroll', className)}>
      {items.map((item, i) => (
        <div key={i} className="ui-infinite-scroll__item">{renderItem(item, i)}</div>
      ))}
      {hasMore && (
        <div ref={sentinelRef} className="ui-infinite-scroll__sentinel">
          {loader ?? <span className="ui-infinite-scroll__loading">加载中…</span>}
        </div>
      )}
      {!hasMore && items.length > 0 && (
        <div className="ui-infinite-scroll__end">已加载全部</div>
      )}
    </div>
  );
}
