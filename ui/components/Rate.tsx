import { useState } from 'react';
import { cn } from '../lib/cn';
import { Icon } from './Icon';
import './Rate.css';

export interface RateProps {
  value: number;
  onChange: (v: number) => void;
  /** 星数（默认 5） */
  count?: number;
  /** 只读展示 */
  readOnly?: boolean;
  /** 允许清除（再次点击同值清零） */
  allowClear?: boolean;
  className?: string;
}

/** 星级评分：readOnly 模式用文本 + 星形图标（读屏可得的第二通道）。键盘 ←→ 调整。 */
export function Rate({ value, onChange, count = 5, readOnly, allowClear = true, className }: RateProps) {
  const [hover, setHover] = useState(0);
  const shown = readOnly ? value : hover || value;

  return (
    <div
      className={cn('ui-rate', readOnly && 'ui-rate--readonly', className)}
      role={readOnly ? undefined : 'slider'}
      tabIndex={readOnly ? undefined : 0}
      aria-valuemin={0}
      aria-valuemax={count}
      aria-valuenow={value}
      aria-label={`评分 ${value} / ${count}`}
      onKeyDown={(e) => {
        if (readOnly) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          onChange(Math.min(count, value + 1));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          const next = value - 1;
          onChange(next > 0 || allowClear ? Math.max(0, next) : 1);
        }
      }}
      onMouseLeave={() => setHover(0)}
    >
      {Array.from({ length: count }, (_, i) => {
        const star = i + 1;
        const filled = star <= shown;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            className={cn('ui-rate__star', filled && 'ui-rate__star--filled')}
            aria-label={`${star} 星`}
            onMouseEnter={() => !readOnly && setHover(star)}
            onClick={() => {
              if (readOnly) return;
              onChange(allowClear && value === star ? 0 : star);
            }}
          >
            <Icon name="star" size={18} />
          </button>
        );
      })}
      {readOnly && (
        <span className="ui-rate__text">
          {value} / {count}
        </span>
      )}
    </div>
  );
}
