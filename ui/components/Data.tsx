import { CSSProperties, Fragment, ReactNode, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { cn } from '../lib/cn';
import './Data.css';

/* ---- Skeleton：骨架屏（→ 状态方案：未就绪显示加载态而非默认值冒充） ---- */

export function Skeleton({ width = '100%', height = 14, className }: { width?: CSSProperties['width']; height?: number; className?: string }) {
  return <span className={cn('ui-skeleton', className)} style={{ width, height }} aria-hidden="true" />;
}

/* ---- Table：语义 table + 令牌化外观；虚拟滚动/可编辑列设为下一批 ---- */

export interface TableColumn<Row> {
  key: string;
  title: ReactNode;
  render?: (row: Row, index: number) => ReactNode;
  width?: CSSProperties['width'];
  align?: 'left' | 'center' | 'right';
  /** 提供即启用排序（点击表头循环：升 → 降 → 不排） */
  sorter?: (a: Row, b: Row) => number;
  /** 固定列（须配数值 width；sticky 偏移由前面同侧固定列宽求和得出） */
  fixed?: 'left' | 'right';
  /** 提供即启用列筛选：表头漏斗图标 → 勾选值面板（即选即筛） */
  filters?: Array<{ text: ReactNode; value: string }>;
  onFilter?: (value: string, row: Row) => boolean;
  /** 子列（多级表头：分组列只做表头合并，排序/筛选/固定/拖拽都在叶子列上） */
  children?: TableColumn<Row>[];
}

export interface TableProps<Row> {
  columns: TableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row, index: number) => string;
  empty?: ReactNode;
  /** 排序变化回调（服务端排序时使用；不传则客户端排序） */
  onSortChange?: (sort: { key: string; order: 'asc' | 'desc' } | null) => void;
  /** 视口高度：设置后表体在容器内滚动、表头吸顶（sticky thead） */
  scrollY?: number;
  /** 表格最小宽度（窄容器横向滚动） */
  scrollX?: number | string;
  /** 行选择：首列 checkbox + 表头全选（半选态）；受控 */
  selection?: { selected: string[]; onChange: (selected: string[]) => void };
  /** 行展开：返回展开区内容；展开态组件内自管 */
  expandable?: (row: Row, index: number) => ReactNode;
  /** 汇总行：返回各列单元格内容（scrollY 时贴底吸附）；key 与 columns 对齐，跳过某列返回 undefined */
  summary?: (rows: Row[]) => Array<ReactNode | undefined>;
  /** 虚拟滚动：固定行高（虚拟化前提）；需与 scrollY 同用。spacer 行方案——thead 吸顶与全选均不受影响 */
  virtual?: { rowHeight: number };
  /** 列宽拖拽（table-layout: fixed；每列拖拽区间 60px 下限） */
  resizable?: boolean;
  className?: string;
}

export function Table<Row>({ columns, rows, rowKey, empty = '暂无数据', onSortChange, scrollY, scrollX, selection, expandable, summary, virtual, resizable, className }: TableProps<Row>) {
  const [sort, setSort] = useState<{ key: string; order: 'asc' | 'desc' } | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [scrollTop, setScrollTop] = useState(0);
  // 列宽拖拽：拖过才有记录（未拖列保持声明宽）
  const [widths, setWidths] = useState<Record<string, number>>({});
  const dragRef = useRef<{ key: string; startX: number; startW: number } | null>(null);
  // 列筛选：每列激活的筛选值集合
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [filterOpen, setFilterOpen] = useState<string | null>(null);

  const cycleSort = (col: TableColumn<Row>) => {
    if (!col.sorter) return;
    const next = sort?.key === col.key ? (sort.order === 'asc' ? { key: col.key, order: 'desc' as const } : null) : { key: col.key, order: 'asc' as const };
    setSort(next);
    onSortChange?.(next);
  };


  // ===== 多级表头：叶子列扁平化（后续一切数据列操作都基于叶子） =====
  const hasGroups = columns.some((c) => c.children?.length);
  const leaves: TableColumn<Row>[] = hasGroups
    ? columns.flatMap((c) => (c.children?.length ? c.children : [c]))
    : columns;
  const countLeaves = (c: TableColumn<Row>): number => (c.children?.length ? c.children.reduce((n, x) => n + countLeaves(x), 0) : 1);

  // ===== 固定列 / 列宽拖拽 / 列筛选 =====
  const widthFor = (c: TableColumn<Row>): CSSProperties['width'] | undefined => widths[c.key] ?? c.width;
  const numOf = (c: TableColumn<Row>): number => {
    const w = widthFor(c);
    return typeof w === 'number' ? w : 120;
  };
  const leftCols = leaves.filter((c) => c.fixed === 'left');
  const rightCols = leaves.filter((c) => c.fixed === 'right');
  const fixedStyle = (c: TableColumn<Row>): CSSProperties | undefined => {
    if (!c.fixed) return undefined;
    if (c.fixed === 'left') {
      let x = 0;
      for (const p of leftCols) {
        if (p.key === c.key) break;
        x += numOf(p);
      }
      return { left: x };
    }
    let x = 0;
    for (let i = rightCols.length - 1; i >= 0; i--) {
      const p = rightCols[i];
      if (p.key === c.key) break;
      x += numOf(p);
    }
    return { right: x };
  };

  const renderLeafTh = (c: TableColumn<Row>, rowSpan = 1) => (
    <th
      key={c.key}
      colSpan={1}
      rowSpan={rowSpan}
      scope="col"
      aria-sort={sort?.key === c.key ? (sort.order === 'asc' ? 'ascending' : 'descending') : undefined}
      style={{ width: widthFor(c), textAlign: c.align, ...(fixedStyle(c) ?? {}) }}
      className={cn(c.fixed && 'ui-table__fixed')}
    >
      {c.sorter ? (
        <button type="button" className="ui-table__sort" onClick={() => cycleSort(c)}>
          {c.title}
          <span className="ui-table__sort-icon" aria-hidden="true">
            {sort?.key === c.key ? (sort.order === 'asc' ? '▲' : '▼') : '↕'}
          </span>
        </button>
      ) : (
        c.title
      )}
      {c.filters && (
        <span className="ui-table__filterwrap">
          <button
            type="button"
            className={cn('ui-table__filter', (filters[c.key]?.length ?? 0) > 0 && 'ui-table__filter--active')}
            aria-label={`筛选${typeof c.title === 'string' ? `：${c.title}` : ''}`}
            aria-expanded={filterOpen === c.key}
            onClick={(e) => {
              e.stopPropagation();
              setFilterOpen((k) => (k === c.key ? null : c.key));
            }}
          >
            ⏷
          </button>
          {filterOpen === c.key && (
            <span className="ui-table__filterpanel" role="group" aria-label="筛选值" onMouseDown={(e) => e.stopPropagation()}>
              {c.filters.map((f) => (
                <label key={f.value} className="ui-table__filterrow">
                  <input
                    type="checkbox"
                    checked={(filters[c.key] ?? []).includes(f.value)}
                    onChange={(e) => {
                      const cur = filters[c.key] ?? [];
                      setColFilter(c.key, e.target.checked ? [...cur, f.value] : cur.filter((x) => x !== f.value));
                    }}
                  />
                  {f.text}
                </label>
              ))}
              <button type="button" className="ui-table__filterclear" onClick={() => setColFilter(c.key, [])}>
                清空
              </button>
            </span>
          )}
        </span>
      )}
      {resizable && (
        <span
          className="ui-table__resizer"
          aria-hidden="true"
          onPointerDown={startResize(c)}
          onPointerMove={(e) => {
            const d = dragRef.current;
            if (!d) return;
            const w = Math.max(60, d.startW + (e.clientX - d.startX));
            setWidths((prev) => ({ ...prev, [d.key]: w }));
          }}
          onPointerUp={() => {
            dragRef.current = null;
          }}
        />
      )}
    </th>
  );
  const renderGroupTh = (c: TableColumn<Row>, colSpan: number) => (
    <th key={c.key} colSpan={colSpan} scope="colgroup" style={{ textAlign: c.align }}>
      {c.title}
    </th>
  );
  const setColFilter = (key: string, vals: string[]) => setFilters((prev) => ({ ...prev, [key]: vals }));
  const startResize = (c: TableColumn<Row>) => (e: ReactPointerEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const startW = typeof widthFor(c) === 'number' ? (widthFor(c) as number) : 140;
    dragRef.current = { key: c.key, startX: e.clientX, startW };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  useEffect(() => {
    if (!filterOpen) return;
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.ui-table__filterwrap')) setFilterOpen(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [filterOpen]);

  const sortedRows = (() => {
    const base = (() => {
      const filterEntries = Object.entries(filters).filter(([, vals]) => vals.length > 0);
      if (filterEntries.length === 0) return rows;
      return rows.filter((r) =>
        filterEntries.every(([key, vals]) => {
          const col = leaves.find((c) => c.key === key);
          const onFilter = col?.onFilter;
          if (!onFilter) return true;
          return vals.some((v) => onFilter(v, r));
        }),
      );
    })();
    if (!sort) return base;
    const col = leaves.find((c) => c.key === sort.key);
    if (!col?.sorter) return base;
    const cmp = col.sorter;
    return [...base].sort((a, b) => (sort.order === 'asc' ? cmp(a, b) : cmp(b, a)));
  })();

  // 行选择：keys 与全选/半选推导
  const allKeys = sortedRows.map((r, i) => rowKey(r, i));
  const selectedSet = new Set(selection?.selected ?? []);
  const selectedCount = allKeys.filter((k) => selectedSet.has(k)).length;
  const allSelected = allKeys.length > 0 && selectedCount === allKeys.length;
  const someSelected = selectedCount > 0 && selectedCount < allKeys.length;
  const toggleAll = () => selection?.onChange(allSelected ? [] : allKeys);
  const toggleRow = (key: string) => {
    if (!selection) return;
    selection.onChange(selectedSet.has(key) ? selection.selected.filter((k) => k !== key) : [...selection.selected, key]);
  };

  // 虚拟化：可见窗口计算（spacer 行方案——table 语义保持，thead 吸顶/全选不受影响）
  const rowHeight = virtual?.rowHeight ?? 0;
  const virtualOn = !!virtual && !!scrollY && rowHeight > 0;
  const OVERSCAN = 5;
  const viewportH = scrollY ?? 0;
  const vStart = virtualOn ? Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN) : 0;
  const vVisible = virtualOn ? Math.ceil(viewportH / rowHeight) + OVERSCAN * 2 : sortedRows.length;
  const vEnd = virtualOn ? Math.min(sortedRows.length, vStart + vVisible) : sortedRows.length;
  const visibleRows = virtualOn ? sortedRows.slice(vStart, vEnd).map((row, i) => ({ row, index: vStart + i })) : sortedRows.map((row, index) => ({ row, index }));
  const colCount = leaves.length + (selection ? 1 : 0) + (expandable ? 1 : 0);
  const summaryCells = summary?.(sortedRows);

  const renderRow = (row: Row, index: number) => {
    const key = rowKey(row, index);
    const isOpen = expandable ? expanded.has(key) : false;
    const main = (
      <tr key={key}>
        {selection && (
          <td className="ui-table__check">
            <input type="checkbox" aria-label={`选择第 ${index + 1} 行`} checked={selectedSet.has(key)} onChange={() => toggleRow(key)} />
          </td>
        )}
        {expandable && (
          <td className="ui-table__expand">
            <button type="button" aria-expanded={isOpen} aria-label={isOpen ? '收起' : '展开'} onClick={() => setExpanded((prev) => { const n = new Set(prev); if (n.has(key)) n.delete(key); else n.add(key); return n; })}>
              {isOpen ? '▾' : '▸'}
            </button>
          </td>
        )}
        {leaves.map((c) => (
          <td
            key={c.key}
            style={{ textAlign: c.align, ...(fixedStyle(c) ?? {}) }}
            className={cn(c.fixed && 'ui-table__fixed')}
          >
            {c.render ? c.render(row, index) : ((row as Record<string, ReactNode>)[c.key] ?? '')}
          </td>
        ))}
      </tr>
    );
    if (!expandable) return main;
    return (
      <Fragment key={key}>
        {main}
        {isOpen && (
          <tr className="ui-table__expanded-row">
            <td colSpan={colCount}>{expandable(row, index)}</td>
          </tr>
        )}
      </Fragment>
    );
  };

  return (
    <div className={cn('ui-table-wrap', className)}>
      <div className="ui-table__scroll" style={scrollY ? { maxHeight: scrollY, overflowY: 'auto' } : undefined} onScroll={virtualOn ? (e) => setScrollTop(e.currentTarget.scrollTop) : undefined}>
      <table className="ui-table" style={{ minWidth: scrollX, ...(resizable ? { tableLayout: 'fixed' as const } : {}) }}>
        <thead>
          <tr>
            {selection && (
              <th className="ui-table__check" rowSpan={hasGroups ? 2 : 1} scope="col">
                <input
                  type="checkbox"
                  aria-label={allSelected ? '取消全选' : '全选'}
                  aria-checked={someSelected ? 'mixed' : allSelected}
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected; }}
                  onChange={toggleAll}
                />
              </th>
            )}
            {expandable && <th className="ui-table__expand" rowSpan={hasGroups ? 2 : 1} scope="col" aria-label="展开" />}
            {columns.map((c) => (c.children?.length ? renderGroupTh(c, countLeaves(c)) : renderLeafTh(c, hasGroups ? 2 : 1)))}
          </tr>
          {hasGroups && <tr>{columns.flatMap((c) => c.children ?? []).map((c) => renderLeafTh(c))}</tr>}
        </thead>
        <tbody>
          {virtualOn && vStart > 0 && (
            <tr aria-hidden="true" style={{ height: vStart * rowHeight }}>
              <td colSpan={colCount} style={{ padding: 0, border: 'none' }} />
            </tr>
          )}
          {visibleRows.map(({ row, index }) => renderRow(row, index))}
          {virtualOn && vEnd < sortedRows.length && (
            <tr aria-hidden="true" style={{ height: (sortedRows.length - vEnd) * rowHeight }}>
              <td colSpan={colCount} style={{ padding: 0, border: 'none' }} />
            </tr>
          )}
          {rows.length === 0 && (
            <tr>
              <td colSpan={colCount} className="ui-table__empty">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
        {summaryCells && summaryCells.some((c) => c !== undefined) && (
          <tfoot className="ui-table__foot">
            <tr>
              {selection && <td className="ui-table__check" />}
              {expandable && <td className="ui-table__expand" />}
              {summaryCells.map((cell, i) => (
                <td key={leaves[i]?.key ?? i} style={{ textAlign: leaves[i]?.align }}>
                  {cell ?? ''}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
      </div>
    </div>
  );
}

/* ---- EditableCell：点击进入编辑、Enter/失焦提交、Escape 取消（组合进 Table 的 render） ---- */

export interface EditableCellProps {
  value: string;
  onCommit: (v: string) => void;
  /** 提交前校验：返回错误文案则不提交并显示（→ 输入验证协议，code 在调用方解析） */
  validate?: (v: string) => string | null;
}

export function EditableCell({ value, onCommit, validate }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);

  const commit = () => {
    const err = validate?.(draft) ?? null;
    if (err) {
      setError(err);
      return;
    }
    setEditing(false);
    if (draft !== value) onCommit(draft);
  };

  if (!editing) {
    return (
      <button
        type="button"
        className="ui-editable"
        onClick={() => {
          setDraft(value);
          setError(null);
          setEditing(true);
        }}
        aria-label={`编辑 ${value}`}
      >
        {value}
      </button>
    );
  }
  return (
    <span className="ui-editable__editing">
      <input
        className="ui-input"
        value={draft}
        autoFocus
        aria-invalid={!!error}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setDraft(value);
            setEditing(false);
          }
        }}
      />
      {error && <span className="ui-editable__error">{error}</span>}
    </span>
  );
}

/* ---- Descriptions：键值对列表 ---- */

export interface DescriptionItem {
  label: ReactNode;
  value: ReactNode;
}

export function Descriptions({ items, columns = 2, className }: { items: DescriptionItem[]; columns?: 1 | 2 | 3; className?: string }) {
  return (
    <dl className={cn('ui-descriptions', `ui-descriptions--cols-${columns}`, className)}>
      {items.map((it, i) => (
        <div key={i} className="ui-descriptions__row">
          <dt className="ui-descriptions__label">{it.label}</dt>
          <dd className="ui-descriptions__value">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---- Progress：bar / ring 双形态 ---- */

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  /** bar = 条形；ring = 圆环 */
  kind?: 'bar' | 'ring';
  showPercent?: boolean;
  className?: string;
}

export function Progress({ value, max = 100, label, kind = 'bar', showPercent = true, className }: ProgressProps) {
  const percent = Math.round((Math.min(value, max) / max) * 100);
  if (kind === 'ring') {
    return (
      <div
        className={cn('ui-progress-ring', className)}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        style={{ ['--ui-progress' as string]: `${percent}%` }}
      >
        <span className="ui-progress-ring__text">{showPercent ? `${percent}%` : ''}</span>
      </div>
    );
  }
  return (
    <div className={cn('ui-progress', className)}>
      {label && <span className="ui-progress__label">{label}</span>}
      <div
        className="ui-progress__bar"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <span className="ui-progress__fill" style={{ width: `${percent}%` }} />
      </div>
      {showPercent && <span className="ui-progress__percent">{percent}%</span>}
    </div>
  );
}

/* ---- Empty：空态四变体（→ 组件库方案空态变体） ---- */

export interface EmptyProps {
  /** 场景决定文案与动作：无数据 / 无权限 / 无网络 / 搜索为空 */
  variant?: 'no-data' | 'no-permission' | 'no-network' | 'no-result';
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EMPTY_TEXT: Record<string, string> = {
  'no-data': '暂无数据',
  'no-permission': '没有访问权限',
  'no-network': '网络不可用，请检查连接',
  'no-result': '没有匹配的结果',
};

export function Empty({ variant = 'no-data', description, action, className }: EmptyProps) {
  return (
    <div className={cn('ui-empty', className)}>
      <p className="ui-empty__text">{description ?? EMPTY_TEXT[variant]}</p>
      {action && <div className="ui-empty__action">{action}</div>}
    </div>
  );
}

/* ---- Timeline ---- */

export interface TimelineItem {
  title: ReactNode;
  description?: ReactNode;
  time?: ReactNode;
}

export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <ol className={cn('ui-timeline', className)}>
      {items.map((it, i) => (
        <li key={i} className="ui-timeline__item">
          <span className="ui-timeline__dot" aria-hidden="true" />
          <div className="ui-timeline__content">
            <div className="ui-timeline__title">{it.title}</div>
            {it.description && <div className="ui-timeline__desc">{it.description}</div>}
            {it.time && <div className="ui-timeline__time">{it.time}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---- Collapse：details/summary 承载语义与键盘（→ 原生控件优先） ---- */

export interface CollapseItem {
  key: string;
  title: ReactNode;
  content: ReactNode;
}

export function Collapse({ items, className }: { items: CollapseItem[]; className?: string }) {
  return (
    <div className={cn('ui-collapse', className)}>
      {items.map((it) => (
        <details key={it.key} className="ui-collapse__item">
          <summary className="ui-collapse__summary">{it.title}</summary>
          <div className="ui-collapse__content">{it.content}</div>
        </details>
      ))}
    </div>
  );
}

/* ---- Statistic ---- */

export interface StatisticProps {
  title: ReactNode;
  value: ReactNode;
  suffix?: ReactNode;
  className?: string;
}

export function Statistic({ title, value, suffix, className }: StatisticProps) {
  return (
    <div className={cn('ui-statistic', className)}>
      <div className="ui-statistic__title">{title}</div>
      <div className="ui-statistic__value">
        {value}
        {suffix && <span className="ui-statistic__suffix">{suffix}</span>}
      </div>
    </div>
  );
}
