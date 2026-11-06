import { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Icon } from './Icon';
import './PageHeader.css';

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** 返回按钮回调；不传则不显示返回箭头 */
  onBack?: () => void;
  /** 右侧操作区 */
  extra?: ReactNode;
  /** 面包屑 */
  breadcrumb?: ReactNode;
  className?: string;
}

/** 页头：返回按钮 + 标题 + 副标题 + 右侧操作区（→ 导航组件家族）。 */
export function PageHeader({ title, subtitle, onBack, extra, breadcrumb, className }: PageHeaderProps) {
  return (
    <div className={cn('ui-page-header', className)}>
      {breadcrumb}
      <div className="ui-page-header__row">
        {onBack && (
          <button type="button" className="ui-page-header__back" aria-label="返回" onClick={onBack}>
            <Icon name="chevron-left" size={18} />
          </button>
        )}
        <div className="ui-page-header__titles">
          <h1 className="ui-page-header__title">{title}</h1>
          {subtitle && <p className="ui-page-header__subtitle">{subtitle}</p>}
        </div>
        {extra && <div className="ui-page-header__extra">{extra}</div>}
      </div>
    </div>
  );
}
