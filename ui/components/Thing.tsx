import { CSSProperties, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Thing.css';

export interface ThingProps {
  /** 头像 / 图标（Thing 的视觉锚点） */
  avatar?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** 右上角动作区（时间戳 / 操作按钮） */
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** 结构化内容块（→ Naive UI Thing）：avatar + 标题/描述 + 动作 + 正文——评论、通知条目、日志行的通用骨架。 */
export function Thing({ avatar, title, description, actions, children, className }: ThingProps) {
  return (
    <div className={cn('ui-thing', className)}>
      {avatar && <div className="ui-thing__avatar">{avatar}</div>}
      <div className="ui-thing__main">
        <div className="ui-thing__head">
          <div className="ui-thing__titles">
            {title && <div className="ui-thing__title">{title}</div>}
            {description && <div className="ui-thing__desc">{description}</div>}
          </div>
          {actions && <div className="ui-thing__actions">{actions}</div>}
        </div>
        {children && <div className="ui-thing__content">{children}</div>}
      </div>
    </div>
  );
}

/** 渐变文字（→ Naive UI GradientText）：颜色数组走 linear-gradient + background-clip:text。 */
export function GradientText({ colors, children, className, style }: { colors: string[]; children: ReactNode; className?: string; style?: CSSProperties }) {
  const gradient = colors.length >= 2 ? colors.join(', ') : `${colors[0] ?? 'var(--ui-primary)'}, var(--ui-primary)`;
  return (
    <span
      className={cn('ui-gradient-text', className)}
      style={{
        backgroundImage: `linear-gradient(120deg, ${gradient})`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
