import { CSSProperties } from 'react';
import { cn } from '../lib/cn';
import './SkeletonShape.css';

export interface SkeletonShapeProps {
  /** 形状：text 行 / circle 圆 / rect 矩形 / button 按钮 / image 图片 */
  shape?: 'text' | 'circle' | 'rect' | 'button' | 'image';
  width?: number | string;
  height?: number | string;
  count?: number;
  className?: string;
}

const SIZES: Record<string, CSSProperties> = {
  text: { height: 14, borderRadius: 'var(--ui-radius-sm)' },
  circle: { width: 32, height: 32, borderRadius: 'var(--ui-radius-full)' },
  rect: { height: 48, borderRadius: 'var(--ui-radius-md)' },
  button: { width: 80, height: 34, borderRadius: 'var(--ui-radius-md)' },
  image: { height: 120, borderRadius: 'var(--ui-radius-lg)' },
};

/** 骨架形状变体：text / circle / rect / button / image 五种预设 + count 重复渲染。 */
export function SkeletonShape({ shape = 'text', width, height, count = 1, className }: SkeletonShapeProps) {
  const base = SIZES[shape] ?? SIZES.text;
  return (
    <div className={cn('ui-skeleton-shape', className)} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="ui-skeleton-shape__item" style={{ ...base, width: width ?? (shape === 'text' ? `${100 - i * 8}%` : undefined), height: height ?? (base.height as number) }} />
      ))}
    </div>
  );
}
