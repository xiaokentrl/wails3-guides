import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Card.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/** 内容容器。层次由 surface 令牌表达（暗色下自动切换为提亮层次）。 */
export function Card({ padding = 'md', className, ...rest }: CardProps) {
  return <div className={cn('ui-card', `ui-card--padding-${padding}`, className)} {...rest} />;
}

export interface CardMetaProps {
  /** 封面（图片 / 渐变块，宽度 100%） */
  cover?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** 底部动作区（按钮组 / 链接） */
  actions?: ReactNode;
  /** 封面下的正文（可选） */
  children?: ReactNode;
  className?: string;
}

/** 卡片内容区（→ antd Card.Meta）：cover + 标题/描述 + 正文 + 动作四段式。与 Card 组合使用。 */
export function CardMeta({ cover, title, description, actions, children, className }: CardMetaProps) {
  return (
    <>
      {cover && <div className="ui-card__cover">{cover}</div>}
      <div className={cn('ui-card__meta', className)}>
        {title && <div className="ui-card__meta-title">{title}</div>}
        {description && <div className="ui-card__meta-desc">{description}</div>}
        {children}
      </div>
      {actions && (
        <div className="ui-card__actions">
          {actions}
        </div>
      )}
    </>
  );
}
