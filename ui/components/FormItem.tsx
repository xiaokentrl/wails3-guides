import { Children, cloneElement, isValidElement, ReactElement, useId } from 'react';
import { cn } from '../lib/cn';
import './Form.css';

export interface FormItemProps {
  label?: string;
  /** 必填标记（星号仅为视觉，真正校验在领域层 → 输入验证方案） */
  required?: boolean;
  error?: string;
  hint?: string;
  /** 单个控件：cloneElement 注入 id 完成 label 关联（控件需透传 id 到可聚焦元素） */
  children: ReactElement<{ id?: string }>;
  className?: string;
}

/**
 * 通用字段壳层：为 Switch / Slider / 自定义控件补齐 label / 必填 / 错误 / 提示的关联结构。
 * 内置 TextInput / Textarea 已自带壳层，无需再包 FormItem。
 */
export function FormItem({ label, required, error, hint, children, className }: FormItemProps) {
  const id = useId();
  const child = Children.only(children);
  const control = isValidElement<{ id?: string }>(child) && !child.props.id
    ? cloneElement(child as ReactElement<{ id?: string }>, { id })
    : child;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={cn('ui-field', className)}>
      {label && (
        <label className="ui-field__label" htmlFor={id}>
          {required && (
            <span className="ui-formitem__required" aria-hidden="true">
              *
            </span>
          )}
          {label}
        </label>
      )}
      <div className="ui-formitem__control" aria-describedby={describedBy}>
        {control}
      </div>
      {error ? (
        <p className="ui-field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="ui-field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
