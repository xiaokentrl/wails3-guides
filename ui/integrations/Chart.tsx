/**
 * 集成封装示范 · 图表（→《组件库全景》专项能力层「图表/可视化」）。
 *
 * 这是**集成封装的模式模板**：懒加载外部库、Loading 兜底、ResizeObserver 自适应、卸载即销毁。
 * 复制本文件到项目并安装 peer 库（echarts）后使用——**本库不导出它**（零运行时依赖纪律，
 * 外部库依赖属于项目决策，→ 分发方案供应链门禁）。
 *
 * 同一模式适用于：代码编辑器（Monaco）、地图（Leaflet/MapLibre）、富文本（TipTap）、白板（tldraw）。
 */
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '../components/Spinner';

export interface ChartProps {
  /** ECharts option（结构由项目期锁定的图表库版本决定，**待验证**） */
  option: Record<string, unknown>;
  height?: number | string;
  /** 主题跟随应用令牌的方式：传入当前主题名（→ 主题与色彩方案） */
  theme?: 'light' | 'dark';
  onReady?: (instance: unknown) => void;
}

export function Chart({ option, height = 280, theme = 'light', onReady }: ChartProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<{ setOption: (o: unknown) => void; resize: () => void; dispose: () => void } | null>(null);
  const [ready, setReady] = useState(false);

  // 懒加载：首次挂载才拉取图表库（代码分割 → 性能方案启动路径「可惰性」）
  useEffect(() => {
    let disposed = false;
    void (async () => {
      const echarts = await import('echarts');
      if (disposed || !hostRef.current) return;
      const instance = echarts.init(hostRef.current, theme);
      instance.setOption(option);
      instanceRef.current = instance;
      setReady(true);
      onReady?.(instance);
    })();
    return () => {
      disposed = true;
      instanceRef.current?.dispose(); // 卸载即销毁：不依赖 GC
      instanceRef.current = null;
    };
    // option 首挂注入；后续更新走第二个 effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // option 更新：setOption 增量合并
  useEffect(() => {
    instanceRef.current?.setOption(option);
  }, [option]);

  // 自适应：容器尺寸变化 → resize（→ 窗口方案的 DIP 策略联动）
  useEffect(() => {
    if (!hostRef.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => instanceRef.current?.resize());
    ro.observe(hostRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ position: 'relative', height }}>
      <div ref={hostRef} style={{ width: '100%', height: '100%' }} role="img" aria-label="图表" />
      {!ready && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner />
        </div>
      )}
    </div>
  );
}

