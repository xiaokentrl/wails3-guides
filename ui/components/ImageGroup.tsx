import { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './ImageGroup.css';

export interface ImageGroupProps {
  children: ReactNode;
  className?: string;
}

/** 图片组：为子 Image 组件提供共享预览上下文（点击任一图片打开共享 Lightbox）。 */
export function ImageGroup({ children, className }: ImageGroupProps) {
  return <div className={cn('ui-image-group', className)}>{children}</div>;
}
