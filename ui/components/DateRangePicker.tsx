import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './Listbox.css';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (r: DateRange) => void;
  placeholder?: string;
  className?: string;
}

const fmt = (d: Date) => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(d);
const sameDay = (a: Date | null, b: Date) =>
  !!a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/**
 * 范围选择（单面板版）：第一次点击设起点，第二次点击设终点（反向自动交换）。
 * 双面板对照视图与悬停预览为下一批；时区规范化由调用方处理（→ 状态方案）。
 */
export function DateRangePicker({ value, onChange, placeholder = '选择日期范围', className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => ({ y: (value.start ?? new Date()).getFullYear(), m: (value.start ?? new Date()).getMonth() }));
  /** 右面板 = 左面板 + 1 月 */
  const next = view.m === 11 ? { y: view.y + 1, m: 0 } : { y: view.y, m: view.m + 1 };
  const [picking, setPicking] = useState<'start' | 'end'>('start');
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(undefined, { weekday: 'narrow' }).format(new Date(2026, 10, 1 + i)),
  );



  const inRange = (d: Date) => {
    // 悬停预览：选完起点后，鼠标悬停位作为临时终点参与区间判定
    const end = value.end ?? (picking === 'end' && value.start ? hoverDate : null);
    if (!value.start || !end) return false;
    const t = d.getTime();
    const lo = Math.min(value.start.getTime(), end.getTime());
    const hi = Math.max(value.start.getTime(), end.getTime());
    return t >= lo && t <= hi;
  };

  const pick = (d: Date) => {
    if (picking === 'start' || !value.start || d.getTime() < value.start.getTime()) {
      onChange({ start: d, end: null });
      setPicking('end');
    } else {
      onChange({ start: value.start, end: d });
      setPicking('start');
      setOpen(false);
    }
  };

  const display =
    value.start && value.end
      ? `${fmt(value.start)} ~ ${fmt(value.end)}`
      : value.start
        ? `${fmt(value.start)} ~ …`
        : null;

  return (
    <div ref={rootRef} className={cn('ui-listbox', className)}>
      <button
        type="button"
        className={cn('ui-listbox__trigger', !display && 'ui-listbox__trigger--placeholder')}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {display ?? <span className="ui-listbox__placeholder">{placeholder}</span>}
        <span className="ui-listbox__arrow" aria-hidden="true">
          📅
        </span>
      </button>
      {open && (
        <div role="dialog" aria-label="选择日期范围" className="ui-datepicker ui-datepicker--dual">
          {[view, next].map((vm, pi) => {
            const daysInMonth = new Date(vm.y, vm.m + 1, 0).getDate();
            const startWeekday = new Date(vm.y, vm.m, 1).getDay();
            const monthTitle = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long' }).format(new Date(vm.y, vm.m, 1));
            return (
              <section key={pi} className="ui-datepicker__pane">
                {pi === 0 ? (
                  <div className="ui-datepicker__header">
                    <button type="button" className="ui-datepicker__nav" aria-label="上个月" onClick={() => setView(view.m === 0 ? { y: view.y - 1, m: 11 } : { y: view.y, m: view.m - 1 })}>
                      ‹
                    </button>
                    <span className="ui-datepicker__month">{monthTitle}</span>
                    <span className="ui-datepicker__nav" aria-hidden="true" />
                  </div>
                ) : (
                  <div className="ui-datepicker__header">
                    <span className="ui-datepicker__nav" aria-hidden="true" />
                    <span className="ui-datepicker__month">{monthTitle}</span>
                    <button type="button" className="ui-datepicker__nav" aria-label="下个月" onClick={() => setView(next)}>
                      ›
                    </button>
                  </div>
                )}
                <div className="ui-datepicker__grid" role="grid">
                  {weekdays.map((w, i) => (
                    <span key={i} className="ui-datepicker__weekday">
                      {w}
                    </span>
                  ))}
                  {Array.from({ length: startWeekday }, (_, i) => (
                    <span key={`b${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const d = new Date(vm.y, vm.m, i + 1);
                    const isStart = sameDay(value.start, d);
                    const isEnd = sameDay(value.end, d);
                    return (
                      <button
                        key={i}
                        type="button"
                        role="gridcell"
                        aria-selected={isStart || isEnd}
                        className={cn('ui-datepicker__day', (isStart || isEnd) && 'ui-datepicker__day--selected', !isStart && !isEnd && inRange(d) && 'ui-datepicker__day--inrange')}
                        onMouseEnter={() => picking === 'end' && setHoverDate(d)}
                        onMouseLeave={() => setHoverDate(null)}
                        onClick={() => pick(d)}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
          <div className="ui-datepicker__hint-row">{picking === 'start' ? '选择开始日期' : '选择结束日期'}</div>
        </div>
      )}
    </div>
  );
}
