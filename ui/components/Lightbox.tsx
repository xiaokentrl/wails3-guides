import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { useFocusTrap } from '../lib/useFocusTrap';
import { usePortalContainer } from '../lib/portal';
import './Composite.css';

export interface LightboxImage {
  src: string;
  caption?: string;
}

export interface LightboxProps {
  images: LightboxImage[];
  /** 当前索引（受控） */
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  footer?: ReactNode;
}

/**
 * 图片灯箱（→ 弹框家族「高打断」档）：**接入弹框栈**——
 * Escape 只关最上层、滚动锁引用计数、z-index 随栈深（与 Modal/Drawer 嵌套共存）；
 * 方向键切图仅在自身为栈顶时生效；缩放手势为下一批。
 * Portal 使用专属容器（→ 避免 document.body 多 portal 共享导致的 removeChild 冲突）。
 */
export function Lightbox({ images, index, onIndexChange, onClose, footer }: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { zIndex, isTop } = useFocusTrap(overlayRef, true, onClose);
  const container = usePortalContainer('lightbox');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isTop()) return;
      if (e.key === 'ArrowLeft') onIndexChange(Math.max(0, index - 1));
      if (e.key === 'ArrowRight') onIndexChange(Math.min(images.length - 1, index + 1));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, images.length, onClose, onIndexChange, isTop]);

  if (images.length === 0 || !container) return null;
  const current = images[Math.min(index, images.length - 1)];

  return createPortal(
    <div
      ref={overlayRef}
      className="ui-lightbox__overlay"
      tabIndex={-1}
      role="dialog"
      aria-label={`图片预览 ${index + 1} / ${images.length}`}
      style={{ zIndex: zIndex ?? undefined }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={cn('ui-lightbox')}>
        <img className="ui-lightbox__img" src={current.src} alt={current.caption ?? ''} />
        <div className="ui-lightbox__bar">
          <button
            type="button"
            className="ui-lightbox__nav"
            aria-label="上一张"
            disabled={index <= 0}
            onClick={() => onIndexChange(index - 1)}
          >
            ‹
          </button>
          <span>
            {index + 1} / {images.length}
            {current.caption ? ` · ${current.caption}` : ''}
          </span>
          <button
            type="button"
            className="ui-lightbox__nav"
            aria-label="下一张"
            disabled={index >= images.length - 1}
            onClick={() => onIndexChange(index + 1)}
          >
            ›
          </button>
        </div>
        {footer}
      </div>
      <button type="button" className="ui-lightbox__close" aria-label="关闭" onClick={onClose}>
        ×
      </button>
    </div>,
    container,
  );
}
