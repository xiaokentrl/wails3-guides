import { useId, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Form.css';

export interface RadioProps {
  checked: boolean;
  onChange: () => void;
  label: ReactNode;
  name: string;
  disabled?: boolean;
}

export function Radio({ checked, onChange, label, name, disabled }: RadioProps) {
  const id = useId();
  return (
    <span className={cn('ui-radio', disabled && 'ui-radio--disabled')}>
      <input id={id} type="radio" name={name} checked={checked} disabled={disabled} onChange={onChange} className="ui-radio__input" />
      <span className="ui-radio__dot" aria-hidden="true" />
      <label htmlFor={id} className="ui-radio__label">
        {label}
      </label>
    </span>
  );
}

export interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: ReactNode; disabled?: boolean }[];
  /** 排布方向 */
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export function RadioGroup({ name, value, onChange, options, direction = 'horizontal', className }: RadioGroupProps) {
  return (
    <div role="radiogroup" className={cn('ui-radio-group', `ui-radio-group--${direction}`, className)}>
      {options.map((o) => (
        <Radio key={o.value} name={name} label={o.label} checked={o.value === value} disabled={o.disabled} onChange={() => onChange(o.value)} />
      ))}
    </div>
  );
}
