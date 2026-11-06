import { ImgHTMLAttributes, ReactNode, useState } from 'react';
import { cn } from '../lib/cn';
import './Image.css';

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  alt: string;
  /** 加载失败时的回退（文案或占位节点） */
  fallback?: ReactNode;
  /** 圆角档位 */
  rounded?: 'none' | 'sm' | 'md' | 'lg';
}

/** 图片：加载失败有显式回退态（不显示碎图标），尺寸由外层约束。 */
export function Image({ alt, fallback, rounded = 'md', className, ...rest }: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className={cn('ui-image', `ui-image--rounded-${rounded}`, 'ui-image--fallback', className)} role="img" aria-label={alt}>
        {fallback ?? alt}
      </span>
    );
  }
  return (
    <img
      className={cn('ui-image', `ui-image--rounded-${rounded}`, className)}
      alt={alt}
      onError={() => setFailed(true)}
      {...rest}
    />
  );
}
