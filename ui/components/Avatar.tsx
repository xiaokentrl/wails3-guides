import { ImgHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Avatar.css';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  size?: 'sm' | 'md' | 'lg';
  /** 图片缺省时的文字回退（姓名等） */
  fallback?: string;
  alt?: string;
}

export function Avatar({ size = 'md', fallback, alt = '', className, src, ...rest }: AvatarProps) {
  return (
    <span className={cn('ui-avatar', `ui-avatar--${size}`, className)}>
      {src ? (
        <img className="ui-avatar__img" src={src} alt={alt} {...rest} />
      ) : (
        <span className="ui-avatar__fallback" aria-hidden="true">
          {fallback ?? ''}
        </span>
      )}
    </span>
  );
}

export interface AvatarGroupProps {
  children: ReactNode;
  /** 最多展示个数，超出折叠为 +N */
  max?: number;
  className?: string;
}

export function AvatarGroup({ children, max, className }: AvatarGroupProps) {
  const list = Array.isArray(children) ? children : [children];
  const shown = max ? list.slice(0, max) : list;
  const overflow = list.length - shown.length;
  return (
    <span className={cn('ui-avatar-group', className)}>
      {shown}
      {overflow > 0 && (
        <span className={cn('ui-avatar', 'ui-avatar--md', 'ui-avatar--overflow')} aria-label={`另有 ${overflow} 人`}>
          +{overflow}
        </span>
      )}
    </span>
  );
}
