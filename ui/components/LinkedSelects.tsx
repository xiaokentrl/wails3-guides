import { cn } from '../lib/cn';
import { Select, type SelectProps } from './Pickers';
import type { CascaderOption } from './Cascader';
import './LinkedSelects.css';

export interface LinkedSelectsProps {
  /** 树形选项：children 形成下一级 */
  options: CascaderOption[];
  /** 路径 value 数组（与 Cascader 同构，可互换） */
  value: string[];
  onChange: (path: string[]) => void;
  /** 各级占位文案（缺省「请选择」） */
  placeholders?: string[];
  className?: string;
}

/**
 * 联动菜单（级联下拉组）：省/市/区式 N 级 Select，选中上级后下级选项随之收敛。
 * value 与Cascader 组件同构（路径 value 数组）——面板版与下拉版可互换。
 * 只渲染到当前已选深度 + 1 列；末级无 children 时不再出现新列。
 */
export function LinkedSelects({ options, value, onChange, placeholders, className }: LinkedSelectsProps) {
  // 列推导：第 0 列 = 根选项；第 i 列 = value[i-1] 命中节点的 children
  const columns: CascaderOption[][] = [options];
  for (let i = 0; i < value.length; i++) {
    const hit = columns[i]?.find((o) => o.value === value[i]);
    if (hit?.children?.length) columns.push(hit.children);
  }
  // 尾列若已选叶子（无 children）则不再追加空列——columns.length 由上面推导自然控制

  const pick = (depth: number, v: string) => {
    // 截断后续级：改选上级 = 下级重置
    onChange([...value.slice(0, depth), v]);
  };

  return (
    <div role="group" aria-label="级联选择" className={cn('ui-linked-selects', className)}>
      {columns.map((col, depth) => (
        <Select
          key={depth}
          label={placeholders?.[depth]}
          value={value[depth] ?? ''}
          onChange={(v) => pick(depth, v)}
          options={[
            { value: '', label: placeholders?.[depth] ?? '请选择', disabled: true },
            ...col.map((o) => ({ value: o.value, label: o.label, disabled: o.disabled })),
          ]}
        />
      ))}
    </div>
  );
}

export type { SelectProps };
