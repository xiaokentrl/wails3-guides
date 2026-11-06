import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './NavMenu.css';

export interface NavMenuItem {
  key: string;
  label: ReactNode;
  /** 子菜单（有则渲染下拉） */
  children?: NavMenuItem[];
  disabled?: boolean;
}

export interface NavMenuProps {
  items: NavMenuItem[];
  /** 当前激活 key（受控） */
  activeKey?: string;
  onSelect?: (key: string) => void;
  className?: string;
}

/**
 * 水平导航菜单（→ Naive UI Menu horizontal 模式；垂直导航走 TreeMenu——两者互补不重复）。
 * 顶项点击直接选中；带 children 的顶项点击弹出下拉（点外/Esc 关），子项点击选中并关闭。
 * 激活态同时点亮顶项与其子项（选中"文件-导出"时"文件"保持高亮）。
 */
export function NavMenu({ items, activeKey, onSelect, className }: NavMenuProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openKey) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpenKey(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenKey(null);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openKey]);

  const isActive = (item: NavMenuItem): boolean => {
    if (item.key === activeKey) return true;
    return !!item.children?.some((c) => isActive(c));
  };

  return (
    <nav ref={rootRef} className={cn('ui-navmenu', className)} aria-label="水平导航">
      <ul className="ui-navmenu__bar" role="menubar">
        {items.map((item) => {
          const hasChildren = !!item.children?.length;
          const active = isActive(item);
          return (
            <li key={item.key} className="ui-navmenu__item" style={{ position: 'relative' }}>
              <button
                type="button"
                role="menuitem"
                aria-haspopup={hasChildren || undefined}
                aria-expanded={hasChildren ? openKey === item.key : undefined}
                aria-disabled={item.disabled || undefined}
                className={cn('ui-navmenu__top', active && 'ui-navmenu__top--active', openKey === item.key && 'ui-navmenu__top--open', item.disabled && 'ui-navmenu__top--disabled')}
                onClick={() => {
                  if (item.disabled) return;
                  if (hasChildren) setOpenKey((k) => (k === item.key ? null : item.key));
                  else {
                    setOpenKey(null);
                    onSelect?.(item.key);
                  }
                }}
              >
                {item.label}
                {hasChildren && <span className="ui-navmenu__arrow" aria-hidden="true">▾</span>}
              </button>
              {hasChildren && openKey === item.key && (
                <ul role="menu" aria-label={typeof item.label === 'string' ? item.label : '子菜单'} className="ui-navmenu__dropdown">
                  {item.children!.map((child) => (
                    <li key={child.key}>
                      <button
                        type="button"
                        role="menuitem"
                        aria-disabled={child.disabled || undefined}
                        className={cn('ui-navmenu__sub', child.key === activeKey && 'ui-navmenu__sub--active', child.disabled && 'ui-navmenu__sub--disabled')}
                        onClick={() => {
                          if (child.disabled) return;
                          setOpenKey(null);
                          onSelect?.(child.key);
                        }}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
