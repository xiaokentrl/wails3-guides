import { ReactNode } from 'react';
import { IconButton } from './IconButton';
import { Stack } from './Layout';

export interface FormListField {
  key: string;
}

export interface FormListProps<T> {
  /** 行数据（调用方状态单源） */
  fields: T[];
  onChange: (fields: T[]) => void;
  /** 行渲染：index 与删除按钮由 FormList 提供 */
  renderRow: (field: T, index: number, remove: () => void) => ReactNode;
  /** 新增行的工厂 */
  createRow: () => T;
  addLabel?: string;
  className?: string;
}

/** 动态字段列表（→ 组件库方案 FormList）：增删由列表统一收口，行内容由调用方渲染。 */
export function FormList<T extends FormListField>({ fields, onChange, renderRow, createRow, addLabel = '添加一项', className }: FormListProps<T>) {
  return (
    <div className={className}>
      <Stack direction="vertical" gap={2}>
        {fields.map((f, i) => (
          <Stack key={f.key} direction="horizontal" gap={2} align="flex-start">
            <div style={{ flex: 1 }}>{renderRow(f, i, () => onChange(fields.filter((_, idx) => idx !== i)))}</div>
            <IconButton
              label={`移除第 ${i + 1} 项`}
              onClick={() => onChange(fields.filter((_, idx) => idx !== i))}
            >
              ×
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <button
        type="button"
        className="ui-formlist__add"
        onClick={() => onChange([...fields, createRow()])}
      >
        + {addLabel}
      </button>
    </div>
  );
}
