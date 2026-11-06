import { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './InputGroup.css';

export interface InputGroupProps {
  /** 前缀（图标 / 文字标签） */
  prefix?: ReactNode;
  /** 后缀（清除按钮 / 单位 / 密码切换） */
  suffix?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** 输入组：在输入框前后插入装饰性内容（图标 / 单位 / 按钮），不影响输入逻辑。 */
export function InputGroup({ prefix, suffix, children, className }: InputGroupProps) {
  return (
    <div className={cn('ui-input-group', className)}>
      {prefix && <span className="ui-input-group__prefix">{prefix}</span>}
      {children}
      {suffix && <span className="ui-input-group__suffix">{suffix}</span>}
    </div>
  );
}
