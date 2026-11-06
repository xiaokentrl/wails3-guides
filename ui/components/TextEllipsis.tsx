import { HTMLAttributes, ReactNode, useState } from 'react';
import { cn } from '../lib/cn';
import './Text.css';

export interface TextEllipsisProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  /** 展开后的完整文本（默认用 children） */
  fullText?: string;
  maxWidth?: number | string;
}

/** 单行截断；hover 显示原生 title（完整文本的廉价兜底，进阶版接 Tooltip）。 */
export function TextEllipsis({ children, fullText, maxWidth, className, ...rest }: TextEllipsisProps) {
  const [hover, setHover] = useState(false);
  return (
    <span
      className={cn('ui-ellipsis', className)}
      style={{ maxWidth }}
      title={hover ? (fullText ?? String(children)) : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      {children}
    </span>
  );
}
