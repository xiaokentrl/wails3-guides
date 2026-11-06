/**
 * 日历纯函数测试——期望值全部手算核对（写测试前逐个推过一遍，不是运行后抄的）。
 * 基准锚点：2026-01-01 是周四；2026-11-06 是周五；2026-11-08 是周日；2026 为 53 周年。
 */
import { describe, expect, it } from 'vitest';
import { daysInMonth, isoWeek, isoWeeksInYear, sameWeek, weekStartOf } from '../lib/calendar';

describe('isoWeek（ISO 8601 周号）', () => {
  it('2026-01-01（周四）→ 2026 年第 1 周', () => {
    expect(isoWeek(new Date(2026, 0, 1))).toEqual({ year: 2026, week: 1 });
  });

  it('2026-11-06（周五）→ 第 45 周（周四=11-05，距 1-01 恰 44 周）', () => {
    expect(isoWeek(new Date(2026, 10, 6))).toEqual({ year: 2026, week: 45 });
  });

  it('跨年边界：2027-01-01（周五）归 2026 年第 53 周', () => {
    expect(isoWeek(new Date(2027, 0, 1))).toEqual({ year: 2026, week: 53 });
  });

  it('同周的周日与周一同号：2026-11-09（周一）与 11-15（周日）都是 46 周', () => {
    expect(isoWeek(new Date(2026, 10, 9)).week).toBe(46);
    expect(isoWeek(new Date(2026, 10, 15)).week).toBe(46);
  });
});

describe('isoWeeksInYear', () => {
  it('2026（Jan1=周四）53 周', () => {
    expect(isoWeeksInYear(2026)).toBe(53);
  });
  it('2027（Jan1=周五）52 周', () => {
    expect(isoWeeksInYear(2027)).toBe(52);
  });
});

describe('weekStartOf / sameWeek（周日起始口径）', () => {
  it('周五 11-06 的周起点是周日 11-01', () => {
    const s = weekStartOf(new Date(2026, 10, 6));
    expect([s.getFullYear(), s.getMonth(), s.getDate()]).toEqual([2026, 10, 1]);
  });

  it('周日当天的周起点是自身', () => {
    const s = weekStartOf(new Date(2026, 10, 8));
    expect(s.getDate()).toBe(8);
  });

  it('sameWeek：同周异日为真，跨周为假', () => {
    expect(sameWeek(new Date(2026, 10, 3), new Date(2026, 10, 7))).toBe(true); // 周二 vs 周六
    expect(sameWeek(new Date(2026, 10, 7), new Date(2026, 10, 8))).toBe(false); // 周六 vs 周日
    expect(sameWeek(null, new Date(2026, 10, 8))).toBe(false);
  });
});

describe('daysInMonth（闰年）', () => {
  it('2024-02 闰年 29 天', () => {
    expect(daysInMonth(2024, 1)).toBe(29);
  });
  it('2026-02 平年 28 天；12 月 31 天；跨年 2027-01 → new Date(y, 12, 0) = 12 月', () => {
    expect(daysInMonth(2026, 1)).toBe(28);
    expect(daysInMonth(2026, 11)).toBe(31);
    expect(daysInMonth(2026, 12)).toBe(31); // month=12 → 次年 1 月 0 日 = 12 月 31 日
  });
});
