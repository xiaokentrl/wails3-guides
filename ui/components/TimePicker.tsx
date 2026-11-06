import { cn } from '../lib/cn';
import './Form.css';

export interface TimePickerProps {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/** 时间选择：原生 time 输入 + 令牌化外观（原生控件承载语义；自绘面板版下一批）。 */
export function TimePicker({ value, onChange, label, disabled, className }: TimePickerProps) {
  return (
    <label className={cn('ui-timepicker', className)}>
      {label && <span className="ui-select__label">{label}</span>}
      <input
        type="time"
        className="ui-select__input"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
