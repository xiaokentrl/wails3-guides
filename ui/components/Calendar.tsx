import { useState } from 'react';
import { cn } from '../lib/cn';
import './Calendar.css';

export interface CalendarProps {
  /** 选中日期 */
  value?: Date | null;
  onChange?: (d: Date) => void;
  /** 受控视图（不传则内部从今天开始） */
  initialView?: Date;
  className?: string;
}

const WEEKDAYS = Array.from({ length: 7 }, (_, i) =>
  new Intl.DateTimeFormat(undefined, { weekday: 'narrow' }).format(new Date(2026, 10, 1 + i)),
);

/** 月历视图（独立于下拉面板的 DatePicker——用于页面内日程展示与选择）。 */
export function Calendar({ value, onChange, initialView, className }: CalendarProps) {
  const today = new Date();
  const [view, setView] = useState(() => ({ y: (initialView ?? today).getFullYear(), m: (initialView ?? today).getMonth() }));

  const monthTitle = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long' }).format(new Date(view.y, view.m, 1));
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const startWeekday = new Date(view.y, view.m, 1).getDay();

  const sameDay = (a: Date | null, b: Date) =>
    !!a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  return (
    <div className={cn('ui-calendar', className)}>
      <div className="ui-calendar__header">
        <button type="button" className="ui-calendar__nav" aria-label="上个月" onClick={() => setView(view.m === 0 ? { y: view.y - 1, m: 11 } : { y: view.y, m: view.m - 1 })}>
          ‹
        </button>
        <span className="ui-calendar__month">{monthTitle}</span>
        <button type="button" className="ui-calendar__nav" aria-label="下个月" onClick={() => setView(view.m === 11 ? { y: view.y + 1, m: 0 } : { y: view.y, m: view.m + 1 })}>
          ›
        </button>
      </div>
      <div className="ui-calendar__grid" role="grid">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="ui-calendar__weekday" role="columnheader">
            {w}
          </span>
        ))}
        {Array.from({ length: startWeekday }, (_, i) => (
          <span key={`b${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = new Date(view.y, view.m, i + 1);
          const selected = sameDay(value ?? null, d);
          const isToday = sameDay(today, d);
          return (
            <button
              key={i}
              type="button"
              role="gridcell"
              aria-selected={selected}
              aria-current={isToday ? 'date' : undefined}
              className={cn('ui-calendar__day', selected && 'ui-calendar__day--selected', isToday && !selected && 'ui-calendar__day--today')}
              onClick={() => onChange?.(d)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
