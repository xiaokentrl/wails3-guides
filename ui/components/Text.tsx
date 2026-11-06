import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Text.css';

export interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
}

export function Title({ level = 3, className, children, ...rest }: TitleProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag className={cn('ui-typography', `ui-title`, `ui-title--${level}`, className)} {...rest}>
      {children as ReactNode}
    </Tag>
  );
}

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  /** secondary = 次要信息；strong = 强调 */
  type?: 'default' | 'secondary' | 'success' | 'warning' | 'danger';
  strong?: boolean;
}

export function Text({ type = 'default', strong, className, children, ...rest }: TextProps) {
  return (
    <p
      className={cn('ui-typography', 'ui-text', type !== 'default' && `ui-text--${type}`, strong && 'ui-text--strong', className)}
      {...rest}
    >
      {children}
    </p>
  );
}
