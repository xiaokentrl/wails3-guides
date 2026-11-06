import { useEffect, useState } from 'react';

/** 媒体查询钩子（响应式原语；容器查询支持差异 → 组件库方案引擎基线，暂以视口为准）。 */
export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = (e: MediaQueryListEvent) => setMatch(e.matches);
    setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);

  return match;
}

export type Breakpoint = 'base' | 'sm' | 'md' | 'lg';

const BREAKPOINTS: { name: Exclude<Breakpoint, 'base'>; query: string }[] = [
  { name: 'md', query: '(min-width: 768px)' },
  { name: 'lg', query: '(min-width: 1024px)' },
];

/** 断点钩子：base < sm(576) < md(768) < lg(1024)。阈值随项目登记（→ 性能/组件卡）。 */
export function useBreakpoint(): Breakpoint {
  const md = useMediaQuery(BREAKPOINTS[0].query);
  const lg = useMediaQuery(BREAKPOINTS[1].query);
  const sm = useMediaQuery('(min-width: 576px)');
  if (lg) return 'lg';
  if (md) return 'md';
  if (sm) return 'sm';
  return 'base';
}
