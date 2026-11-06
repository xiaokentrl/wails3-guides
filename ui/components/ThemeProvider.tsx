import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  /** 跟随系统 */
  followSystem: boolean;
  setFollowSystem: (v: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): Theme {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** 主题上下文：管理明暗切换（跟随系统 + 手动覆盖），并同步 data-theme 到根节点。 */
export function ThemeProvider({ children, defaultTheme = 'light', defaultFollowSystem = true }: { children: ReactNode; defaultTheme?: Theme; defaultFollowSystem?: boolean }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [followSystem, setFollowSystemState] = useState(defaultFollowSystem);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!followSystem) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', on);
    setTheme(mq.matches ? 'dark' : 'light');
    return () => mq.removeEventListener('change', on);
  }, [followSystem]);

  const setFollowSystem = useCallback((v: boolean) => {
    setFollowSystemState(v);
    if (v) setTheme(getSystemTheme());
  }, []);

  const setThemeManual = useCallback((t: Theme) => {
    setFollowSystemState(false);
    setTheme(t);
  }, []);

  const value = useMemo(() => ({ theme, setTheme: setThemeManual, followSystem, setFollowSystem }), [theme, setThemeManual, followSystem, setFollowSystem]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme 必须在 <ThemeProvider> 内使用');
  return ctx;
}
