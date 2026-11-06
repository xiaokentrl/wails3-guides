import { forwardRef, useCallback, useId, useState, InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { TextInput } from './TextInput';
import './Form.css';

/* ---- InputNumber：步进数字输入，非法输入回落为上一次合法值 ---- */

export interface InputNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number | null;
  onChange: (v: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(
  { value, onChange, min, max, step = 1, className, ...rest },
  ref,
) {
  const clamp = (v: number) => {
    if (min !== undefined && v < min) return min;
    if (max !== undefined && v > max) return max;
    return v;
  };
  const change = (raw: string) => {
    if (raw.trim() === '') {
      onChange(null);
      return;
    }
    const n = Number(raw);
    if (Number.isFinite(n)) onChange(clamp(n));
  };
  return (
    <div className={cn('ui-input-number', className)}>
      <button type="button" className="ui-input-number__btn" aria-label="减少" onClick={() => onChange(clamp((value ?? 0) - step))}>
        −
      </button>
      <input
        ref={ref}
        type="number"
        inputMode="decimal"
        className="ui-input-number__input"
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        onChange={(e) => change(e.target.value)}
        {...rest}
      />
      <button type="button" className="ui-input-number__btn" aria-label="增加" onClick={() => onChange(clamp((value ?? 0) + step))}>
        +
      </button>
    </div>
  );
});

/* ---- PasswordInput：显隐切换（复用 TextInput 的 label/error 能力） ---- */

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { label, error, className, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const toggle = useCallback(() => setVisible((v) => !v), []);
  return (
    <div className={cn('ui-password', className)} onPaste={(e) => e.stopPropagation()}>
      <TextInput ref={ref} id={id} label={label} error={error} type={visible ? 'text' : 'password'} {...rest} />
      <button type="button" className="ui-password__toggle" aria-pressed={visible} aria-label={visible ? '隐藏密码' : '显示密码'} onClick={toggle}>
        {visible ? '隐藏' : '显示'}
      </button>
    </div>
  );
});

/* ---- SearchInput：语义 type=search，清除按钮 ---- */

export const SearchInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function SearchInput(
  { className, ...rest },
  ref,
) {
  return (
    <div className={cn('ui-search', className)}>
      <TextInput ref={ref} type="search" placeholder="搜索…" {...rest} />
    </div>
  );
});
