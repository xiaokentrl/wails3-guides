import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '../lib/cn';
import { isoWeek, sameWeek } from '../lib/calendar';
import './Listbox.css';
import './DatePicker.css';

export interface DatePickerProps {
  /** 选中日期（本地时区，规范值 → 状态方案）；month/year 变体归一化为当期首日 */
  value: Date | null;
  onChange: (d: Date) => void;
  /** 选择粒度：date 月网格 / week 同网格整周高亮 / month 月格 / quarter 季格 / year 年格 */
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
  placeholder?: string;
  className?: string;
}

const WEEKDAYS = 7;

/**
 * 日期选择（→ Naive/antd DatePicker 的 picker 变体）：date / week / month / year 四态共用一个组件。
 * 逻辑底座在 lib/calendar.ts（纯函数 + 测试先行，跨年周归属等期望值已手算核对）。
 * 键盘：日期网格方向键跨周换行、Enter 选中、Escape 关闭；月/年格点 ↑↓±3/±4、←→±1。
 */
export function DatePicker({ value, onChange, picker = 'date', placeholder = '选择日期', className }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const mode = picker;
  const today = new Date();
  const [view, setView] = useState(() => ({ y: (value ?? today).getFullYear(), m: (value ?? today).getMonth() }));
  const [focusDate, setFocusDate] = useState<Date | null>(value);
  const [focusIdx, setFocusIdx] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open && gridRef.current) gridRef.current.focus();
  }, [open]);

  const first = new Date(view.y, view.m, 1);
  const startWeekday = first.getDay();
  const daysInMonthCount = new Date(view.y, view.m + 1, 0).getDate();
  const monthTitle = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long' }).format(first);
  const weekdayLabels = Array.from({ length: WEEKDAYS }, (_, i) =>
    new Intl.DateTimeFormat(undefined, { weekday: 'narrow' }).format(new Date(2026, 10, 1 + i)),
  );
  const decadeBase = view.y - (view.y % 12);

  const sameDay = (a: Date | null, b: Date) => !!a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const sameMonth = (a: Date | null, m: number) => !!a && a.getFullYear() === view.y && a.getMonth() === m;
  const sameYear = (a: Date | null, y: number) => !!a && a.getFullYear() === y;

  const shiftMonth = (d: 1 | -1) => {
    const nm = view.m + d;
    setView(nm < 0 ? { y: view.y - 1, m: 11 } : nm > 11 ? { y: view.y + 1, m: 0 } : { y: view.y, m: nm });
  };

  const commit = (d: Date) => {
    onChange(d);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const moveFocus = (e: KeyboardEvent, days: number) => {
    e.preventDefault();
    const base = focusDate ? new Date(focusDate) : new Date(view.y, view.m, 1);
    base.setDate(base.getDate() + days);
    if (base.getMonth() !== view.m || base.getFullYear() !== view.y) setView({ y: base.getFullYear(), m: base.getMonth() });
    setFocusDate(base);
  };

  const moveGridFocus = (e: KeyboardEvent, count: number, cols: number) => {
    e.preventDefault();
    setFocusIdx((i) => Math.min(count - 1, Math.max(0, i + (e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowDown' ? cols : -cols))));
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }
    if (mode === 'month' || mode === 'quarter') {
      e.preventDefault();
      if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) moveGridFocus(e, 12, 3);
      else if (e.key === 'Enter') commit(new Date(view.y, mode === 'quarter' ? focusIdx * 3 : focusIdx, 1));
      else if (e.key === 'PageDown') setView({ y: view.y + 1, m: view.m });
      else if (e.key === 'PageUp') setView({ y: view.y - 1, m: view.m });
      return;
    }
    if (mode === 'year') {
      e.preventDefault();
      if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) moveGridFocus(e, 12, 4);
      else if (e.key === 'Enter') commit(new Date(decadeBase + focusIdx, 0, 1));
      else if (e.key === 'PageDown') setView({ y: view.y + 12, m: view.m });
      else if (e.key === 'PageUp') setView({ y: view.y - 12, m: view.m });
      return;
    }
    // date / week
    if (e.key === 'ArrowRight') moveFocus(e, 1);
    else if (e.key === 'ArrowLeft') moveFocus(e, -1);
    else if (e.key === 'ArrowDown') moveFocus(e, WEEKDAYS);
    else if (e.key === 'ArrowUp') moveFocus(e, -WEEKDAYS);
    else if (e.key === 'PageDown') shiftMonth(1);
    else if (e.key === 'PageUp') shiftMonth(-1);
    else if (e.key === 'Enter' && focusDate) {
      e.preventDefault();
      commit(focusDate);
    }
  };

  const display = (() => {
    if (!value) return placeholder;
    if (mode === 'month') return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short' }).format(value);
    if (mode === 'quarter') return `${value.getFullYear()} Q${Math.floor(value.getMonth() / 3) + 1}`;
    if (mode === 'year') return String(value.getFullYear());
    if (mode === 'week') {
      const { week } = isoWeek(value);
      return `${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(value)}（第 ${week} 周）`;
    }
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(value);
  })();

  const dialogLabel = { date: '选择日期', week: '选择周', month: '选择月份', quarter: '选择季度', year: '选择年份' }[mode];

  return (
    <div ref={rootRef} className={cn('ui-listbox', className)}>
      <button
        ref={triggerRef}
        type="button"
        className={cn('ui-listbox__trigger', !value && 'ui-listbox__trigger--placeholder')}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {value ? display : placeholder}
        <span className="ui-listbox__arrow" aria-hidden="true">
          📅
        </span>
      </button>
      {open && (
        <div role="dialog" aria-label={dialogLabel} className="ui-datepicker" ref={gridRef} tabIndex={-1} onKeyDown={onKey}>
          <div className="ui-datepicker__header">
            <button
              type="button"
              className="ui-datepicker__nav"
              aria-label={mode === 'year' ? '上一个十二年' : mode === 'month' ? '上一年' : '上个月'}
              onClick={() => (mode === 'year' ? setView({ y: view.y - 12, m: view.m }) : mode === 'month' || mode === 'quarter' ? setView({ y: view.y - 1, m: view.m }) : shiftMonth(-1))}
            >
              ‹
            </button>
            <span className="ui-datepicker__month">
              {mode === 'year' ? `${decadeBase} – ${decadeBase + 11}` : mode === 'month' || mode === 'quarter' ? new Intl.DateTimeFormat(undefined, { year: 'numeric' }).format(first) : monthTitle}
            </span>
            <button
              type="button"
              className="ui-datepicker__nav"
              aria-label={mode === 'year' ? '下一个十二年' : mode === 'month' ? '下一年' : '下个月'}
              onClick={() => (mode === 'year' ? setView({ y: view.y + 12, m: view.m }) : mode === 'month' || mode === 'quarter' ? setView({ y: view.y + 1, m: view.m }) : shiftMonth(1))}
            >
              ›
            </button>
          </div>

          {(mode === 'date' || mode === 'week') && (
            <div className="ui-datepicker__grid" role="grid">
              {weekdayLabels.map((w, i) => (
                <span key={i} className="ui-datepicker__weekday" role="columnheader">
                  {w}
                </span>
              ))}
              {Array.from({ length: startWeekday }, (_, i) => (
                <span key={`b${i}`} />
              ))}
              {Array.from({ length: daysInMonthCount }, (_, i) => {
                const d = new Date(view.y, view.m, i + 1);
                const selected = mode === 'week' ? sameWeek(value, d) : sameDay(value, d);
                const focused = sameDay(focusDate, d);
                const isToday = sameDay(today, d);
                return (
                  <button
                    key={i}
                    type="button"
                    role="gridcell"
                    aria-selected={selected}
                    className={cn(
                      'ui-datepicker__day',
                      selected && 'ui-datepicker__day--selected',
                      focused && !selected && 'ui-datepicker__day--focused',
                      isToday && !selected && 'ui-datepicker__day--today',
                    )}
                    onClick={() => commit(d)}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          )}

          {mode === 'quarter' && (
            <div className="ui-datepicker__grid ui-datepicker__grid--cells4" role="grid">
              {Array.from({ length: 4 }, (_, i) => {
                const qStart = new Date(view.y, i * 3, 1);
                const selected = sameMonth(value, i * 3);
                return (
                  <button
                    key={i}
                    type="button"
                    role="gridcell"
                    aria-selected={selected}
                    className={cn('ui-datepicker__day', selected && 'ui-datepicker__day--selected', focusIdx === i && !selected && 'ui-datepicker__day--focused')}
                    onClick={() => commit(qStart)}
                    onMouseEnter={() => setFocusIdx(i)}
                  >
                    Q{i + 1}
                  </button>
                );
              })}
            </div>
          )}

          {mode === 'month' && (
            <div className="ui-datepicker__grid ui-datepicker__grid--cells3" role="grid">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="gridcell"
                  aria-selected={sameMonth(value, i)}
                  className={cn('ui-datepicker__day', sameMonth(value, i) && 'ui-datepicker__day--selected', focusIdx === i && !sameMonth(value, i) && 'ui-datepicker__day--focused', sameDay(today, new Date(view.y, i, 1)) && !sameMonth(value, i) && 'ui-datepicker__day--today')}
                  onClick={() => commit(new Date(view.y, i, 1))}
                  onMouseEnter={() => setFocusIdx(i)}
                >
                  {new Intl.DateTimeFormat(undefined, { month: 'short' }).format(new Date(view.y, i, 1))}
                </button>
              ))}
            </div>
          )}

          {mode === 'year' && (
            <div className="ui-datepicker__grid ui-datepicker__grid--cells4" role="grid">
              {Array.from({ length: 12 }, (_, i) => {
                const y = decadeBase + i;
                return (
                  <button
                    key={y}
                    type="button"
                    role="gridcell"
                    aria-selected={sameYear(value, y)}
                    className={cn('ui-datepicker__day', sameYear(value, y) && 'ui-datepicker__day--selected', focusIdx === i && !sameYear(value, y) && 'ui-datepicker__day--focused', today.getFullYear() === y && !sameYear(value, y) && 'ui-datepicker__day--today')}
                    onClick={() => commit(new Date(y, 0, 1))}
                    onMouseEnter={() => setFocusIdx(i)}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}

          {mode === 'week' && value && (
            <div className="ui-datepicker__weekinfo">第 {isoWeek(value).week} 周——整行选择</div>
          )}
        </div>
      )}
    </div>
  );
}
