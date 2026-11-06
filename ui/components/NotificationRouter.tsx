import { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { ToastProvider, useToast } from './Toast';

export type NotificationPermission = 'granted' | 'denied' | 'unknown';
export type NotificationChannel = 'system' | 'toast';
export type SystemNotifyResult = 'sent' | 'denied' | 'unavailable';

export interface NotificationRequest {
  title: string;
  body?: string;
  kind?: 'info' | 'success' | 'error';
  /** 同 tag 的系统通知在平台上替换而非堆叠（支持度**待验证** → 系统能力方案） */
  tag?: string;
  /** 系统通知点击后执行：聚焦窗口由路由器完成，跳转由调用方提供 */
  onClick?: () => void;
  /** 强制走某通道（默认按窗口可见性路由 → 操作反馈方案层级路由） */
  forceChannel?: NotificationChannel;
}

export interface NotificationRouterProps {
  children: ReactNode;
  /** 窗口可见性接线（Wails 窗口焦点事件 → 窗口方案） */
  isWindowActive: () => boolean;
  /** 系统通知桥接（Wails 绑定注入 → 系统能力方案能力矩阵；结果驱动降级链） */
  showSystemNotification: (n: { title: string; body?: string; tag?: string }) => Promise<SystemNotifyResult>;
  /** 系统通知被点击：路由器自动聚焦窗口（→ 托盘方案统一唤回），跳转由调用方在 onClick 补 */
  focusWindow?: () => void;
  /** 权限请求桥接（macOS 授权等平台差异 → 系统能力方案前置条件） */
  requestPermission?: () => Promise<NotificationPermission>;
}

export interface NotificationRouterValue {
  /** 统一通知入口：按窗口可见性与权限路由（Toast / 系统通知），失败自动降级为 Toast */
  notify: (req: NotificationRequest) => void;
  /** 系统通知点击路由：桥接层收到平台点击回调后，以登记时的 tag（或 title）调用 */
  routeNotificationClick: (key: string) => void;
  permission: NotificationPermission;
  ensurePermission: () => Promise<NotificationPermission>;
}

const RouterContext = createContext<NotificationRouterValue | null>(null);

function InnerProvider({
  children,
  isWindowActive,
  showSystemNotification,
  focusWindow,
  requestPermission,
}: NotificationRouterProps) {
  const toast = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('unknown');
  const pendingClicks = useRef(new Map<string, () => void>());

  const routeNotificationClick = useCallback((key: string) => {
    const handler = pendingClicks.current.get(key);
    if (handler) {
      pendingClicks.current.delete(key);
      handler();
    }
  }, []);

  const ensurePermission = useCallback(async () => {
    if (permission === 'granted' || permission === 'denied') return permission;
    const result = requestPermission ? await requestPermission() : 'unknown';
    setPermission(result);
    return result;
  }, [permission, requestPermission]);

  const notify = useCallback(
    (req: NotificationRequest) => {
      const showToast = () =>
        toast.toast({ kind: req.kind ?? 'info', message: req.body ? `${req.title}——${req.body}` : req.title });

      if (req.forceChannel === 'toast') {
        showToast();
        return;
      }
      if (isWindowActive() && req.forceChannel !== 'system') {
        showToast(); // 窗口可见：系统通知是噪音（→ 操作反馈路由规则）
        return;
      }
      // 窗口不可见：走系统通知；拒绝/不可用自动降级为 Toast（→ 系统能力方案降级三档）
      void (async () => {
        let result: SystemNotifyResult = 'unavailable';
        try {
          if (permission === 'denied') {
            result = 'denied';
          } else {
            if (permission === 'unknown') {
              const p = await ensurePermission();
              if (p === 'denied') {
                showToast();
                return;
              }
            }
            result = await showSystemNotification({ title: req.title, body: req.body, tag: req.tag });
          }
        } catch {
          result = 'unavailable';
        }
        if (result === 'sent') {
          // 系统通知点击 → 统一唤回（→ 托盘方案）：聚焦窗口由路由器完成，跳转交给 onClick
          if (req.onClick || focusWindow) {
            pendingClicks.current.set(req.tag ?? req.title, () => {
              focusWindow?.();
              req.onClick?.();
            });
          }
        } else {
          showToast();
        }
      })();
    },
    [toast, isWindowActive, showSystemNotification, focusWindow, permission, ensurePermission],
  );

  const value = useMemo(
    () => ({ notify, routeNotificationClick, permission, ensurePermission }),
    [notify, routeNotificationClick, permission, ensurePermission],
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

/** 通知路由 Provider：内部包含 ToastProvider（Toast 是降级通道）。 */
export function NotificationRouter(props: NotificationRouterProps) {
  return (
    <ToastProvider>
      <InnerProvider {...props} />
    </ToastProvider>
  );
}

/** 通知入口 + 权限态 + 系统通知点击路由。必须在 NotificationRouter 内使用。 */
export function useNotifications(): NotificationRouterValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useNotifications 必须在 <NotificationRouter> 内使用');
  return ctx;
}
