import { DragEvent, ReactNode, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { Badge } from './Badge';
import { IconButton } from './IconButton';
import './Upload.css';

/** 上传上下文：进度上报 + 取消信号（→ 任务队列取消链、防抖与节流方案进度节流） */
export interface UploadContext {
  signal: AbortSignal;
  onProgress: (loaded: number, total: number) => void;
}

export interface UploadProps {
  /**
   * 上传由调用方实现（分片/断点 →《分片上传与断点续传方案》；使用 ctx.signal 响应取消、
   * ctx.onProgress 上报字节进度——节流后呈现在组件侧）。失败 reject 非 AbortError。
   */
  upload?: (file: File, ctx: UploadContext) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

type ItemState = 'pending' | 'uploading' | 'done' | 'error' | 'canceled';
interface Item {
  key: string;
  name: string;
  size: number;
  state: ItemState;
  loaded: number;
  error?: string;
}

/**
 * 上传（拖拽 + 点击）：文件收集、**逐文件字节进度**、**逐文件取消**（AbortController）。
 * 状态机：pending → uploading → done / canceled / error（失败带原因 + 重试入口）。
 * 分片/断点续传的协议在调用方（→ 分片上传与断点续传方案）。
 */
export function Upload({ upload, accept, multiple, disabled, children, className }: UploadProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const counter = useRef(0);
  const controllers = useRef(new Map<string, AbortController>());

  const patch = (key: string, patchObj: Partial<Item>) =>
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patchObj } : it)));

  const add = (files: FileList | null) => {
    if (!files || disabled) return;
    for (const f of Array.from(files)) {
      const key = `${f.name}-${f.size}-${++counter.current}`;
      const controller = new AbortController();
      controllers.current.set(key, controller);
      const item: Item = {
        key, name: f.name, size: f.size,
        state: upload ? 'uploading' : 'pending',
        loaded: 0,
      };
      setItems((prev) => [...prev, item]);
      if (upload) {
        upload(f, {
          signal: controller.signal,
          onProgress: (loaded, total) => patch(key, { loaded: Math.min(loaded, total || f.size) }),
        })
          .then(() => patch(key, { state: 'done', loaded: f.size }))
          .catch((err: unknown) => {
            controllers.current.delete(key);
            const aborted = err instanceof DOMException && err.name === 'AbortError';
            patch(key, aborted ? { state: 'canceled' } : { state: 'error', error: err instanceof Error ? err.message : String(err) });
          });
      }
    }
  };

  const cancel = (key: string) => {
    controllers.current.get(key)?.abort();
    controllers.current.delete(key);
  };

  const retry = (it: Item) => {
    // 重试 = 移除旧项并重新选择（文件对象不驻留内存；分片断点的重试在协议层续传）
    setItems((prev) => prev.filter((x) => x.key !== it.key));
    inputRef.current?.click();
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    add(e.dataTransfer.files);
  };

  return (
    <div className={cn('ui-upload', className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="上传文件"
        className={cn('ui-upload__zone', dragOver && 'ui-upload__zone--over')}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {children ?? (
          <>
            <span className="ui-upload__hint">点击或拖拽文件到此处上传</span>
            {accept && <Badge tone="neutral">{accept}</Badge>}
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          hidden
          onChange={(e) => {
            add(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      {items.length > 0 && (
        <ul className="ui-upload__list">
          {items.map((it) => {
            const uploading = it.state === 'uploading';
            const percent = it.size > 0 ? Math.round((it.loaded / it.size) * 100) : 0;
            return (
              <li key={it.key} className="ui-upload__item">
                <span className="ui-upload__name">{it.name}</span>
                <span className="ui-upload__size">{fmtSize(it.size)}</span>
                {uploading && (
                  <>
                    <span className="ui-upload__bar" aria-hidden="true">
                      <span className="ui-upload__fill" style={{ width: `${percent}%` }} />
                    </span>
                    <span className="ui-upload__percent">{percent}%</span>
                    <IconButton label={`取消上传 ${it.name}`} onClick={() => cancel(it.key)}>
                      ×
                    </IconButton>
                  </>
                )}
                {it.state === 'pending' && <Badge tone="neutral">待上传</Badge>}
                {it.state === 'done' && <Badge tone="success">完成</Badge>}
                {it.state === 'canceled' && (
                  <>
                    <Badge tone="neutral">已取消</Badge>
                    <button type="button" className="ui-upload__retry" onClick={() => retry(it)}>
                      重新选择
                    </button>
                  </>
                )}
                {it.state === 'error' && (
                  <>
                    <Badge tone="danger">失败</Badge>
                    <span className="ui-upload__error" title={it.error}>
                      {it.error}
                    </span>
                    <button type="button" className="ui-upload__retry" onClick={() => retry(it)}>
                      重试
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
