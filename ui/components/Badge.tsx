import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Badge.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** 语义色调：与语义令牌一一对应，不承载颜色之外的含义 */
  tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
}

/** 轻量标签。状态展示请配合图标/文字（颜色不是唯一通道，→ 无障碍纪律）。 */
export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return <span className={cn('ui-badge', `ui-badge--${tone}`, className)} {...rest} />;
}

export interface BadgeRibbonProps {
  /** 缎带文案 */
  text: ReactNode;
  /** 缎带色（CSS 颜色/令牌，默认主色） */
  color?: string;
  /** 角位（默认右上） */
  placement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  children: ReactNode;
  className?: string;
}

/** 缎带角标（→ antd Badge.Ribbon）：包住任意内容，角落加折角缎带；文案同时进 aria-label（颜色第二通道纪律）。 */
export function BadgeRibbon({ text, color = 'var(--ui-primary)', placement = 'top-right', children, className }: BadgeRibbonProps) {
  const pos = placement.startsWith('top') ? { top: 10 } : { bottom: 10 };
  return (
    <div className={cn('ui-ribbon-wrap', className)} style={{ position: 'relative' }}>
      {children}
      <span
        className={cn('ui-ribbon', `ui-ribbon--${placement}`)}
        style={{ background: color, ...pos }}
        aria-label={`缎带：${typeof text === 'string' ? text : ''}`}
      >
        {text}
      </span>
    </div>
  );
}
