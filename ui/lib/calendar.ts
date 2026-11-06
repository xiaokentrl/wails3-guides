/**
 * 日历纯函数层（→ DatePicker week/month/year 变体的逻辑底座）。
 * 全部无副作用、无 Intl 依赖——期望值可手算核对（日历期望值是历史高频错点）。
 * ISO 周规则：周一起始、含当年第一个周四的周为第 1 周。
 */

/** 周起始（周日为一周之首——与 DatePicker 月网格的 getDay() 前导空白一致） */
export function weekStartOf(d: Date): Date {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  t.setDate(t.getDate() - t.getDay());
  return t;
}

/** 同一周（周日起始口径）：周起点时间戳相同 */
export function sameWeek(a: Date | null, b: Date): boolean {
  return !!a && weekStartOf(a).getTime() === weekStartOf(b).getTime();
}

/** ISO 8601 周号（周一起始；含当年首个周四的周为第 1 周——跨年周归属上年） */
export function isoWeek(d: Date): { year: number; week: number } {
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (t.getDay() + 6) % 7; // Mon=0…Sun=6
  t.setDate(t.getDate() - dow + 3); // 本 ISO 周的周四
  const isoYear = t.getFullYear();
  const jan4 = new Date(isoYear, 0, 4);
  const jan4Dow = (jan4.getDay() + 6) % 7;
  const week1Thu = new Date(isoYear, 0, 4 - jan4Dow + 3);
  const week = Math.round((t.getTime() - week1Thu.getTime()) / (7 * 86400_000)) + 1;
  return { year: isoYear, week };
}

/** 某年 ISO 周总数（53 周年：Jan 1 为周四，或闰年且 Jan 1 为周三） */
export function isoWeeksInYear(year: number): number {
  return isoWeek(new Date(year, 11, 28)).week; // 12-28 恒在最后一周
}

/** 月份天数（含闰年） */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
