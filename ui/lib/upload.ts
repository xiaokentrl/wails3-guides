import { useRef, useState } from 'react';
/**
 * 文件分片工具：Upload 分片/断点续传的调用方侧原语（组件契约 upload(file) 不变，
 * 分片上传 = 调用方先 splitFile 再逐片调接口 →《长任务与后台工作技术方案》任务化）。
 */

export interface FileChunk {
  index: number;
  start: number;
  end: number;
  blob: Blob;
}

export function splitFile(file: File, chunkSize = 4 * 1024 * 1024): FileChunk[] {
  const chunks: FileChunk[] = [];
  for (let start = 0, index = 0; start < file.size; start += chunkSize, index++) {
    const end = Math.min(start + chunkSize, file.size);
    chunks.push({ index, start, end, blob: file.slice(start, end) });
  }
  return chunks;
}

/** 片级断点续传的进度记账（已完成片索引集合 → 百分比）。 */
export function chunkProgress(done: Set<number>, total: number): number {
  if (total === 0) return 100;
  return Math.round((done.size / total) * 100);
}

/* ---- 断点续传钩子（→《分片上传与断点续传方案》协议七环；协议由调用方注入，本钩子管编排） ----
 * 源文件指纹抽查归调用方：在 uploadChunk 实现内校验文件 mtime/hash，
 * 变更即 throw（走重试→failed 路径）并作废任务——钩子不自行判定文件变更。 ---- */

export interface ResumableUploadContract {
  /** 预检：返回 uploadId 与服务端已收片索引（断点起点） */
  init: (file: File) => Promise<{ uploadId: string; existing: number[] }>;
  /** 单片上传（幂等：uploadId + index）；失败应 reject 以触发重试 */
  uploadChunk: (uploadId: string, index: number, blob: Blob) => Promise<void>;
  /** 合并：全片到位后调用（服务端终检） */
  complete: (uploadId: string) => Promise<void>;
  chunkSize?: number;
  /** 片并发上限（默认 3） */
  concurrency?: number;
  /** 单片重试次数（默认 2，指数退避） */
  retries?: number;
}

export interface ResumableState {
  status: 'idle' | 'preparing' | 'uploading' | 'paused' | 'completed' | 'failed';
  progress: number;
  error?: string;
  uploadId?: string;
  /** 暂停恢复所需的源文件（内存态，不持久化） */
  file?: File;
}

export interface ResumableControls {
  start: (file: File) => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
}

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

export function useResumableUpload(contract: ResumableUploadContract): { state: ResumableState; controls: ResumableControls } {
  const [state, setState] = useState<ResumableState>({ status: 'idle', progress: 0 });
  const stateRef = useRef(state);
  stateRef.current = state;
  const pausedRef = useRef(false);
  const cancelledRef = useRef(false);
  const contractRef = useRef(contract);
  contractRef.current = contract;
  const abortRef = useRef<(() => void) | null>(null);

  const controls: ResumableControls = {
    start: (file: File) => {
      // 双启动守卫：preparing / uploading 期间忽略再次 start
      if (stateRef.current.status === 'preparing' || stateRef.current.status === 'uploading') return;
      cancelledRef.current = false;
      pausedRef.current = false;
      setState({ status: 'preparing', progress: 0, file });
      void runUpload(file);
    },
    pause: () => {
      pausedRef.current = true;
      setState((s) => (s.status === 'uploading' ? { ...s, status: 'paused' } : s));
    },
    resume: () => {
      if (stateRef.current.status !== 'paused' || !stateRef.current.file) return;
      pausedRef.current = false;
      setState((s) => ({ ...s, status: 'uploading' }));
      void runUpload(stateRef.current.file!, stateRef.current.uploadId);
    },
    cancel: () => {
      cancelledRef.current = true;
      pausedRef.current = true;
      abortRef.current?.();
      setState({ status: 'idle', progress: 0 });
    },
  };

  async function runUpload(file: File, existingUploadId?: string) {
    const c = contractRef.current;
    const chunkSize = c.chunkSize ?? 4 * 1024 * 1024;
    const concurrency = c.concurrency ?? 3;
    const retries = c.retries ?? 2;
    try {
      // 环 1 预检：恢复时带 uploadId 跳过 init（本地 uploadId 仍在），否则新建
      let uploadId = existingUploadId ?? '';
      let existing: number[] = [];
      if (uploadId) {
        // 恢复：重新预检拿服务端已收片（服务端为准）
        const r = await c.init(file);
        uploadId = r.uploadId;
        existing = r.existing ?? []; // existing 为可选契约字段——恢复路径不得因缺字段崩掉
      } else {
        const r = await c.init(file);
        uploadId = r.uploadId;
        existing = r.existing ?? []; // existing 为可选契约字段——fresh 路径同样不得因缺字段崩掉
      }
      if (cancelledRef.current) {
        // preparing 期间被取消：回 idle，不进入上传
        setState({ status: 'idle', progress: 0 });
        return;
      }
      const chunks = splitFile(file, chunkSize);
      const done = new Set(existing.filter((i) => i >= 0 && i < chunks.length));
      setState((s) => ({ ...s, status: 'uploading', progress: chunkProgress(done, chunks.length), uploadId })); // 展开：file 等字段必须保留（resume 依赖）

      let cursor = 0;
      let failed: string | null = null;
      abortRef.current = () => {
        pausedRef.current = true;
      };

      const worker = async () => {
        for (;;) {
          if (cancelledRef.current || pausedRef.current || failed) return;
          const i = cursor++;
          if (i >= chunks.length || done.has(i)) {
            if (i >= chunks.length) return;
            continue;
          }
          let attempt = 0;
          for (;;) {
            try {
              await c.uploadChunk(uploadId, i, chunks[i].blob);
              done.add(i);
              setState((s) => ({ ...s, progress: chunkProgress(done, chunks.length) }));
              break;
            } catch (err) {
              if (cancelledRef.current || pausedRef.current) return;
              attempt += 1;
              if (attempt > retries) {
                failed = `分片 ${i} 重试 ${retries} 次后仍失败`;
                return;
              }
              await wait(300 * 2 ** (attempt - 1));
            }
          }
        }
      };

      await Promise.all(Array.from({ length: Math.min(concurrency, chunks.length) }, worker));
      if (cancelledRef.current) return;
      if (failed) {
        setState((s) => ({ status: 'failed', progress: s.progress, error: failed ?? undefined, uploadId }));
        return;
      }
      if (pausedRef.current) return; // 暂停：保留 uploadId 与服务端断点
      if (done.size < chunks.length) {
        // 未传完（暂停中断了循环）→ 保持暂停态
        setState((s) => ({ ...s, status: 'paused' }));
        return;
      }
      await c.complete(uploadId);
      setState({ status: 'completed', progress: 100, uploadId });
    } catch (err) {
      console.error('RUNUPLOAD-FAIL:', err);
      if (cancelledRef.current) return;
      setState((s) => ({ status: 'failed', progress: s.progress, error: err instanceof Error ? err.message : String(err), uploadId: s.uploadId }));
    }
  }

  return { state, controls };
}
