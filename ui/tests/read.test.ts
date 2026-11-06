/**
 * 读策略测试（→《全局一致性读策略》测试矩阵；SWR 首帧标记/迟到响应丢弃/错误保留陈旧/TTL 标记）。
 */
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthoritativeRead, useOfflineSnapshot, useStaleWhileRevalidate } from '../lib/read';

// 假时器只用于 TTL 用例——全局开假时器会让 RTL waitFor 与 vitest 不互认而永久挂起
beforeEach(() => {
  vi.useRealTimers();
});

describe('useStaleWhileRevalidate', () => {
  it('有 initialData：首帧陈旧呈现，后台刷新后替换', async () => {
    const fetcher = vi.fn().mockResolvedValue('新数据');
    const { result } = renderHook(() => useStaleWhileRevalidate(fetcher, [], { initialData: '旧数据' }));
    expect(result.current.data).toBe('旧数据'); // 首帧陈旧
    expect(result.current.isStale).toBe(true); // 标记由数据层给出
    await act(async () => {});
    expect(fetcher).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(result.current.data).toBe('新数据'));
    expect(result.current.isStale).toBe(false);
  });

  it('刷新失败保留陈旧值并给出错误', async () => {
    const fetcher = vi.fn().mockRejectedValueOnce(new Error('网络不可用'));
    const { result } = renderHook(() => useStaleWhileRevalidate(fetcher, [], { initialData: '旧数据' }));
    await waitFor(() => expect(result.current.error).toBe('网络不可用'));
    expect(result.current.data).toBe('旧数据'); // 不白屏
    expect(result.current.refreshing).toBe(false);
  });

  it('迟到响应被丢弃（竞态裁决）', async () => {
    const resolvers: Array<(v: string) => void> = []; // 队列式：第 n 次读对应第 n 个 resolver（覆盖式写法永远解不掉旧响应）
    const fetcher = vi.fn().mockImplementation(() => new Promise<string>((r) => resolvers.push(r)));
    const { result, rerender } = renderHook(({ tag }: { tag: number }) => useStaleWhileRevalidate(() => fetcher(tag), [tag]), { initialProps: { tag: 1 } });
    await act(async () => {});
    rerender({ tag: 2 }); // 第二次读发出
    await act(async () => {});
    act(() => resolvers[0]('第一次的迟到响应')); // 旧响应（tag=1）后到
    expect(result.current.data).not.toBe('第一次的迟到响应');
    act(() => resolvers[1]('新响应'));
    await waitFor(() => expect(result.current.data).toBe('新响应'));
  });

  it('TTL 到期标记陈旧（不自动刷）', async () => {
    vi.useFakeTimers(); // 本用例需要推进 5s TTL 时钟
    const fetcher = vi.fn().mockResolvedValue('x');
    const { result } = renderHook(() => useStaleWhileRevalidate(fetcher, [], { ttl: 5000 }));
    await act(async () => {}); // 数据落定
    expect(result.current.isStale).toBe(false);
    act(() => vi.advanceTimersByTime(5001));
    expect(result.current.isStale).toBe(true); // 只标记；刷新时机在登记表
    expect(fetcher).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});

describe('useAuthoritativeRead', () => {
  it('决策点直读：等待态显式、完成后提供数据', async () => {
    const fetcher = vi.fn().mockResolvedValue({ balance: 100 });
    const { result } = renderHook(() => useAuthoritativeRead(fetcher, true));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ balance: 100 });
  });

  it('enabled=false 时不读', async () => {
    const fetcher = vi.fn();
    const { result } = renderHook(() => useAuthoritativeRead(fetcher, false));
    expect(result.current.loading).toBe(false);
    expect(fetcher).not.toHaveBeenCalled();
  });
});

describe('useOfflineSnapshot', () => {
  function mockStorage() {
    const map = new Map<string, string>();
    return {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => void map.set(k, v),
      removeItem: (k: string) => void map.delete(k),
    };
  }

  it('无快照 → 挂载即后台刷新并落盘（asOf 标记）', async () => {
    const storage = mockStorage();
    const fetcher = vi.fn().mockResolvedValue({ items: 3 });
    const { result } = renderHook(() => useOfflineSnapshot('list', fetcher, { storage }));
    expect(result.current.data).toBeNull(); // 无快照 = 无数据，不冒充
    await waitFor(() => expect(result.current.data).toEqual({ items: 3 }));
    expect(result.current.asOf).not.toBeNull();
    expect(result.current.isStale).toBe(true); // 有快照即陈旧，直到刷新成功置 false
    expect(storage.getItem('ui-snapshot:list')).not.toBeNull();
  });

  it('刷新失败保留快照 + 错误（离线语义：不白屏不假扮实时）', async () => {
    const storage = mockStorage();
    storage.setItem('ui-snapshot:list', JSON.stringify({ data: { items: 3 }, asOf: Date.now() }));
    const fetcher = vi.fn().mockRejectedValue(new Error('网络不可用'));
    const { result } = renderHook(() => useOfflineSnapshot('list', fetcher, { storage }));
    await waitFor(() => expect(result.current.error).toBe('网络不可用'));
    expect(result.current.data).toEqual({ items: 3 }); // 快照仍在
    expect(result.current.refreshing).toBe(false);
  });

  it('maxAge 到期标记 expired（仍呈现）', async () => {
    vi.useFakeTimers();
    const storage = mockStorage();
    storage.setItem('ui-snapshot:list', JSON.stringify({ data: { items: 3 }, asOf: Date.now() - 10000 }));
    const fetcher = vi.fn().mockResolvedValue({ items: 4 });
    const { result } = renderHook(() =>
      useOfflineSnapshot('list', fetcher, { storage, maxAge: 5000 }),
    );
    expect(result.current.expired).toBe(true);
    expect(result.current.data).toEqual({ items: 3 }); // 过期仍呈现
    vi.useRealTimers();
  });
});
