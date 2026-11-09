import { useMemo, useState } from 'react';
import { cn } from '../lib/cn';
import { NotificationRouter } from '../components/NotificationRouter';
import { Badge } from '../components/Badge';
import { TextInput } from '../components/TextInput';
import { CATEGORIES, type DemoEntry } from './registry';
import './playground.css';

/**
 * 组件导航（Playground）：Element Plus 文档站风格——
 * 固定左侧分类菜单（分组标题 + 组件链接）+ 右侧实时交互演示区。
 * 挂载方式：把 PlaygroundApp 挂到项目任意路由（如 /ui）。
 * 外壳已提供 NotificationRouter（含 ToastProvider）——通知/Toast 类 demo 开箱即用。
 */
const SIDEBAR_KEY = 'ui-playground-sidebar-collapsed';

/** 侧栏收起态记忆（localStorage；读失败静默回退为展开） */
function readCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_KEY) === '1';
  } catch {
    return false;
  }
}

function writeCollapsed(v: boolean) {
  try {
    localStorage.setItem(SIDEBAR_KEY, v ? '1' : '0');
  } catch {
    /* 隐私模式等存储不可用：仅会话内记忆 */
  }
}

export function PlaygroundApp() {
  const [activeId, setActiveId] = useState<string>(CATEGORIES[0].items[0].id);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<boolean>(readCollapsed);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.map((c) => ({
      ...c,
      items: c.items.filter((d) => d.name.toLowerCase().includes(q)),
    })).filter((c) => c.items.length > 0);
  }, [query]);

  const active: DemoEntry | undefined = useMemo(
    () => CATEGORIES.flatMap((c) => c.items).find((d) => d.id === activeId),
    [activeId],
  );

  const activeCat = CATEGORIES.find((c) => c.items.some((d) => d.id === activeId));

  return (
    <NotificationRouter
      isWindowActive={() => true}
      showSystemNotification={async () => 'sent'}
      focusWindow={() => window.focus()}
    >
      <div className="ui-pg">
        {/* 侧栏 */}
        <aside className={cn('ui-pg__sidebar', collapsed && 'ui-pg__sidebar--collapsed')}>
          <div className="ui-pg__brand">
            <span className="ui-pg__logo">◆</span>
            <span className="ui-pg__title">组件导航</span>
            <Badge tone="primary">{CATEGORIES.flatMap((c) => c.items).length}</Badge>
          </div>
          <div className="ui-pg__search">
            <TextInput placeholder="搜索组件…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <nav className="ui-pg__menu">
            {filtered.map((cat) => (
              <div key={cat.id} className="ui-pg__group">
                <div className="ui-pg__group-name">{cat.name}</div>
                {cat.items.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className={cn('ui-pg__link', d.id === activeId && 'ui-pg__link--active')}
                    onClick={() => setActiveId(d.id)}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* 收起/展开把手：常驻可见 */}
        <button
          type="button"
          className={cn('ui-pg__collapse', collapsed && 'ui-pg__collapse--collapsed')}
          aria-expanded={!collapsed}
          aria-label={collapsed ? '展开菜单' : '收起菜单'}
          title={collapsed ? '展开菜单' : '收起菜单'}
          onClick={() => {
            setCollapsed((v) => {
              writeCollapsed(!v);
              return !v;
            });
          }}
        >
          {collapsed ? '›' : '‹'}
        </button>

        {/* 主区 */}
        <main className="ui-pg__main">
          {active ? (
            <>
              <header className="ui-pg__header">
                <div className="ui-pg__header-left">
                  <h1 className="ui-pg__component-name">{active.name}</h1>
                  {activeCat && <span className="ui-pg__component-cat">{activeCat.name}</span>}
                </div>
                {active.description && <p className="ui-pg__component-desc">{active.description}</p>}
              </header>
              <div className="ui-pg__demo-area">
                <active.Component />
              </div>
            </>
          ) : (
            <div className="ui-pg__notfound">
              <p>没有匹配的组件</p>
            </div>
          )}
        </main>
      </div>
    </NotificationRouter>
  );
}
