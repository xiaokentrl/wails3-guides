import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './Listbox.css';
import './Cascader.css';

export interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
  disabled?: boolean;
}

export interface CascaderProps {
  options: CascaderOption[];
  /** 单选模式：完整路径的 value 数组；多选模式：路径数组的 value 集合 */
  value?: string[] | string[][];
  /** 多选模式：叶子勾选累积多条路径，父节点复选框三态（全选/部分/未选） */
  multiple?: boolean;
  onChange: (v: string[] | string[][]) => void;
  placeholder?: string;
  /** 多选触发器最多直显的 tag 数，超出折叠 +N（默认 2） */
  maxTags?: number;
  /** 面板顶部搜索：按叶子 label/value 过滤，命中平铺为「全路径」列表（搜索态下键盘导航停用，Esc 关闭可用） */
  showSearch?: boolean;
  className?: string;
}

/** 路径集合键（value 数组 join，避免数组直接比较） */
const pathKey = (p: string[]) => p.join('\u0000');

/** 收集某选项下全部叶子路径（含自身为叶子时） */
function leafPathsOf(o: CascaderOption, prefix: string[]): string[][] {
  const base = [...prefix, o.value];
  if (!o.children?.length) return [base];
  return o.children.flatMap((c) => leafPathsOf(c, base));
}

/**
 * 级联选择。
 * 单选：叶子点击即完成，父节点点击展开；
 * 多选（multiple）：每项带复选框——叶子勾选累积路径，父节点三态（勾选 = 整棵子树叶路径全选），
 * 触发器以 tag 回显（可单独移除，超出 maxTags 折叠 +N）。
 * 键盘：↑↓ 移动、→ 展开父级、← 回退、Enter 点按当前项、Escape 关闭。
 */
export function Cascader({ options, value = [], multiple, onChange, placeholder = '请选择', maxTags = 2, showSearch, className }: CascaderProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [path, setPath] = useState<CascaderOption[]>(() => {
    // 初始路径：单选按 value 逐级走；多选取第一条已选路径展开
    const out: CascaderOption[] = [];
    let level = options;
    const walk = multiple ? (value as string[][])[0] ?? [] : (value as string[]);
    for (const v of walk) {
      const hit = level.find((o) => o.value === v);
      if (!hit) break;
      out.push(hit);
      level = hit.children ?? [];
      if (level.length === 0) break;
    }
    return out;
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  /** 键盘活动位：第几列第几项 */
  const [active, setActive] = useState<{ col: number; idx: number } | null>(null);

  const selectedPaths: string[][] = multiple ? (value as string[][]) : [];
  const selectedKeys = new Set(selectedPaths.map(pathKey));

  const columns: CascaderOption[][] = [options];
  for (let i = 0; i < path.length; i++) {
    const children = path[i].children;
    if (children?.length) columns.push(children);
  }

  // 键盘/外点监听只在 open 变化时挂载；最新 active/columns/path/pick 经 ref 读取——
  // 若把 columns（每次渲染新引用）放进依赖，监听器每次渲染拆装，dispatch 拿到的 closure 会陈旧
  const navRef = useRef<{ active: typeof active; columns: CascaderOption[][]; path: CascaderOption[]; pick: (depth: number, o: CascaderOption) => void } | null>(null);

  useEffect(() => {
    if (!open) return;
    setActive({ col: 0, idx: 0 });
    panelRef.current?.focus();
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (showSearch && query) return; // 搜索态：方向键留给输入框，键盘导航停用
      const nav = navRef.current;
      const a = nav?.active;
      if (!nav || !a) return;
      const cols = nav.columns;
      const p = nav.path;
      const doPick = nav.pick;
      const col = cols[a.col];
      if (!col) return;
      const opt = col[a.idx];
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive({ ...a, idx: Math.min(a.idx + 1, col.length - 1) });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive({ ...a, idx: Math.max(a.idx - 1, 0) });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (opt?.children?.length) {
          setPath(p.slice(0, a.col).concat(opt));
          setActive({ col: a.col + 1, idx: 0 });
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (a.col > 0) {
          const prevLabel = p[a.col - 1];
          const prevCol = cols[a.col - 1];
          const idx = Math.max(0, prevCol.findIndex((o) => o.value === prevLabel?.value));
          setPath(p.slice(0, a.col - 1));
          setActive({ col: a.col - 1, idx });
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (opt && !opt.disabled) doPick(a.col, opt);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, showSearch, query]);

  /** 多选：切换一个选项的勾选态。叶子 = 单条路径；父节点 = 整棵子树叶路径全选/全清 */
  const toggleNode = (o: CascaderOption, depth: number) => {
    const prefix = path.slice(0, depth).map((p) => p.value);
    const leaves = leafPathsOf(o, prefix).filter((p) => !p.some((v) => disabledOnPath(options, p)));
    const keys = new Set(leaves.map(pathKey));
    const allSelected = leaves.every((p) => selectedKeys.has(pathKey(p)));
    const next = allSelected
      ? selectedPaths.filter((p) => !keys.has(pathKey(p)))
      : [...selectedPaths.filter((p) => !keys.has(pathKey(p))), ...leaves];
    onChange(next as string[][]);
  };

  const pick = (depth: number, o: CascaderOption) => {
    const next = path.slice(0, depth);
    next.push(o);
    if (o.children?.length) {
      setPath(next);
      setActive({ col: depth + 1, idx: 0 });
      return;
    }
    const pathValues = next.map((x) => x.value);
    if (multiple) {
      toggleNode(o, depth);
      // 多选不关闭，继续勾选
    } else {
      setPath(next); // 选中即落定路径——触发器回显完整路径（重开面板也停在所选层）
      onChange(pathValues);
      setOpen(false);
    }
  };

  // pick 声明之后再同步 ref（渲染期无 TDZ 问题）
  navRef.current = { active, columns, path, pick };

  const removePath = (p: string[]) => {
    onChange(selectedPaths.filter((x) => pathKey(x) !== pathKey(p)) as string[][]);
  };

  // ===== showSearch：叶子平铺命中列表 =====
  const searchLeaves: Array<{ values: string[]; labels: string[] }> = [];
  const flattenLeaves = (nodes: CascaderOption[], labels: string[], values: string[]) => {
    for (const nd of nodes) {
      const l = [...labels, nd.label] as string[];
      const v = [...values, nd.value];
      if (nd.children?.length) flattenLeaves(nd.children, l, v);
      else searchLeaves.push({ values: v, labels: l });
    }
  };
  flattenLeaves(options, [], []);
  const q = query.trim().toLowerCase();
  const matched = q
    ? searchLeaves.filter((leaf) => leaf.labels.some((x) => x.toLowerCase().includes(q)) || leaf.values.some((v) => v.toLowerCase().includes(q)))
    : [];

  /** 搜索命中项点击：单选落定全路径并关面板；多选按路径勾选切换 */
  const pickSearch = (leaf: { values: string[] }) => {
    if (multiple) {
      const k = pathKey(leaf.values);
      const next = selectedKeys.has(k) ? selectedPaths.filter((x) => pathKey(x) !== k) : [...selectedPaths, leaf.values];
      onChange(next as string[][]);
      return;
    }
    // 单选：重建 option 链落定 path（触发器回显 + 重开面板定位）
    const chain: CascaderOption[] = [];
    let level = options;
    for (const v of leaf.values) {
      const hit = level.find((o) => o.value === v);
      if (!hit) break;
      chain.push(hit);
      level = hit.children ?? [];
    }
    setPath(chain);
    onChange(leaf.values);
    setOpen(false);
  };

  /** 按值取 option 链的最后一个（搜索项是否禁用判定） */
  const leafDisabled = (values: string[]) => disabledOnPath(options, values);

  const display = (() => {
    if (multiple) {
      return selectedPaths.length > 0 ? selectedPaths : null;
    }
    return path.length > 0 ? path.map((p) => p.label).join(' / ') : null;
  })();

  return (
    <div ref={rootRef} className={cn('ui-listbox', className)}>
      <button
        type="button"
        className={cn('ui-listbox__trigger', 'ui-cascader__trigger', !display && 'ui-listbox__trigger--placeholder')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={multiple && selectedPaths.length > 0 ? `已选 ${selectedPaths.length} 项` : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        {display === null ? (
          <span className="ui-listbox__placeholder">{placeholder}</span>
        ) : multiple ? (
          <span className="ui-cascader__tags">
            {(display as string[][]).slice(0, maxTags).map((p) => {
              const labels = findPathLabels(options, p);
              return (
                <span
                  key={pathKey(p)}
                  className="ui-cascader__tag"
                  role="button"
                  tabIndex={-1}
                  aria-label={`移除 ${labels.join('/')}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removePath(p);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      removePath(p);
                    }
                  }}
                >
                  {labels.join('/')}
                  <span className="ui-cascader__tag-x" aria-hidden="true">×</span>
                </span>
              );
            })}
            {(display as string[][]).length > maxTags && (
              <span className="ui-cascader__more">+{(display as string[][]).length - maxTags}</span>
            )}
          </span>
        ) : (
          display
        )}
        <span className="ui-listbox__arrow" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="级联选择"
          tabIndex={-1}
          className="ui-cascader"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {showSearch && (
            <input
              type="text"
              className="ui-cascader__search"
              placeholder="搜索…"
              aria-label="搜索级联选项"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
          {showSearch && q ? (
            <ul role="listbox" aria-label="搜索结果" aria-multiselectable={multiple || undefined} className="ui-cascader__column ui-cascader__column--search">
              {matched.length === 0 ? (
                <li className="ui-cascader__search-empty">没有匹配的选项</li>
              ) : (
                matched.map((leaf) => {
                  const disabled = leafDisabled(leaf.values);
                  const checked = selectedKeys.has(pathKey(leaf.values));
                  return (
                    <li
                      key={pathKey(leaf.values)}
                      role="option"
                      aria-selected={checked}
                      aria-disabled={disabled || undefined}
                      className={cn('ui-cascader__option', disabled && 'ui-cascader__option--disabled')}
                      onClick={() => !disabled && pickSearch(leaf)}
                    >
                      {multiple && (
                        <span
                          role="checkbox"
                          aria-checked={checked}
                          aria-label={`勾选 ${leaf.labels.join('/')}`}
                          className={cn('ui-cascader__checkbox', checked && 'ui-cascader__checkbox--checked')}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!disabled) pickSearch(leaf);
                          }}
                        />
                      )}
                      <span className="ui-cascader__label">{leaf.labels.join(' / ')}</span>
                    </li>
                  );
                })
              )}
            </ul>
          ) : (
            columns.map((col, depth) => (
            <ul key={depth} role="listbox" aria-label={`第 ${depth + 1} 级`} aria-multiselectable={multiple || undefined} className="ui-cascader__column">
              {col.map((o, i) => {
                const isActive = path[depth]?.value === o.value;
                const prefix = path.slice(0, depth).map((p) => p.value);
                const nodePath = [...prefix, o.value];
                const isLeaf = !o.children?.length;
                // 多选勾选态：叶子看路径在不在集合里；父节点看子树叶路径全选/部分
                const leaves = leafPathsOf(o, prefix);
                const checkedCount = leaves.filter((p) => selectedKeys.has(pathKey(p))).length;
                const checked = isLeaf ? selectedKeys.has(pathKey(nodePath)) : leaves.length > 0 && checkedCount === leaves.length;
                const indeterminate = !isLeaf && checkedCount > 0 && checkedCount < leaves.length;
                return (
                  <li
                    key={o.value}
                    role="option"
                    aria-selected={isLeaf && multiple ? checked : isActive}
                    aria-disabled={o.disabled || undefined}
                    className={cn('ui-cascader__option', isActive && 'ui-cascader__option--active', active?.col === depth && active?.idx === i && 'ui-cascader__option--keyboard', o.disabled && 'ui-cascader__option--disabled')}
                    onClick={() => !o.disabled && pick(depth, o)}
                  >
                    {multiple && (
                      <span
                        role="checkbox"
                        aria-checked={indeterminate ? 'mixed' : checked}
                        aria-label={`勾选 ${o.label}`}
                        className={cn('ui-cascader__checkbox', checked && 'ui-cascader__checkbox--checked', indeterminate && 'ui-cascader__checkbox--indeterminate')}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!o.disabled) toggleNode(o, depth);
                        }}
                      />
                    )}
                    <span className="ui-cascader__label">{o.label}</span>
                    {o.children?.length ? <span className="ui-cascader__arrow">›</span> : null}
                  </li>
                );
              })}
            </ul>
          ))
        )}
        </div>
      )}
    </div>
  );
}

/** 路径上是否有禁用节点（禁用子树的叶子不可勾选） */
function disabledOnPath(options: CascaderOption[], path: string[]): boolean {
  let level = options;
  for (const v of path) {
    const hit = level.find((o) => o.value === v);
    if (!hit) return false;
    if (hit.disabled) return true;
    level = hit.children ?? [];
  }
  return false;
}

function findPathLabels(options: CascaderOption[], path: string[]): string[] {
  const labels: string[] = [];
  let level = options;
  for (const v of path) {
    const hit = level.find((o) => o.value === v);
    if (!hit) break;
    labels.push(hit.label);
    level = hit.children ?? [];
  }
  return labels;
}
