import { forwardRef, useId, InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import './Field.css';

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** 结构化错误的文案（由调用方从码表解析，组件不拼人话 → 输入验证协议） */
  error?: string;
  hint?: string;
}

/**
 * 单行输入。
 * IME 纪律：本组件不拦截、不改写输入值；格式化/校验请在组合结束（compositionEnd）后进行，
 * 且不要在受控 onChange 里对组合态中的值做程序性改写（→《国际化与输入技术方案》）。
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, error, hint, id: idProp, className, ...rest },
  ref,
) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={cn('ui-field', className)}>
      {label && (
        <label className="ui-field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn('ui-input', error && 'ui-input--error')}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {error ? (
        <p className="ui-field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="ui-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
