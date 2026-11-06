import { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Text.css';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 外部链接由调用方决定 target/rel（scheme 白名单 → 安全方案） */
  children: ReactNode;
}

export function Link({ className, children, ...rest }: LinkProps) {
  return (
    <a className={cn('ui-link', className)} {...rest}>
      {children}
    </a>
  );
}
