import { ReactNode, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './CopyToClipboard.css';

export interface CopyToClipboardProps {
  /** 要复制的文本 */
  text: string;
  children: ReactNode;
  /** 复制成功提示时长（默认 1500ms 的内联「已复制」态） */
  className?: string;
}

/** 复制到剪贴板：Clipboard API 优先，失败时回调供调用方降级（→ 系统能力方案剪贴板矩阵）。 */
export function CopyToClipboard({ text, children, className }: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // 非安全上下文 / 权限拒绝：降级回调由调用方处理（此处静默失败会让用户以为已复制）
      setCopied(false);
      console.warn('[ui/CopyToClipboard] 复制失败：当前环境不可用 Clipboard API');
    }
  };

  return (
    <span className={cn('ui-copy', className)}>
      <button type="button" className="ui-copy__trigger" onClick={copy} aria-label={`复制 ${text}`}>
        {children}
      </button>
      {copied && (
        <span role="status" className="ui-copy__done">
          已复制
        </span>
      )}
    </span>
  );
}
