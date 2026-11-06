/**
 * 格式化单点（→《格式化与货币本地化方案》《国际化与输入技术方案》）。
 * 全库唯一合法格式化产地：组件内手写格式化视为违规（→ 公共函数方案能力包归属）。
 * 上下文四分离：locale / region / currency / timeZone 各自显式设置（由设置驱动 → 多语言实现方案）。
 * 全部纯函数 + 显式上下文：假时钟可测（Date.now 仅在相对时间使用）。
 */

export interface FormatContext {
  locale: string;
  region?: string;
  currency?: string;
  timeZone?: string;
}

let ctx: FormatContext = { locale: 'zh-CN' };

/** 格式化上下文设置（应用启动与设置变更时调用，→ 状态方案设置单源）。 */
export function setFormatContext(next: FormatContext): void {
  ctx = next;
}

export function getFormatContext(): FormatContext {
  return { ...ctx };
}

/**
 * locale + region 组合标签：region 显式时以「基础语言-区域」构造（zh + CN → zh-CN）。
 * 局限：显式 region 会丢弃原 locale 的 script/扩展子标签——脚本敏感场景（如 zh-Hant）
 * 应直接把完整标签放进 locale。区域覆盖的 -u-rg- 语法引擎支持差异**待验证**。
 */
function localeTag(): string {
  if (!ctx.region) return ctx.locale;
  const base = ctx.locale.split('-')[0];
  return `${base}-${ctx.region.toUpperCase()}`;
}

/* ---- 日期与时间 ---- */

/** 纯日期（YYYY-MM-DD）→ 本地午夜 Date（不按 UTC 解析，杜绝差一天）。解析失败返回 null。 */
export function parseDateOnly(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const da = Number(m[3]);
  const d = new Date(y, mo, da);
  // 分量回读校验：2026-13-01 之类会静默进位（new Date 不抛错），必须拦下
  if (Number.isNaN(d.getTime()) || d.getFullYear() !== y || d.getMonth() !== mo || d.getDate() !== da) return null;
  return d;
}

export type DateStyle = 'date' | 'datetime' | 'time';

export function formatDate(d: Date | number | string, style: DateStyle = 'date'): string {
  const date = typeof d === 'string' ? (parseDateOnly(d) ?? new Date(d)) : new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  const opts: Intl.DateTimeFormatOptions =
    style === 'datetime'
      ? { dateStyle: 'medium', timeStyle: 'short' }
      : style === 'time'
        ? { timeStyle: 'short' }
        : { dateStyle: 'medium' };
  return new Intl.DateTimeFormat(localeTag(), { ...opts, timeZone: ctx.timeZone }).format(date);
}

/** 相对时间（→ 国际化方案：阈值切换登记）。 */
export function formatRelative(d: Date | number, base: Date | number = Date.now()): string {
  const target = new Date(d).getTime();
  const diffSec = Math.round((target - new Date(base).getTime()) / 1000);
  const abs = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat(ctx.locale, { numeric: 'auto' });
  if (abs < 60) return rtf.format(diffSec, 'second');
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), 'hour');
  return rtf.format(Math.round(diffSec / 86400), 'day');
}

/* ---- 数字 ---- */

export interface NumberFormatOptions {
  /** 小数位（未传跟随 Intl 默认） */
  decimals?: number;
  percent?: boolean;
  /** 紧凑缩写（1.2万 / 1.2K） */
  compact?: boolean;
  signDisplay?: 'auto' | 'always' | 'never';
}

export function formatNumber(n: number, opts: NumberFormatOptions = {}): string {
  const { decimals, percent, compact, signDisplay } = opts;
  return new Intl.NumberFormat(localeTag(), {
    ...(decimals !== undefined ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals } : {}),
    ...(percent ? { style: 'percent' } : {}),
    ...(compact ? { notation: 'compact' } : {}),
    ...(signDisplay ? { signDisplay } : {}),
  }).format(n);
}

/* ---- 货币 ---- */

/**
 * 货币格式化：amount 为**最小单位整数**（分等，→ 硬性目标：浮点永不参与金额）。
 * 小数位取自 Intl resolvedOptions（JPY 0 / USD 2 / KWD 3）——禁止手写除以 100。
 * currency 必须显式传入（不跟随 locale → 上下文分离）。
 */
export function formatCurrency(amountMinor: number, currency: string, opts: { locale?: string; compact?: boolean } = {}): string {
  const fmt = new Intl.NumberFormat(opts.locale ?? localeTag(), {
    style: 'currency',
    currency,
    ...(opts.compact ? { notation: 'compact' } : {}),
  });
  const digits = fmt.resolvedOptions().maximumFractionDigits ?? 2;
  const major = amountMinor / 10 ** digits;
  return fmt.format(major);
}

/** 金额整数域加法（最小单位）。 */
export function addMinor(a: number, b: number): number {
  return a + b;
}

/** 金额整数域按比例分摊（分摊余额归尾项，保证总和不变——整数域分摊的经典解）。 */
export function allocateMinor(amountMinor: number, weights: number[]): number[] {
  const total = weights.reduce((s, w) => s + w, 0);
  if (total <= 0) return weights.map(() => 0);
  const out: number[] = [];
  let acc = 0;
  for (let i = 0; i < weights.length - 1; i++) {
    const v = Math.floor((amountMinor * weights[i]) / total);
    out.push(v);
    acc += v;
  }
  out.push(amountMinor - acc);
  return out;
}

/* ---- 解析（用户输入 → 规范值；→ 输入验证方案） ---- */

/** 按当前 locale 解析用户输入的数字（欧式 1.234,5 与美式 1,234.5 都能解），失败返回 null。 */
export function parseLocaleNumber(s: string): number | null {
  const trimmed = s.trim();
  if (!trimmed) return null;
  // 用当前 locale 造样本，判定小数与分组符
  const sample = new Intl.NumberFormat(localeTag()).format(1234.5);
  const groupSym = sample.includes(',') && sample.includes('.') ? (sample.indexOf(',') < sample.indexOf('.') ? ',' : '.') : sample.includes(',') ? ',' : '.';
  const decimalSym = sample.includes(',') && sample.includes('.') ? (sample.indexOf(',') < sample.indexOf('.') ? '.' : ',') : sample.includes(',') ? '' : '.';
  let normalized = trimmed;
  if (groupSym) normalized = normalized.split(groupSym).join('');
  if (decimalSym) normalized = normalized.replace(decimalSym, '.');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}
