import { ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';
import { useFocusTrap } from '../lib/useFocusTrap';
import { usePortalContainer } from '../lib/portal';
import './Drawer.css';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: 'right' | 'left';
  width?: number;
}

/** 侧滑抽屉：承载复杂内容的模态形态（→ 弹框家族「高打断」档）。焦点陷阱复用 Modal 同一 hook。 */
export function Drawer({ open, onClose, title, children, footer, side = 'right', width = 360 }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { zIndex } = useFocusTrap(panelRef, open, onClose);
  const container = usePortalContainer('drawer');

  if (!open || !container) return null;

  return createPortal(
    <div
      className="ui-drawer__overlay"
      style={{ zIndex: zIndex ?? undefined }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn('ui-drawer', `ui-drawer--${side}`)}
        style={{ width }}
      >
        <header className="ui-drawer__header">
          <h2 className="ui-drawer__title">{title}</h2>
          <button type="button" className="ui-drawer__close" aria-label="关闭" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="ui-drawer__body">{children}</div>
        {footer && <footer className="ui-drawer__footer">{footer}</footer>}
      </div>
    </div>,
    container,
  );
}
