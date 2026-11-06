import { ReactNode, useState } from 'react';
import { cn } from '../lib/cn';
import './Popconfirm.css';

export interface PopconfirmProps {
  title: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: 'info' | 'danger';
  onConfirm: () => void;
  onCancel?: () => void;
  /** 触发元素 */
  children: ReactNode;
  className?: string;
}

/** 气泡确认框：轻量就地确认（→ 弹框家族「中打断」档），比 Modal 更轻，比直接执行更安全。 */
export function Popconfirm({ title, description, confirmText = '确定', cancelText = '取消', tone = 'info', onConfirm, onCancel, children, className }: PopconfirmProps) {
  const [open, setOpen] = useState(false);
  return (
    <span className={cn('ui-popconfirm__wrapper', className)}>
      {children}
      {open && (
        <div className={cn('ui-popconfirm', `ui-popconfirm--${tone}`)} role="alertdialog" aria-label={typeof title === 'string' ? title : undefined}>
          <div className="ui-popconfirm__title">{title}</div>
          {description && <div className="ui-popconfirm__desc">{description}</div>}
          <div className="ui-popconfirm__actions">
            <button type="button" className="ui-popconfirm__btn" onClick={() => { setOpen(false); onCancel?.(); }}>
              {cancelText}
            </button>
            <button
              type="button"
              className={cn('ui-popconfirm__btn', 'ui-popconfirm__btn--confirm', tone === 'danger' && 'ui-popconfirm__btn--danger')}
              onClick={() => { setOpen(false); onConfirm(); }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      )}
    </span>
  );
}

export function PopconfirmTrigger({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className="ui-popconfirm__trigger" onClick={onClick}>
      {children}
    </button>
  );
}
