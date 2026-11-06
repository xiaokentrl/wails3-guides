/**
 * 集成封装 · 代码编辑器（Monaco）（→《组件库全景》专项能力层「代码编辑器」）。
 *
 * 严格套用 Chart.tsx 模式四件套：懒加载 peer 库 / Loading 兜底 / ResizeObserver 自适应 / 卸载即销毁。
 * **本库不导出它**（零运行时依赖纪律）——复制到项目并 `npm i monaco-editor` 后使用。
 *
 * Worker 纪律：Monaco 的语言服务跑在 Web Worker——不配 MonacoEnvironment 时
 * 语言智能（跳转/诊断）静默降级为纯高亮编辑器（编辑本身仍可用）。
 * Vite 下用 `?worker` 导入 + getWorker 工厂，无需 webpack 插件。
 */
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '../components/Spinner';

export interface CodeEditorProps {
  value: string;
  /** 语言 id（monaco 语言名：typescript / javascript / json / html / css / markdown …） */
  language?: string;
  /** 主题跟随应用令牌：light → 'vs'，dark → 'vs-dark' */
  theme?: 'light' | 'dark';
  onChange?: (v: string) => void;
  height?: number | string;
  readOnly?: boolean;
  onReady?: (editor: unknown) => void;
}

/** Vite ?worker 导入（类型见使用方 ambient 声明：`declare module '*?worker'`） */
import EditorWorker from 'monaco-editor/editor/editor.worker?worker';
import TsWorker from 'monaco-editor/language/typescript/ts.worker?worker';
import JsonWorker from 'monaco-editor/language/json/json.worker?worker';
import HtmlWorker from 'monaco-editor/language/html/html.worker?worker';
import CssWorker from 'monaco-editor/language/css/css.worker?worker';

interface MonacoEditorLike {
  getValue: () => string;
  setValue: (v: string) => void;
  layout: () => void;
  dispose: () => void;
  onDidChangeModelContent: (cb: () => void) => { dispose: () => void };
  updateOptions: (o: Record<string, unknown>) => void;
  getModel: () => unknown;
}

export function CodeEditor({ value, language = 'typescript', theme = 'light', onChange, height = 280, readOnly = false, onReady }: CodeEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<MonacoEditorLike | null>(null);
  const applyingRef = useRef(false); // setValue 触发的 content 变化不回灌 onChange（防受控回环）
  const disposedRef = useRef(false);
  const [ready, setReady] = useState(false);

  // 懒加载 + worker 配置 + 创建（首挂一次）
  useEffect(() => {
    disposedRef.current = false;
    void (async () => {
      const monaco = await import('monaco-editor/editor/editor.api.js');
      if (disposedRef.current || !hostRef.current) return;
      // Worker 工厂：语言服务不配则静默降级（编辑仍可用）
      (self as never as { MonacoEnvironment: { getWorker: (id: string, label: string) => Worker } }).MonacoEnvironment = {
        getWorker(_id: string, label: string) {
          if (label === 'typescript' || label === 'javascript') return new TsWorker();
          if (label === 'json') return new JsonWorker();
          if (label === 'html') return new HtmlWorker();
          if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker();
          return new EditorWorker();
        },
      };
      const editor = monaco.editor.create(hostRef.current, {
        value,
        language,
        theme: theme === 'dark' ? 'vs-dark' : 'vs',
        readOnly,
        minimap: { enabled: false },
        automaticLayout: false, // 自适应统一走 ResizeObserver（模式一致）
        fontSize: 13,
      });
      editor.onDidChangeModelContent(() => {
        if (applyingRef.current) return;
        onChange?.(editor.getValue());
      });
      editorRef.current = editor as never;
      setReady(true);
      onReady?.(editor);
    })();
    return () => {
      disposedRef.current = true;
      editorRef.current?.dispose(); // 卸载即销毁
      editorRef.current = null;
    };
    // 首挂创建；value/language/theme/readOnly 变化经后续 effect 同步
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 受控 value 同步：外部值进来时 setValue（applying 防回环）
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !ready) return;
    if (editor.getValue() !== value) {
      applyingRef.current = true;
      editor.setValue(value);
      applyingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, ready]);

  // language / readOnly 更新
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !ready) return;
    void (async () => {
      const monaco = await import('monaco-editor/editor/editor.api.js');
      if (disposedRef.current) return;
      monaco.editor.setModelLanguage(editor.getModel() as never, language);
    })();
    editor.updateOptions({ readOnly });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, readOnly, ready]);

  // theme 更新
  useEffect(() => {
    if (!ready) return;
    void (async () => {
      const monaco = await import('monaco-editor/editor/editor.api.js');
      if (disposedRef.current) return;
      monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs');
    })();
  }, [theme, ready]);

  // 自适应：容器尺寸变化 → layout
  useEffect(() => {
    if (!hostRef.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => editorRef.current?.layout());
    ro.observe(hostRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ position: 'relative', height }}>
      <div ref={hostRef} style={{ width: '100%', height: '100%' }} role="textbox" aria-label="代码编辑器" aria-multiline="true" />
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
