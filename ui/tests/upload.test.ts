/**
 * 断点续传测试（→《分片上传与断点续传方案》测试矩阵的编排层用例；协议 Mock 注入）。
 * 覆盖：断点跳片、单片重试、重试耗尽 failed、暂停恢复、取消。
 */
import { describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useResumableUpload, type ResumableUploadContract } from '../lib/upload';

function makeFile(size: number): File {
  return new File([new Uint8Array(size)], 'a.bin');
}

function makeContract(overrides: Partial<ResumableUploadContract> = {}) {
  const init = vi.fn(async () => ({ uploadId: 'u1', existing: [] }));
  const uploadChunk = vi.fn(async () => {});
  const complete = vi.fn(async () => {});
  return {
    contract: { init, uploadChunk, complete, chunkSize: 100, concurrency: 3, retries: 1, ...overrides },
    init, uploadChunk, complete,
  };
}

describe('useResumableUpload', () => {
  it('断点跳过服务端已收片（服务端为准）', async () => {
    const init = vi.fn(async () => ({ uploadId: 'u1', existing: [0, 1] }));
    const { contract, uploadChunk, complete } = makeContract({ init });
    const { result } = renderHook(() => useResumableUpload(contract));
    act(() => result.current.controls.start(makeFile(300)));
    await waitFor(() => expect(result.current.state.status).toBe('completed'));
    expect(init).toHaveBeenCalledTimes(1);
    // 片 0、1 已在服务端 → 只传片 2
    expect(uploadChunk.mock.calls.map((c: unknown[]) => c[1])).toEqual([2]);
    expect(complete).toHaveBeenCalledWith('u1');
  });

  it('单片失败重试后完成', async () => {
    let calls = 0;
    const { contract, complete } = makeContract({
      chunkSize: 100,
      retries: 2,
      uploadChunk: async (_id: string, index: number) => {
        if (index === 1 && calls++ === 0) throw new Error('片校验失败');
      },
    });
    const { result } = renderHook(() => useResumableUpload(contract));
    act(() => result.current.controls.start(makeFile(300)));
    await waitFor(() => expect(result.current.state.status).toBe('completed'));
    expect(complete).toHaveBeenCalledWith('u1');
  });

  it('重试耗尽 → failed 并带原因', async () => {
    const { contract } = makeContract({
      chunkSize: 100,
      retries: 0,
      uploadChunk: async (_id: string, index: number) => {
        if (index === 1) throw new Error('片校验失败');
      },
    });
    const { result } = renderHook(() => useResumableUpload(contract));
    act(() => result.current.controls.start(makeFile(300)));
    await waitFor(() => expect(result.current.state.status).toBe('failed'));
    expect(result.current.state.error).toContain('分片 1');
    expect(result.current.state.progress).toBeGreaterThan(0); // 部分进度保留
  });

  it('暂停保留断点，恢复后完成', async () => {
    let release = () => {};
    const gate = new Promise<void>((r) => { release = r; });
    const uploadChunk = vi.fn(async (_id: string, index: number) => {
      if (index === 1) await gate; // 片 1 阻塞，制造暂停窗口
    });
    const { contract, complete } = makeContract({
      chunkSize: 100,
      uploadChunk,
    });
    const { result } = renderHook(() => useResumableUpload(contract));
    act(() => result.current.controls.start(makeFile(300)));
    await waitFor(() => expect(result.current.state.status).toBe('uploading'));
    act(() => result.current.controls.pause());
    release();
    await waitFor(() => expect(result.current.state.status).toBe('paused'));
    act(() => result.current.controls.resume());
    await waitFor(() => expect(result.current.state.status).toBe('completed'));
    expect(complete).toHaveBeenCalled();
    expect(uploadChunk).toHaveBeenCalled();
  });

  it('取消回到 idle 且不再上传', async () => {
    let blocked = true;
    let release = () => { blocked = false; };
    const uploadChunk = vi.fn(async (_id: string, index: number) => {
      if (index === 0) { while (blocked) await new Promise<void>((r) => setTimeout(r, 10)); }
    });
    const { contract } = makeContract({
      chunkSize: 100,
      uploadChunk,
    });
    const { result } = renderHook(() => useResumableUpload(contract));
    act(() => result.current.controls.start(makeFile(300)));
    await waitFor(() => expect(uploadChunk).toHaveBeenCalled());
    act(() => result.current.controls.cancel());
    release();
    await waitFor(() => expect(result.current.state.status).toBe('idle'));
    const callsAfterCancel = uploadChunk.mock.calls.length;
    await new Promise<void>((r) => setTimeout(r, 30));
    expect(uploadChunk.mock.calls.length).toBe(callsAfterCancel);
  });
});
