/**
 * 集成封装 · 富文本（TipTap）（→《组件库全景》专项能力层「富文本」）。
 *
 * 套用 Chart.tsx 模式四件套：懒加载 peer 库 / Loading 兜底 / ResizeObserver（TipTap 自适应无需额外处理，保留模式一致性见下方注释）/ 卸载即销毁。
 * **本库不导出它**（零运行时依赖纪律）——复制到项目并 `npm i @tiptap/react @tiptap/pm @tiptap/starter-kit` 后使用。
 *
 * 安全纪律：value 是 HTML——消费方存储/回显须走消毒（DOMPurify，→《安全边界与权限技术方案》），
 * 本封装不消毒（编辑器自身 React 渲染不受 XSS 影响，但导出的 HTML 进入危险场景前必须消毒）。
 */
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '../components/Spinner';

export interface RichTextProps {
  /** HTML 内容（受控；导出前消毒由调用方负责） */
  value: string;
  onChange?: (html: string) => void;
  readOnly?: boolean;
  height?: number | string;
  /** 扩展注入（默认 StarterKit；表格/任务列表等属项目决策） */
  onReady?: (editor: unknown) => void;
}

interface TiptapModules {
  useEditor: typeof import('@tiptap/react')['useEditor'];
  EditorContent: typeof import('@tiptap/react')['EditorContent'];
  StarterKit: typeof import('@tiptap/starter-kit')['StarterKit'];
}

export function RichText({ value, onChange, readOnly = false, height = 220, onReady }: RichTextProps) {
  const [modules, setModules] = useState<TiptapModules | null>(null);
  const disposedRef = useRef(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // 懒加载（TipTap 是 React 组件库——useEditor 必须在组件内调用，
  // 故分两层：外层拉模块，内层 Inner 消费 hooks）
  useEffect(() => {
    disposedRef.current = false;
    void (async () => {
      const [{ useEditor, EditorContent }, { StarterKit }] = await Promise.all([
        import('@tiptap/react'),
        import('@tiptap/starter-kit'),
      ]);
      if (disposedRef.current) return;
      setModules({ useEditor, EditorContent, StarterKit });
    })();
    return () => {
      disposedRef.current = true;
    };
  }, []);

  if (!modules) {
    return (
      <div style={{ position: 'relative', height }}>
        <Spinner />
      </div>
    );
  }
  return <RichTextInner modules={modules} value={value} onChangeRef={onChangeRef} readOnly={readOnly} height={height} onReady={onReady} />;
}

function RichTextInner({
  modules,
  value,
  onChangeRef,
  readOnly,
  height,
  onReady,
}: {
  modules: TiptapModules;
  value: string;
  onChangeRef: React.MutableRefObject<((html: string) => void) | undefined>;
  readOnly: boolean;
  height: number | string;
  onReady?: (editor: unknown) => void;
}) {
  const editor = modules.useEditor(
    {
      extensions: [modules.StarterKit],
      content: value,
      editable: !readOnly,
      onUpdate: ({ editor: ed }: { editor: { getHTML: () => string } }) => {
        onChangeRef.current?.(ed.getHTML());
      },
      onCreate: ({ editor: ed }: { editor: unknown }) => {
        onReady?.(ed);
      },
    },
    [],
  );

  // 受控 value 同步：外部值进来且与当前不同才 setContent（防光标跳动与回环）
  const editorAny = editor as unknown as null | {
    getHTML: () => string;
    isEditable: boolean;
    commands: { setContent: (c: string, emitUpdate: boolean) => void };
    setEditable: (v: boolean) => void;
  };
  const appliedValue = useRef(value);
  useEffect(() => {
    if (!editorAny) return;
    editorAny.setEditable(!readOnly);
  }, [readOnly, editorAny]);
  useEffect(() => {
    if (!editorAny) return;
    if (appliedValue.current === value) return;
    if (editorAny.getHTML() === value) return;
    appliedValue.current = value;
    editorAny.commands.setContent(value, false); // false = 不触发 onUpdate（防回环）
  }, [value, editorAny]);

  return (
    <div style={{ position: 'relative', height, overflowY: 'auto' }} role="textbox" aria-multiline="true" aria-label="富文本编辑器">
      <modules.EditorContent editor={editor} />
    </div>
  );
}
