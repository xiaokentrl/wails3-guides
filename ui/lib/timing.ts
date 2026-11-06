import { useEffect, useRef, useState } from 'react';

/**
 * 延迟家族统一实现（→《防抖与节流方案》判定表）。
 * 全部钩子：卸载可清理、假时钟可测（vi.useFakeTimers 同时接管 setTimeout 与 Date.now）、不散落 setTimeout。
 */

/** 防抖值：value 停止变化 delay 毫秒后才更新。数据会丢时必须给 maxWait（最迟强制更新）。 */
export function useDebouncedValue<T>(value: T, delay: number, options?: { maxWait?: number }): T {
  const [committed, setCommitted] = useState<T>(value);
  const valueRef = useRef(value);
  valueRef.current = value;
  const firstAtRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    if (Object.is(value, committed)) {
      firstAtRef.current = null;
      clearTimers();
      return;
    }
    if (firstAtRef.current === null) firstAtRef.current = Date.now();
    clearTimers();
    const commit = () => {
      setCommitted(valueRef.current);
      firstAtRef.current = null;
    };
    timersRef.current.push(window.setTimeout(commit, delay));
    const maxWait = options?.maxWait;
    if (maxWait !== undefined && firstAtRef.current !== null) {
      const remaining = Math.max(0, maxWait - (Date.now() - firstAtRef.current));
      timersRef.current.push(window.setTimeout(commit, remaining));
    }
    return clearTimers;
    // committed 故意不在依赖中：提交触发的重渲染不应重置防抖窗口
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay, options?.maxWait]);

  useEffect(() => clearTimers, []); // 卸载清理（可取消不变式）

  return committed;
}

/** 防抖回调：连续调用只执行末次。返回 cancel（卸载自动清理）与 flush（立即冲刷，如失焦/退出前）。 */
export function useDebouncedCallback<A extends unknown[]>(
  fn: (...args: A) => void,
  delay: number,
): { run: (...args: A) => void; cancel: () => void; flush: (...args: A) => void } {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const timerRef = useRef<number>(0);
  const lastArgsRef = useRef<A | null>(null);

  const clear = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = 0;
  };

  useEffect(() => clear, []);

  return {
    run: (...args: A) => {
      lastArgsRef.current = args;
      clear();
      timerRef.current = window.setTimeout(() => {
        timerRef.current = 0;
        if (lastArgsRef.current) fnRef.current(...lastArgsRef.current);
      }, delay);
    },
    cancel: clear,
    flush: (...args: A) => {
      clear();
      fnRef.current(...args);
    },
  };
}

/** 节流回调：间隔内最多一次；被抑制的末次调用在间隔结束时补执行（尾沿不丢）。 */
export function useThrottledCallback<A extends unknown[]>(
  fn: (...args: A) => void,
  interval: number,
): { run: (...args: A) => void; cancel: () => void } {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const lastRunRef = useRef(0);
  const timerRef = useRef<number>(0);
  const lastArgsRef = useRef<A | null>(null);

  const clear = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = 0;
  };

  useEffect(() => clear, []);

  return {
    run: (...args: A) => {
      lastArgsRef.current = args;
      const remaining = interval - (Date.now() - lastRunRef.current);
      if (remaining <= 0) {
        lastRunRef.current = Date.now();
        fnRef.current(...args);
        clear();
      } else if (!timerRef.current) {
        timerRef.current = window.setTimeout(() => {
          lastRunRef.current = Date.now();
          timerRef.current = 0;
          if (lastArgsRef.current) fnRef.current(...lastArgsRef.current);
        }, remaining);
      }
    },
    cancel: clear,
  };
}

/** 倒计时（验证码重发等）：剩余秒数随 active 启停；假时钟可测（→《验证码方案》重发冷却）。 */
export function useCountdown(seconds: number, active = true): number {
  const [remain, setRemain] = useState(active ? seconds : 0);
  const endAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setRemain(0);
      return;
    }
    endAtRef.current = Date.now() + seconds * 1000;
    setRemain(seconds);
    const t = window.setInterval(() => {
      const r = Math.max(0, Math.ceil(((endAtRef.current ?? 0) - Date.now()) / 1000));
      setRemain(r);
      if (r === 0) window.clearInterval(t);
    }, 250);
    return () => window.clearInterval(t);
  }, [active, seconds]);

  return remain;
}

/** 倒计时（绝对截止版）：剩余秒数从同一 endAt 推导——多窗口/重启后一致（→《验证码方案》重发冷却）。 */
export function useCountdownUntil(target: number | Date, active = true): number {
  const endAt = typeof target === 'number' ? target : target.getTime();
  const [remain, setRemain] = useState(() => (active ? remainOf(endAt) : 0));

  useEffect(() => {
    if (!active) {
      setRemain(0);
      return;
    }
    setRemain(remainOf(endAt));
    const t = window.setInterval(() => {
      const r = remainOf(endAt);
      setRemain(r);
      if (r === 0) window.clearInterval(t);
    }, 250);
    return () => window.clearInterval(t);
  }, [endAt, active]);

  return remain;
}

function remainOf(endAt: number): number {
  return Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
}

/** 单飞：同 key 的并发调用合并为一次执行，全部等待同一 Promise（判定表机制 3；与缓存方案单飞、任务队列去重同形状）。 */
export function useSingleFlight<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  keyOf: (...args: A) => string,
): { run: (...args: A) => Promise<R> } {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const inflightRef = useRef(new Map<string, Promise<R>>());

  const run = (...args: A): Promise<R> => {
    const key = keyOf(...args);
    const existing = inflightRef.current.get(key);
    if (existing) return existing;
    const p = fnRef.current(...args).finally(() => inflightRef.current.delete(key));
    inflightRef.current.set(key, p);
    return p;
  };
  return { run };
}
