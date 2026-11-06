/**
 * 集成封装 · 白板（tldraw）（→《组件库全景》专项能力层「白板」）。
 *
 * 套用 Chart.tsx 模式：懒加载 peer 库（React.lazy）/ Loading 兜底 / 卸载即销毁（Tldraw 卸载自动清理）。
 * **本库不导出它**（零运行时依赖纪律）——复制到项目并 `npm i tldraw` 后使用；
 * tldraw 的 CSS 由本封装引入（`tldraw/tldraw.css`），与 Leaflet 的「使用方引入」不同——
 * 因为 tldraw 不带样式完全不可用，而 Leaflet 主题化常需覆盖。持久化 persistenceKey 属项目决策
 * （localStorage / 云端快照 →《状态持久化方案》）。
 */
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Spinner } from '../components/Spinner';

// React 组件形态的 peer 库——React.lazy 即懒加载（模式四件套的「懒加载」在此语境的标准形态）
const Tldraw = lazy(() =>
  import('tldraw').then((m) => ({ default: m.Tldraw as unknown as React.ComponentType<Record<string, unknown>> })),
);

export interface WhiteboardProps {
  /** 持久化键（传 null = 内存态；传字符串 = localStorage 键，项目决策） */
  persistenceKey?: string | null;
  height?: number | string;
  onReady?: (editor: unknown) => void;
}

export function Whiteboard({ persistenceKey = null, height = 360, onReady }: WhiteboardProps) {
  const mountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // tldraw 挂载重（初始化画布/工具栏）——首帧挂载后再渲染，配合 Suspense 的 Loading 兜底
  useEffect(() => {
    mountedRef.current = true;
    setMounted(true);
    return () => {
      mountedRef.current = false;
    };
  }, []);

  if (!mounted) {
    return (
      <div style={{ position: 'relative', height }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height }} role="application" aria-label="白板">
      <Suspense
        fallback={
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ui-surface)' }}>
            <Spinner />
          </div>
        }
      >
        <Tldraw
          persistenceKey={persistenceKey ?? undefined}
          onMount={(editor: unknown) => onReady?.(editor)}
        />
      </Suspense>
    </div>
  );
}
