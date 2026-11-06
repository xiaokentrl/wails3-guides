import { ReactNode, useState } from 'react';
import { cn } from '../lib/cn';
import './AppShell.css';

export interface AppShellProps {
  /** 顶栏（logo / 全局操作 / 账户区） */
  header?: ReactNode;
  /** 侧栏内容（导航树 / 折叠后图标列） */
  sider?: ReactNode;
  /** 主内容 */
  children: ReactNode;
  /** 底栏（状态栏——桌面应用惯例） */
  footer?: ReactNode;
  siderWidth?: number;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  /** 收起宽度（图标列宽度，默认 48） */
  collapsedWidth?: number;
  className?: string;
}

/**
 * 应用外壳骨架（→ Naive UI Layout 家族 /《前端目录结构方案》AppShell 形态）：
 * Header + Sider(可折叠) + Content + Footer 的桌面应用标准四区。
 * 折叠由受控回调 + 内建把手承担；折叠后 Sider 内容换图标列由调用方负责（sider 传什么渲染什么）。
 * 职责边界：只管布局，不管路由/主题/菜单数据（→ 菜单方案、主题色彩方案）。
 */
export function AppShell({ header, sider, children, footer, siderWidth = 208, collapsible = false, defaultCollapsed = false, collapsedWidth = 48, className }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const width = collapsed ? collapsedWidth : siderWidth;

  return (
    <div className={cn('ui-appshell', className)}>
      {header && <header className="ui-appshell__header">{header}</header>}
      <div className="ui-appshell__body">
        {sider && (
          <aside
            className={cn('ui-appshell__sider', collapsible && collapsed && 'ui-appshell__sider--collapsed')}
            style={{ width }}
            aria-label="侧栏"
          >
            <div className="ui-appshell__sider-content">{sider}</div>
            {collapsible && (
              <button
                type="button"
                className="ui-appshell__collapse"
                aria-expanded={!collapsed}
                aria-label={collapsed ? '展开侧栏' : '折叠侧栏'}
                onClick={() => setCollapsed((v) => !v)}
              >
                {collapsed ? '›' : '‹'}
              </button>
            )}
          </aside>
        )}
        <main className="ui-appshell__content">{children}</main>
      </div>
      {footer && <footer className="ui-appshell__footer">{footer}</footer>}
    </div>
  );
}
