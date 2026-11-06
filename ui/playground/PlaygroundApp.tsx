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
export function PlaygroundApp() {
  const [activeId, setActiveId] = useState<string>(CATEGORIES[0].items[0].id);
  const [query, setQuery] = useState('');

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
        <aside className="ui-pg__sidebar">
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
