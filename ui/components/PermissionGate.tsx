import { createContext, ReactNode, useContext, useMemo } from 'react';
import { cn } from '../lib/cn';
import './PermissionGate.css';

/**
 * 权限感知渲染门（→《登录与权限方案》前端投影、《多平台一致组件库方案》权限投影铁律）。
 * 三策略：hide（不渲染）/ disable（可见不可用，带原因）/ replace（渲染替代节点）。
 * 权限判断本身由调用方/PermissionProvider 注入——组件只做「策略投影」，不做鉴权。
 */

export type PermissionStrategy = 'hide' | 'disable' | 'replace';

export interface PermissionGateProps {
  /** 是否拥有权限（权限判定由调用方完成） */
  allowed: boolean;
  /** 无权限时的策略（默认 hide） */
  strategy?: PermissionStrategy;
  /** strategy=replace 时的替代节点 */
  fallback?: ReactNode;
  /** disable 模式下展示的原因（title + aria-description） */
  reason?: string;
  children: ReactNode;
  className?: string;
}

export function PermissionGate({ allowed, strategy = 'hide', fallback, reason, children, className }: PermissionGateProps) {
  if (allowed) return <>{children}</>;
  if (strategy === 'hide') return null;
  if (strategy === 'replace') return <>{fallback ?? null}</>;
  return (
    <span
      className={cn('ui-permgate--disabled', className)}
      aria-disabled="true"
      title={reason}
      data-reason={reason}
      onClickCapture={(e) => {
        // 禁用态拦截一切点击（包括子组件内部的 onClick）——可见不可用即真不可用
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {children}
      {reason && (
        <span role="img" aria-label={reason} className="ui-permgate__lock" />
      )}
    </span>
  );
}

/* ===== Provider：权限表注入 + usePermission 判定钩子 ===== */

export interface PermissionContextValue {
  /** 拥有的权限集合 */
  permissions: ReadonlySet<string>;
  has: (permission: string) => boolean;
}

const PermissionContext = createContext<PermissionContextValue | null>(null);

export interface PermissionProviderProps {
  permissions: string[];
  children: ReactNode;
}

export function PermissionProvider({ permissions, children }: PermissionProviderProps) {
  const value = useMemo<PermissionContextValue>(
    () => ({
      permissions: new Set(permissions),
      has: (p: string) => permissions.includes(p),
    }),
    [permissions],
  );
  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

/** 读权限上下文；无 Provider 时一律无权限（安全默认：拒绝） */
export function usePermission(permission: string): boolean {
  const ctx = useContext(PermissionContext);
  return ctx?.has(permission) ?? false;
}

/** 便捷组合：Gate + usePermission（权限键驱动，不用手动传 allowed） */
export function PermissionGateOf({ permission, strategy, fallback, reason, children, className }: Omit<PermissionGateProps, 'allowed'> & { permission: string }) {
  const allowed = usePermission(permission);
  return (
    <PermissionGate allowed={allowed} strategy={strategy} fallback={fallback} reason={reason} className={className}>
      {children}
    </PermissionGate>
  );
}
