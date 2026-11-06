import { CSSProperties, ReactNode, useEffect, useRef } from 'react';
import { cn } from '../lib/cn';
import './Watermark.css';

export interface WatermarkProps {
  content: string;
  /** 水印文字大小 */
  fontSize?: number;
  /** 旋转角度（默认 -22°） */
  rotate?: number;
  /** 透明度（默认 0.08） */
  opacity?: number;
  /** 间距 */
  gap?: [number, number];
  children: ReactNode;
  className?: string;
}

/** 水印覆盖层：Canvas 绘制平铺水印（→ 防截屏溯源、内部文档标记）。 */
export function Watermark({ content, fontSize = 14, rotate = -22, opacity = 0.08, gap = [100, 100], children, className }: WatermarkProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const [gx, gy] = gap;
    canvas.width = gx;
    canvas.height = gy;
    ctx.translate(gx / 2, gy / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = 'var(--ui-text)';
    ctx.globalAlpha = opacity;
    ctx.textAlign = 'center';
    ctx.fillText(content, 0, fontSize / 2);
    el.style.backgroundImage = `url(${canvas.toDataURL()})`;
    el.style.backgroundRepeat = 'repeat';
  }, [content, fontSize, rotate, opacity, gap[0], gap[1]]);

  return (
    <div ref={ref} className={cn('ui-watermark', className)} style={{ position: 'relative' } as CSSProperties}>
      {children}
    </div>
  );
}
