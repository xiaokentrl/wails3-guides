import { cn } from '../lib/cn';
import './Switch.css';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 开关：role=switch 的 button 承载语义，Space/Enter 触发（button 原生行为）。
 * 状态文字由 label 表达，不依赖颜色（→ 无障碍第二通道）。
 */
export function Switch({ checked, onChange, label, disabled, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn('ui-switch', checked && 'ui-switch--on', className)}
    >
      <span className="ui-switch__track" aria-hidden="true">
        <span className="ui-switch__thumb" />
      </span>
      <span className="ui-switch__label" aria-hidden="true">
        {label}
      </span>
    </button>
  );
}
