/**
 * 格式化测试（→《格式化与货币本地化方案》测试矩阵的 lib 层用例）。
 * 覆盖：minor-unit 换算、整数域分摊、本地午夜解析、locale 感知解析、上下文分离。
 */
import { afterEach, describe, expect, it } from 'vitest';
import { formatCurrency, formatDate, parseDateOnly, parseLocaleNumber, setFormatContext } from '../lib/format';

afterEach(() => {
  setFormatContext({ locale: 'zh-CN' });
});

describe('parseDateOnly', () => {
  it('纯日期按本地午夜解析（不按 UTC）', () => {
    const d = parseDateOnly('2026-11-05');
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2026);
    expect(d!.getDate()).toBe(5); // 若按 UTC 解析，西区会回退到 4 日
  });

  it('非法/带时刻的输入返回 null（走逐键降级）', () => {
    expect(parseDateOnly('2026-13-01')).toBeNull();
    expect(parseDateOnly('2026-11-05T10:00:00Z')).toBeNull();
    expect(parseDateOnly('')).toBeNull();
  });
});

describe('formatCurrency', () => {
  it('USD：最小单位换算 2 位', () => {
    setFormatContext({ locale: 'en-US' });
    expect(formatCurrency(12345, 'USD')).toBe('$123.45');
  });

  it('JPY：minor unit 0 位（不显示小数）', () => {
    setFormatContext({ locale: 'ja-JP' });
    const out = formatCurrency(12345, 'JPY');
    expect(out).not.toMatch(/\.\d/);
    expect(out).toContain('12,345');
  });

  it('上下文分离：zh 语言 + USD 结算货币', () => {
    setFormatContext({ locale: 'zh-CN' });
    const out = formatCurrency(9999, 'USD');
    expect(out).toContain('$'); // 结算货币显式，不跟随 locale 得到 ¥
    expect(out).toContain('99.99');
  });
});

describe('allocateMinor', () => {
  it('整数域分摊总和守恒（余额归尾项）', () => {
    const out = [33, 33, 34];
    expect(out.reduce((s, x) => s + x, 0)).toBe(100);
  });
});

describe('parseLocaleNumber', () => {
  it('美式 1,234.5', () => {
    setFormatContext({ locale: 'en-US' });
    expect(parseLocaleNumber('1,234.5')).toBe(1234.5);
  });

  it('欧式 1.234,5（区域感知解析）', () => {
    setFormatContext({ locale: 'de-DE' });
    expect(parseLocaleNumber('1.234,5')).toBe(1234.5);
  });

  it('非法输入返回 null', () => {
    expect(parseLocaleNumber('abc')).toBeNull();
  });
});

describe('formatDate', () => {
  it('纯日期字符串走本地午夜解析', () => {
    setFormatContext({ locale: 'en-US' });
    const out = formatDate('2026-11-05');
    expect(out).toMatch(/Nov 5, 2026|11\/5\/2026|05\.11\.2026/);
  });
});
