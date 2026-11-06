/**
 * 延迟家族测试（→《防抖与节流方案》测试矩阵；全部假时钟，→ 可测不变式）。
 * 运行前提同 tests/components.test.tsx。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useCountdownUntil, useDebouncedCallback, useDebouncedValue, useSingleFlight, useThrottledCallback } from '../lib/timing';

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe('useDebouncedValue', () => {
  it('窗口内连续变化只提交末次', () => {
    const { result, rerender } = renderHook(({ v }: { v: string }) => useDebouncedValue(v, 300), { initialProps: { v: 'a' } });
    rerender({ v: 'b' });
    rerender({ v: 'c' });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('a'); // 窗口未到
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('c'); // 只提交末次
  });

  it('maxWait 到点强制提交（数据防抖上限）', () => {
    let v = '1';
    const { result, rerender } = renderHook(({ v }: { v: string }) => useDebouncedValue(v, 500, { maxWait: 300 }), { initialProps: { v } });
    for (let i = 2; i <= 6; i++) {
      v = String(i);
      rerender({ v });
      act(() => vi.advanceTimersByTime(100)); // 每次都在 500ms 窗口内重置
    }
    // maxWait 语义：锚定首次变更，t=300 到点强制提交**当时**的末值 '4'
    // （此后 5/6 开启新防抖窗，本测试只推进到 500ms，未到期）
    expect(result.current).toBe('4');
  });

  it('卸载后不再提交（可清理不变式）', () => {
    const { result, rerender, unmount } = renderHook(({ v }: { v: string }) => useDebouncedValue(v, 300), { initialProps: { v: 'a' } });
    rerender({ v: 'b' });
    unmount();
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe('a');
  });
});

describe('useDebouncedCallback', () => {
  it('flush 立即冲刷（失焦/退出前场景）', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(fn, 500));
    result.current.run('x');
    result.current.flush('x');
    expect(fn).toHaveBeenCalledWith('x');
    act(() => vi.advanceTimersByTime(1000));
    expect(fn).toHaveBeenCalledTimes(1); // 冲刷后定时器已清，不重复
  });
});

describe('useThrottledCallback', () => {
  it('间隔内限频、尾沿补执行', () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useThrottledCallback(fn, 200));
    result.current.run(1); // 立即执行
    result.current.run(2); // 抑制
    result.current.run(3); // 抑制，末次记录
    act(() => vi.advanceTimersByTime(200)); // 尾沿补执行(3)
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(3);
  });
});

describe('useSingleFlight', () => {
  it('同 key 并发合并为一次执行，共享同一 Promise', async () => {
    const fn = vi.fn((id: string) => Promise.resolve(id));
    const { result } = renderHook(() => useSingleFlight(fn, (id: string) => id));
    let p1: Promise<unknown> = Promise.resolve();
    let p2: Promise<unknown> = Promise.resolve();
    await act(async () => {
      p1 = result.current.run('a');
      p2 = result.current.run('a');
    });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(p1).toBe(p2);
    await act(async () => {
      await Promise.all([p1, p2]);
    });
  });

  it('落定后恢复可调用；不同 key 不合并', async () => {
    const fn = vi.fn((id: string) => Promise.resolve(id));
    const { result } = renderHook(() => useSingleFlight(fn, (id: string) => id));
    await act(async () => {
      await result.current.run('a');
    });
    await act(async () => {
      await result.current.run('a');
    });
    expect(fn).toHaveBeenCalledTimes(2);
    await act(async () => {
      await Promise.all([result.current.run('a'), result.current.run('b')]);
    });
    expect(fn).toHaveBeenCalledTimes(4);
  });
});

describe('useCountdownUntil', () => {
  it('从同一 endAt 推导剩余秒数并归零（多窗口一致语义）', () => {
    const endAt = Date.now() + 60000;
    const { result } = renderHook(() => useCountdownUntil(endAt));
    expect(result.current).toBe(60);
    act(() => vi.advanceTimersByTime(30500));
    expect(result.current).toBe(30);
    act(() => vi.advanceTimersByTime(31000));
    expect(result.current).toBe(0);
  });

  it('active=false 归零', () => {
    const endAt = Date.now() + 60000;
    const { result } = renderHook(() => useCountdownUntil(endAt, false));
    expect(result.current).toBe(0);
  });
});
