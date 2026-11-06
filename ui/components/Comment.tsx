import { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Avatar } from './Avatar';
import './Comment.css';

export interface CommentProps {
  author: ReactNode;
  avatarSrc?: string;
  time?: ReactNode;
  children: ReactNode;
  /** 操作区（回复 / 点赞等） */
  actions?: ReactNode;
  className?: string;
}

/** 评论块（支持嵌套回复：children 内再放 Comment）。 */
export function Comment({ author, avatarSrc, time, children, actions, className }: CommentProps) {
  return (
    <article className={cn('ui-comment', className)}>
      <Avatar src={avatarSrc} alt={typeof author === 'string' ? author : ''} size="sm" />
      <div className="ui-comment__body">
        <div className="ui-comment__meta">
          <span className="ui-comment__author">{author}</span>
          {time && <span className="ui-comment__time">{time}</span>}
        </div>
        <div className="ui-comment__content">{children}</div>
        {actions && <div className="ui-comment__actions">{actions}</div>}
      </div>
    </article>
  );
}
