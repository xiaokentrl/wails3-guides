import { useState } from 'react';
import { TextInput } from '../components/TextInput';
import { Select } from '../components/Pickers';
import { Button } from '../components/Button';
import { Stack } from '../components/Layout';

export interface SearchFormField {
  key: string;
  label: string;
  kind?: 'text' | 'select';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface SearchFormProps {
  fields: SearchFormField[];
  onSearch: (values: Record<string, string>) => void;
  onReset?: () => void;
  searching?: boolean;
  className?: string;
}

/**
 * 通用业务组件 · 搜索表单：字段声明驱动，组合 TextInput / Select / Button。
 * 提交值交给调用方做领域校验（→ 输入验证方案：这里只有展示层校验）。
 */
export function SearchForm({ fields, onSearch, onReset, searching, className }: SearchFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => setValues((prev) => ({ ...prev, [k]: v }));

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(values);
      }}
    >
      <Stack direction="horizontal" gap={3} wrap align="flex-end">
        {fields.map((f) =>
          f.kind === 'select' ? (
            <Select
              key={f.key}
              label={f.label}
              value={values[f.key] ?? ''}
              onChange={(v) => set(f.key, v)}
              options={[{ value: '', label: f.placeholder ?? '全部' }, ...(f.options ?? [])]}
            />
          ) : (
            <TextInput
              key={f.key}
              label={f.label}
              placeholder={f.placeholder}
              value={values[f.key] ?? ''}
              onChange={(e) => set(f.key, e.target.value)}
            />
          ),
        )}
        <Button type="submit" variant="primary" loading={searching}>
          查询
        </Button>
        {onReset && (
          <Button
            variant="ghost"
            onClick={() => {
              setValues({});
              onReset();
            }}
          >
            重置
          </Button>
        )}
      </Stack>
    </form>
  );
}
