import { createContext, useCallback, useContext, useRef, useState, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Toast.css';

export type ToastKind = 'info' | 'success' | 'error';

export interface ToastOptions {
  kind?: ToastKind;
  message: string;
  /** 自动消失毫秒数，默认 3000（成功克制、失败走三件套 →《操作反馈方案》） */
  duration?: number;
}

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
  duration: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const toast = useCallback(({ kind = 'info', message, duration = 3000 }: ToastOptions) => {
    const id = ++nextId.current;
    setItems((prev) => [...prev, { id, kind, message, duration }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="ui-toast-region" aria-label="通知">
        {items.map((t) => (
          <div
            key={t.id}
            role={t.kind === 'error' ? 'alert' : 'status'}
            className={cn('ui-toast', `ui-toast--${t.kind}`)}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** 使用约束：必须在 ToastProvider 内。Toast 只用于「结果不在眼前」的操作（→ 操作反馈路由规则）。 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast 必须在 <ToastProvider> 内使用');
  }
  return ctx;
}
