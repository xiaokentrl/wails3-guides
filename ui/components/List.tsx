import { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './List.css';

export interface ListProps {
  header?: ReactNode;
  footer?: ReactNode;
  bordered?: boolean;
  children: ReactNode;
  className?: string;
}

export interface ListItemProps {
  /** 条目前置（图标 / 缩略图） */
  prefix?: ReactNode;
  /** 主标题行 */
  title?: ReactNode;
  /** 描述行 */
  description?: ReactNode;
  /** 右侧动作区 */
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** 列表容器（→ Naive UI List / antd List 的通用子集）：头/尾/边框 + 条目插槽。 */
export function List({ header, footer, bordered = true, children, className }: ListProps) {
  return (
    <div className={cn('ui-list', bordered && 'ui-list--bordered', className)}>
      {header && <div className="ui-list__header">{header}</div>}
      <ul className="ui-list__items" role="list">
        {children}
      </ul>
      {footer && <div className="ui-list__footer">{footer}</div>}
    </div>
  );
}

/** 列表条目：prefix | (title + description [+ children]) | actions 四区。 */
export function ListItem({ prefix, title, description, actions, children, className }: ListItemProps) {
  return (
    <li className={cn('ui-list__item', className)}>
      {prefix && <div className="ui-list__prefix">{prefix}</div>}
      <div className="ui-list__content">
        {title && <div className="ui-list__title">{title}</div>}
        {description && <div className="ui-list__desc">{description}</div>}
        {children}
      </div>
      {actions && <div className="ui-list__actions">{actions}</div>}
    </li>
  );
}
