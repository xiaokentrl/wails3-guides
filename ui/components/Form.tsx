import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '../lib/cn';
import './Form.css';

export interface FormErrors {
  [field: string]: string | null;
}

export interface FormContextValue {
  values: Record<string, string>;
  errors: FormErrors;
  setField: (name: string, value: string) => void;
  setError: (name: string, message: string | null) => void;
  clearError: (name: string) => void;
}

const FormContext = createContext<FormContextValue | null>(null);

export interface FormProps {
  initialValues: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
  /** 提交前校验：返回 errors 对象（空 = 通过） */
  validate?: (values: Record<string, string>) => FormErrors;
  children: ReactNode;
  className?: string;
}

/** 表单容器：values 单源 + 校验协议 + 提交收口（→ 输入验证方案：展示层提示 + 领域层校验）。 */
export function Form({ initialValues, onSubmit, validate, children, className }: FormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate?.(values) ?? {};
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(values);
  };

  const value = useMemo(() => ({ values, errors, setField, setError: (n: string, m: string | null) => setErrors((p) => ({ ...p, [n]: m })), clearError: (n: string) => setErrors((p) => ({ ...p, [n]: null })) }), [values, errors]);

  return (
    <FormContext.Provider value={value}>
      <form className={cn('ui-form', className)} onSubmit={handleSubmit} noValidate>
        {children}
      </form>
    </FormContext.Provider>
  );
}

export function useForm(): FormContextValue {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useForm 必须在 <Form> 内使用');
  return ctx;
}

/** 表单字段壳层：label + 控件 + 错误呈现（→ 输入验证方案错误协议）。 */
export function FormField({ name, label, required, children, className }: { name: string; label: string; required?: boolean; children: ReactNode; className?: string }) {
  const ctx = useContext(FormContext);
  const error = ctx?.errors[name] ?? null;
  return (
    <div className={cn('ui-form-field', className)}>
      <label className="ui-form-field__label" htmlFor={`field-${name}`}>
        {required && <span className="ui-form-field__required">*</span>}
        {label}
      </label>
      <div className="ui-form-field__control">{children}</div>
      {error && <p className="ui-form-field__error" role="alert">{error}</p>}
    </div>
  );
}
