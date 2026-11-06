/**
 * 集成封装 · 终端（xterm）（→《组件库全景》专项能力层「终端」）。
 *
 * 严格套用 Chart.tsx 模式四件套：懒加载 peer 库 / Loading 兜底 / ResizeObserver 自适应(fit) / 卸载即销毁。
 * **本库不导出它**（零运行时依赖纪律）——复制到项目并 `npm i @xterm/xterm @xterm/addon-fit` 后使用；
 * xterm 的 CSS 由使用方在项目入口引入（`import '@xterm/xterm/css/xterm.css'`）。
 *
 * 语义：Shell 的实现（连接本地 pty / 后端命令通道 →《系统能力与平台集成技术方案》）由调用方通过
 * onInput + ref API 完成——本封装只管 xterm 实例生命周期与适配，不做 I/O。
 */
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '../components/Spinner';

export interface TerminalProps {
  /** 欢迎语（挂载后立即写入，如 banner） */
  welcome?: string;
  /** 用户敲键回调（每键一触发，data 为原始字符/控制序列；回车为 \r） */
  onInput?: (data: string) => void;
  /** 主题跟随应用令牌（→ 主题与色彩方案；xterm 颜色集由 CSS 变量映射） */
  theme?: 'light' | 'dark';
  height?: number | string;
  onReady?: (term: TerminalRef) => void;
}

/** 命令式 API：外壳与调用方写屏的入口（React 不适合高频流式 write 走 props） */
export interface TerminalRef {
  write: (data: string) => void;
  writeln: (line: string) => void;
  clear: () => void;
}

export function Terminal({ welcome, onInput, theme = 'dark', height = 260, onReady }: TerminalProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<{ write: (d: string) => void; clear: () => void; dispose: () => void; onData: (cb: (d: string) => void) => { dispose: () => void }; loadAddon: (a: unknown) => void } | null>(null);
  const fitRef = useRef<{ fit: () => void } | null>(null);
  const disposedRef = useRef(false);
  const [ready, setReady] = useState(false);

  // 懒加载 + 创建（首挂一次）
  useEffect(() => {
    disposedRef.current = false;
    void (async () => {
      const [{ Terminal: XTerm }, { FitAddon }] = await Promise.all([import('@xterm/xterm'), import('@xterm/addon-fit')]);
      if (disposedRef.current || !hostRef.current) return;
      const term = new XTerm({
        convertEol: true,
        cursorBlink: true,
        // 令牌映射：仅前景/背景/光标取语义令牌；16 色板保持 xterm 默认（完整映射属主题方案深化项）
        theme: theme === 'dark' ? { background: '#0e1522', foreground: '#e6edf3' } : { background: '#ffffff', foreground: '#1c2430' },
        fontFamily: 'var(--ui-font-mono, monospace)',
      });
      const fit = new FitAddon();
      term.loadAddon(fit);
      term.open(hostRef.current);
      fit.fit();
      term.onData((d) => onInput?.(d));
      if (welcome) term.write(welcome);
      termRef.current = term as never;
      fitRef.current = fit as never;
      setReady(true);
      onReady?.({
        write: (d: string) => term.write(d),
        writeln: (line: string) => term.write(`${line}\r\n`),
        clear: () => term.clear(),
      });
    })();
    return () => {
      disposedRef.current = true;
      termRef.current?.dispose(); // 卸载即销毁
      termRef.current = null;
      fitRef.current = null;
    };
    // 首挂创建；onInput/welcome 变化经闭包外最新值处理（调用方用 ref 保持回调稳定）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 主题切换（重建即最简：xterm theme 可运行时 set）
  useEffect(() => {
    const term = termRef.current as null | { options: { theme: Record<string, string> } };
    if (!term || !ready) return;
    term.options.theme = theme === 'dark' ? { background: '#0e1522', foreground: '#e6edf3' } : { background: '#ffffff', foreground: '#1c2430' };
  }, [theme, ready]);

  // 容器尺寸变化 → fit（→ 与 Splitter 分栏拖拽天然配合）
  useEffect(() => {
    if (!hostRef.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => fitRef.current?.fit());
    ro.observe(hostRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ position: 'relative', height }}>
      <div ref={hostRef} style={{ width: '100%', height: '100%' }} role="terminal" aria-label="终端" />
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
