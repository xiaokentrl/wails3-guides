import { cn } from '../lib/cn';
import './ColorPicker.css';

export interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  /** 预设色板（不传则用默认 16 色） */
  swatches?: string[];
  /** 是否显示自定义 hex 输入 */
  showHexInput?: boolean;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_SWATCHES = [
  '#2f6fed', '#2e8a4f', '#d64545', '#b97a12', '#8b5cf6', '#ec4899',
  '#0ea5e9', '#f97316', '#14b8a6', '#8b4513', '#6b7280', '#1c2430',
];

/** 颜色选择器：预设色板 + 自定义 hex 输入。原生 color input 兜底自定义。 */
export function ColorPicker({ value, onChange, swatches = DEFAULT_SWATCHES, showHexInput = true, disabled, className }: ColorPickerProps) {
  return (
    <div className={cn('ui-colorpicker', disabled && 'ui-colorpicker--disabled', className)}>
      <div className="ui-colorpicker__swatches" role="listbox" aria-label="颜色选择">
        {swatches.map((c) => (
          <button
            key={c}
            type="button"
            role="option"
            aria-selected={c === value}
            className={cn('ui-colorpicker__swatch', c === value && 'ui-colorpicker__swatch--active')}
            style={{ background: c }}
            disabled={disabled}
            onClick={() => onChange(c)}
            aria-label={`颜色 ${c}`}
          />
        ))}
      </div>
      {showHexInput && (
        <div className="ui-colorpicker__custom">
          <label className="ui-colorpicker__hex-label">
            <input
              type="color"
              className="ui-colorpicker__native"
              value={value}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value)}
              aria-label="自定义颜色"
            />
            <span className="ui-colorpicker__hex-value">{value}</span>
          </label>
        </div>
      )}
    </div>
  );
}
