import { cn } from '../lib/cn';
import './DateTimePicker.css';

export interface DateTimePickerProps {
  /** 日期 ISO 字符串（YYYY-MM-DD） */
  date: string;
  onDateChange: (d: string) => void;
  /** 时间 HH:mm */
  time: string;
  onTimeChange: (t: string) => void;
  datePlaceholder?: string;
  timePlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

/** 日期 + 时间组合选择器：两个原生控件并排，由调用方合成最终 ISO 值。 */
export function DateTimePicker({ date, onDateChange, time, onTimeChange, datePlaceholder, timePlaceholder, disabled, className }: DateTimePickerProps) {
  return (
    <div className={cn('ui-datetime', disabled && 'ui-datetime--disabled', className)}>
      <input
        type="date"
        className="ui-datetime__date"
        value={date}
        disabled={disabled}
        onChange={(e) => onDateChange(e.target.value)}
        aria-label="日期"
      />
      <span className="ui-datetime__sep" aria-hidden="true">–</span>
      <input
        type="time"
        className="ui-datetime__time"
        value={time}
        disabled={disabled}
        onChange={(e) => onTimeChange(e.target.value)}
        aria-label="时间"
      />
    </div>
  );
}
