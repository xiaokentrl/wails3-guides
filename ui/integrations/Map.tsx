/**
 * 集成封装 · 地图（Leaflet）（→《组件库全景》专项能力层「地图」）。
 *
 * 严格套用 Chart.tsx 模式四件套：懒加载 peer 库 / Loading 兜底 / ResizeObserver 自适应 / 卸载即销毁。
 * **本库不导出它**（零运行时依赖纪律）——复制到项目并 `npm i leaflet` 后使用；
 * Leaflet 的 CSS 由使用方在项目入口引入（`import 'leaflet/dist/leaflet.css'`），
 *瓦片源（tile URL）属于项目决策，此处不内置。
 */
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '../components/Spinner';

export interface MapProps {
  /** 初始中心 [纬度, 经度] */
  center?: [number, number];
  /** 初始缩放（默认 13） */
  zoom?: number;
  /** 标记点 [纬度, 经度, 弹出文案?] */
  markers?: Array<[number, number, string?]>;
  height?: number | string;
  /** 瓦片源模板（{x}/{y}/{z}；默认 OpenStreetMap，离线场景换本地瓦片 →《网络与离线弹性技术方案》） */
  tileUrl?: string;
  onReady?: (map: unknown) => void;
}

export function Map({ center = [39.9042, 116.4074], zoom = 13, markers = [], height = 320, tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', onReady }: MapProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void; invalidateSize: () => void; setView: (c: [number, number], z: number) => void } | null>(null);
  const [ready, setReady] = useState(false);

  // 懒加载 + 初始化（首挂一次）
  useEffect(() => {
    let disposed = false;
    void (async () => {
      const L = await import('leaflet');
      if (disposed || !hostRef.current) return;
      const map = L.map(hostRef.current, { center, zoom });
      L.tileLayer(tileUrl, { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
      markers.forEach(([lat, lng, text]) => {
        L.marker([lat, lng]).addTo(map);
        if (text) L.marker([lat, lng]).bindPopup(text).openPopup();
      });
      mapRef.current = map as never;
      setReady(true);
      onReady?.(map);
    })();
    return () => {
      disposed = true;
      mapRef.current?.remove(); // 卸载即销毁（Leaflet 必须显式 remove，否则定时器/监听泄漏）
      mapRef.current = null;
    };
    // 首挂注入；center/zoom/markers 后续变化经 setView 处理（下方 effect）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // center/zoom 受控更新
  useEffect(() => {
    mapRef.current?.setView(center, zoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], zoom]);

  // 容器尺寸变化 → invalidateSize（虚拟容器/分栏拖拽后必须调，否则瓦片错位）
  useEffect(() => {
    if (!hostRef.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => mapRef.current?.invalidateSize());
    ro.observe(hostRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ position: 'relative', height }}>
      <div ref={hostRef} style={{ width: '100%', height: '100%' }} role="application" aria-label="地图" />
      {!ready && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--ui-surface)',
          }}
        >
          <Spinner />
        </div>
      )}
    </div>
  );
}
