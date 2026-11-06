import { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './MessageBox.css';

export type MessageBoxAction = 'confirm' | 'cancel';

export interface MessageBoxOptions {
  title: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: 'info' | 'warning' | 'danger';
  prompt?: boolean;
  defaultValue?: string;
  placeholder?: string;
}

export interface MessageBoxResult {
  action: MessageBoxAction;
  value?: string;
}

interface PendingBox extends MessageBoxOptions {
  id: number;
  resolve: (r: MessageBoxResult) => void;
}

const BoxContext = createContext<{ show: (o: MessageBoxOptions) => Promise<MessageBoxResult> } | null>(null);

export function MessageBoxProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingBox | null>(null);
  const resolveRef = useRef<((r: MessageBoxResult) => void) | null>(null);
  const idRef = useRef(0);

  const show = useCallback((o: MessageBoxOptions): Promise<MessageBoxResult> => {
    return new Promise((resolve) => {
      if (resolveRef.current) resolveRef.current({ action: 'cancel' });
      const id = ++idRef.current;
      resolveRef.current = resolve;
      setPending({ ...o, id, resolve });
    });
  }, []);

  const close = (r: MessageBoxResult) => {
    resolveRef.current?.(r);
    resolveRef.current = null;
    setPending(null);
  };

  const p = pending;
  return (
    <BoxContext.Provider value={{ show }}>
      {children}
      {p && (
        <div className="ui-msgbox__overlay" role="dialog" aria-modal="true" aria-label={p.title}>
          <div className="ui-msgbox">
            <div className="ui-msgbox__title">{p.title}</div>
            <div className="ui-msgbox__message">{p.message}</div>
            {p.prompt && (
              <input
                className="ui-msgbox__input"
                defaultValue={p.defaultValue}
                placeholder={p.placeholder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') close({ action: 'confirm', value: (e.target as HTMLInputElement).value });
                  if (e.key === 'Escape') close({ action: 'cancel' });
                }}
              />
            )}
            <div className="ui-msgbox__actions">
              {p.cancelText && (
                <button type="button" className="ui-msgbox__btn" onClick={() => close({ action: 'cancel' })}>
                  {p.cancelText}
                </button>
              )}
              <button
                type="button"
                className={cn('ui-msgbox__btn', 'ui-msgbox__btn--primary', p.tone === 'danger' && 'ui-msgbox__btn--danger')}
                onClick={() => close({ action: 'confirm', value: p.defaultValue })}
              >
                {p.confirmText ?? '确定'}
              </button>
            </div>
          </div>
        </div>
      )}
    </BoxContext.Provider>
  );
}

export function useMessageBox(): { show: (o: MessageBoxOptions) => Promise<MessageBoxResult> } {
  const ctx = useContext(BoxContext);
  if (!ctx) throw new Error('useMessageBox 必须在 <MessageBoxProvider> 内使用');
  return ctx;
}
