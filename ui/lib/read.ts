import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 读策略统一实现（→《全局一致性读策略》读策略五型）：
 * - useStaleWhileRevalidate：SWR（先陈旧后刷新，isStale 标记由数据层给出）；
 * - useAuthoritativeRead：同步直读（决策点），仅暴露 loading 态。
 * 组件不自判新鲜度（→ 缓存方案「前端不自行判过期」同一条）；TTL/离线快照按登记表组合本钩子。
 */

export interface SwrState<T> {
  data: T | null;
  /** true = 当前呈现的是陈旧值（登记表承诺的标记由此驱动） */
  isStale: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface SwrOptions<T> {
  /** 命中前的占位（首帧即陈旧呈现） */
  initialData?: T | null;
  /** 陈旧标记阈值：挂载/刷新完成后超过 ttl 毫秒未刷新 → isStale 置 true（0 = 挂载即视为陈旧待刷） */
  ttl?: number;
  /** deps 变化时是否保留上一数据作为陈旧值呈现（默认 true） */
  keepPrevious?: boolean;
}

export function useStaleWhileRevalidate<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
  options?: SwrOptions<T>,
): SwrState<T> {
  const { initialData = null, ttl, keepPrevious = true } = options ?? {};
  const [data, setData] = useState<T | null>(initialData);
  const [isStale, setStale] = useState(Boolean(initialData));
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const mountedRef = useRef(true);
  const runIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const runId = ++runIdRef.current;
    setRefreshing(true);
    setError(null);
    try {
      const next = await fetcherRef.current();
      if (!mountedRef.current || runId !== runIdRef.current) return; // 迟到响应丢弃（→ 竞态裁决）
      setData(next);
      setStale(false);
    } catch (err) {
      if (!mountedRef.current || runId !== runIdRef.current) return;
      setError(err instanceof Error ? err.message : String(err));
      // 刷新失败保留陈旧值（→ 读策略：陈旧值 + 错误呈现，不白屏）
    } finally {
      if (mountedRef.current && runId === runIdRef.current) setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    // deps 变化：新读请求——无 keepPrevious 且无 initialData 时清空（不冒充实时）
    if (!keepPrevious && initialData === null) setData(null);
    setStale(Boolean(data !== null) || Boolean(initialData)); // 挂载即按承诺进入陈旧待刷
    void refresh();
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // TTL 到期 → 标记陈旧（不自动刷：刷新时机在登记表，不由标记自己触发）
  useEffect(() => {
    if (ttl === undefined || data === null) return;
    const t = window.setTimeout(() => setStale(true), ttl);
    return () => window.clearTimeout(t);
  }, [ttl, data]);

  return { data, isStale, refreshing, error, refresh };
}

/** 同步直读（决策点）：只暴露 loading 与错误，数据由调用方在 resolve 后消费。 */
export function useAuthoritativeRead<T>(
  fetcher: () => Promise<T>,
  enabled: boolean,
): { loading: boolean; error: string | null; data: T | null } {
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (!enabled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetcher()
      .then((d) => {
        if (mountedRef.current) setData(d);
      })
      .catch((err) => {
        if (mountedRef.current) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { loading, error, data };
}

/* ---- 离线快照（读策略五型之五）：最后成功数据持久化 + asOf 标记 ---- */

export interface OfflineSnapshotState<T> {
  data: T | null;
  /** 快照时间戳（「截至 X 时刻」标记的数据源） */
  asOf: number | null;
  /** 有快照但未刷新/已过期（区别于「无数据」） */
  isStale: boolean;
  /** 快照超过 maxAge（仍呈现，调用方决定是否禁用操作 → 网络方案离线三档） */
  expired: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export interface OfflineSnapshotOptions<T> {
  /** 存储注入（默认 localStorage；敏感数据不入 localStorage → 安全方案；大数据走后端存储 → 状态方案） */
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  /** 快照超过该毫秒数视为过期（过期仍呈现，标记升级） */
  maxAge?: number;
  initialData?: T | null;
}

interface StoredSnapshot<T> {
  data: T;
  asOf: number;
}

function readSnapshot<T>(storage: Pick<Storage, 'getItem'>, key: string): StoredSnapshot<T> | null {
  try {
    const raw = storage.getItem(`ui-snapshot:${key}`);
    return raw ? (JSON.parse(raw) as StoredSnapshot<T>) : null;
  } catch {
    return null;
  }
}

function writeSnapshot<T>(storage: Pick<Storage, 'setItem'>, key: string, snapshot: StoredSnapshot<T>): void {
  try {
    storage.setItem(`ui-snapshot:${key}`, JSON.stringify(snapshot));
  } catch {
    // 磁盘满 / 隐私模式：快照写失败不影响内存呈现
  }
}

/**
 * 离线快照读策略（→《全局一致性读策略》五型之五、《网络与离线弹性技术方案》离线「只读」档）：
 * - 挂载即读最后成功快照（asOf 标记「截至时刻」），后台刷新；
 * - 刷新成功 → 更新快照落盘；失败 → 保留快照 + 错误呈现（绝不白屏、绝不假扮实时）；
 * - 快照超过 maxAge → expired 标记（仍呈现，调用方决定是否禁用操作）。
 */
export function useOfflineSnapshot<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: OfflineSnapshotOptions<T>,
): OfflineSnapshotState<T> {
  const storage = options?.storage ?? (typeof localStorage !== 'undefined' ? localStorage : undefined);
  const maxAge = options?.maxAge;
  const [snapshot, setSnapshot] = useState<StoredSnapshot<T> | null>(() =>
    storage ? readSnapshot<T>(storage, key) : null,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const mountedRef = useRef(true);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const data = await fetcherRef.current();
      const next: StoredSnapshot<T> = { data, asOf: Date.now() };
      if (mountedRef.current) {
        setSnapshot(next);
        if (storage) writeSnapshot(storage, key, next);
      }
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : String(err));
      // 失败保留快照（离线语义：陈旧但可用，绝不白屏）
    } finally {
      if (mountedRef.current) setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, storage]);

  useEffect(() => {
    mountedRef.current = true;
    void refresh();
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const asOf = snapshot?.asOf ?? null;
  const expired = asOf !== null && maxAge !== undefined && Date.now() - asOf > maxAge;

  return {
    data: snapshot?.data ?? options?.initialData ?? null,
    asOf,
    isStale: snapshot !== null, // 有快照即「陈旧但可用」；无快照 = 无数据（区别于陈旧）
    expired,
    refreshing,
    error,
    refresh,
  };
}
