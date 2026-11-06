import { ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { useFocusTrap } from '../lib/useFocusTrap';
import { usePortalContainer } from '../lib/portal';
import './Modal.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** 无障碍名称（同时用于 aria-label 与标题） */
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /** 附加到面板根节点的类名（如 FileDialog 需要定制面板宽度） */
  className?: string;
}

/**
 * 模态对话框（→《窗口与多窗口技术方案》模态规则、《无障碍与辅助技术方案》）：
 * 焦点陷阱 / Escape / 焦点归还 / 滚动锁定由 useFocusTrap 统一提供（与 Drawer 共用）。
 */
export function Modal({ open, onClose, title, children, footer, className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { zIndex } = useFocusTrap(panelRef, open, onClose);
  const container = usePortalContainer('modal');

  if (!open || !container) return null;

  return createPortal(
    <div
      className="ui-modal__overlay"
      style={{ zIndex: zIndex ?? undefined }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label={title} className={cn('ui-modal', className)}>
        <header className="ui-modal__header">
          <h2 className="ui-modal__title">{title}</h2>
          <button type="button" className="ui-modal__close" aria-label="关闭" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="ui-modal__body">{children}</div>
        {footer && <footer className="ui-modal__footer">{footer}</footer>}
      </div>
    </div>,
    container,
  );
}
