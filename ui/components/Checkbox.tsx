import { forwardRef, useId, InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

/**
 * 复选框：原生 input 承载语义与键盘行为（原生控件 = 免费的正确语义），
 * 自绘的只是盒子外观。整个组件用 label 包裹——点击框体或文字均可切换。
 * 焦点环挂在盒子上（焦点可见，→ 无障碍纪律）。
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, id: idProp, className, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  return (
    <label className={cn('ui-checkbox', className)} htmlFor={id}>
      <input ref={ref} id={id} type="checkbox" className="ui-checkbox__input" {...rest} />
      <span className="ui-checkbox__box" aria-hidden="true" />
      <span className="ui-checkbox__text">
        <span className="ui-checkbox__label">{label}</span>
        {description && <span className="ui-checkbox__desc">{description}</span>}
      </span>
    </label>
  );
});
