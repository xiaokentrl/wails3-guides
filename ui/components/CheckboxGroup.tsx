import { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { Checkbox } from './Checkbox';

export interface CheckboxGroupProps {
  options: (Omit<InputHTMLAttributes<HTMLInputElement>, 'checked' | 'onChange' | 'type'> & { value: string; label: string })[];
  values: string[];
  onChange: (values: string[]) => void;
  /** 排布方向 */
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

/** 复选组：values 单源，选项为受控投影。 */
export function CheckboxGroup({ options, values, onChange, direction = 'horizontal', className }: CheckboxGroupProps) {
  return (
    <div role="group" className={cn('ui-checkbox-group', `ui-checkbox-group--${direction}`, className)}>
      {options.map((o) => (
        <Checkbox
          key={o.value}
          label={o.label}
          checked={values.includes(o.value)}
          onChange={(e) => onChange(e.target.checked ? [...values, o.value] : values.filter((v) => v !== o.value))}
        />
      ))}
    </div>
  );
}
