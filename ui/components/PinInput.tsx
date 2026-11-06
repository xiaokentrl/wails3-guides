import { useEffect, useRef, useState, ClipboardEvent, KeyboardEvent } from 'react';
import { cn } from '../lib/cn';
import './PinInput.css';

export interface PinInputProps {
  /** 位数（默认 6） */
  length?: number;
  value: string;
  onChange: (v: string) => void;
  /** 全部填满时回调——是否自动提交由调用方决定（→ 登录与权限方案） */
  onComplete?: (v: string) => void;
  /** 允许的字符过滤（默认数字；如需字母-数字传自定义） */
  filter?: (ch: string) => string;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  /** 键盘类型：numeric（短信/邮箱码）或 text（字母混合） */
  inputMode?: 'numeric' | 'text';
  className?: string;
}

const defaultFilter = (ch: string) => ch.replace(/\D/g, '');

/**
 * OTP 验证码输入（→《验证码方案》前端纪律）：
 * - 粘贴自动分发到各格（含从中间格粘贴）；
 * - 自动前进 / Backspace 后退；空格退到前格并清空；
 * - 填满触发 onComplete（是否自动提交由调用方裁决）；
 * - `autocomplete="one-time-code"` 支持系统级短信码填充。
 * 值的校验在调用方/领域层（→ 输入验证方案）。
 */
export function PinInput({
  length = 6,
  value,
  onChange,
  onComplete,
  filter = defaultFilter,
  disabled,
  error,
  autoFocus,
  inputMode = 'numeric',
  className,
}: PinInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const chars = Array.from({ length }, (_, i) => value[i] ?? '');

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const commit = (next: string) => {
    onChange(next);
    if (next.length === length && !next.includes('')) onComplete?.(next);
  };

  const focusAt = (i: number) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const handleChange = (i: number, raw: string) => {
    const cleaned = filter(raw);
    if (!cleaned) return;
    // 一次输入多字符（输入法/自动填充）：从第 i 格起顺次填充
    const seq = cleaned.slice(0, length - i).split('');
    const arr = [...chars];
    seq.forEach((ch, k) => {
      arr[i + k] = ch;
    });
    const next = arr.join('').slice(0, length);
    commit(next);
    focusAt(i + seq.length);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const arr = [...chars];
      if (arr[i]) {
        arr[i] = '';
        commit(arr.join('')); // 保持当前格焦点，便于重输
      } else if (i > 0) {
        arr[i - 1] = '';
        onChange(arr.join(''));
        focusAt(i - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusAt(i - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusAt(i + 1);
    }
  };

  const handlePaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = filter(e.clipboardData.getData('text')).slice(0, length);
    if (!text) return;
    const arr = [...chars];
    text.split('').forEach((ch, k) => {
      arr[i + k] = ch;
    });
    const next = arr.join('').slice(0, length);
    commit(next);
    focusAt(Math.min(text.length + i, length - 1));
  };

  return (
    <div
      role="group"
      aria-label={`验证码，共 ${length} 位`}
      className={cn('ui-pin', error && 'ui-pin--error', className)}
    >
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode={inputMode}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          value={ch}
          disabled={disabled}
          aria-label={`第 ${i + 1} 位`}
          className={cn('ui-pin__cell', ch && 'ui-pin__cell--filled', focusedIdx === i && 'ui-pin__cell--focused')}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={() => setFocusedIdx(i)}
          onBlur={() => setFocusedIdx(-1)}
        />
      ))}
    </div>
  );
}
