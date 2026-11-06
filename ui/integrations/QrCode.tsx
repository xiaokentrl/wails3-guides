/**
 * 集成封装 · 二维码（qrcode）（→《组件库全景》数据展示；Naive UI QrCode 对照）。
 *
 * 套用 Chart.tsx 模式四件套：懒加载 peer 库 / Loading 兜底 / 自适应（尺寸 prop 直接定，无需 RO）/ 卸载即清理。
 * **本库不导出它**（零运行时依赖纪律）——复制到项目并 `npm i qrcode` 后使用。
 * 编码算法（Reed-Solomon）不自研——`qrcode` 库是权威实现。
 */
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '../components/Spinner';

export interface QrCodeProps {
  /** 编码内容（URL / 文本；空串不渲染） */
  value: string;
  /** 画布边长（px，默认 160） */
  size?: number;
  /** 纠错级别（L 7% / M 15% / Q 25% / H 30%，默认 M） */
  level?: 'L' | 'M' | 'Q' | 'H';
  /** 前景/背景色（深浅主题联动 → 主题与色彩方案） */
  colorDark?: string;
  colorLight?: string;
  className?: string;
}

export function QrCode({ value, size = 160, level = 'M', colorDark = '#1c2430', colorLight = '#ffffff', className }: QrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setReady(false); // 空值回退到 Loading 遮罩——不残留旧二维码
      return;
    }
    let disposed = false;
    void (async () => {
      const QRCode = (await import('qrcode')).default;
      if (disposed || !canvasRef.current) return;
      try {
        await QRCode.toCanvas(canvasRef.current, value, {
          width: size,
          errorCorrectionLevel: level,
          color: { dark: colorDark, light: colorLight },
          margin: 2,
        });
        setError(null);
        setReady(true);
      } catch (err) {
        // 内容超长等编码失败：显式错误态，不静默空白
        setError(err instanceof Error ? err.message : String(err));
      }
    })();
    return () => {
      disposed = true;
    };
  }, [value, size, level, colorDark, colorLight]);

  return (
    <div className={className} style={{ position: 'relative', width: size, height: size }} role="img" aria-label={error ? `二维码生成失败：${error}` : `二维码：${value.slice(0, 40)}`}>
      <canvas ref={canvasRef} style={{ display: ready ? 'block' : 'none' }} />
      {!ready && !error && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ui-surface)' }}>
          <Spinner />
        </div>
      )}
      {error && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            background: 'var(--ui-danger-soft)',
            color: 'var(--ui-danger)',
            fontSize: 'var(--ui-text-sm)',
            textAlign: 'center',
          }}
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
