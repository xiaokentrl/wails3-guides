import { ReactNode, useState } from 'react';
import { cn } from '../lib/cn';
import './FloatButton.css';

export interface FloatButtonAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

export interface FloatButtonProps {
  /** 主按钮点击回调 */
  onClick?: () => void;
  /** 展开时的子操作 */
  actions?: FloatButtonAction[];
  /** 主按钮图标 */
  icon?: ReactNode;
  className?: string;
}

/** 浮动操作按钮（FAB）：点击展开/收起子操作列表。 */
export function FloatButton({ onClick, actions = [], icon = '+', className }: FloatButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn('ui-fab', open && 'ui-fab--open', className)}>
      {open && actions.length > 0 && (
        <div className="ui-fab__actions">
          {actions.map((a) => (
            <button key={a.label} type="button" className="ui-fab__action" onClick={a.onClick}>
              {a.icon}
              <span className="ui-fab__action-label">{a.label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        className="ui-fab__trigger"
        aria-label={open ? '收起' : '展开'}
        aria-expanded={open}
        onClick={() => (actions.length ? setOpen(!open) : onClick?.())}
      >
        {icon}
      </button>
    </div>
  );
}
