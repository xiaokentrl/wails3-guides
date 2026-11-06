import { ReactNode, useState } from 'react';
import { cn } from '../lib/cn';
import { Card } from '../components/Card';
import { Table, type TableColumn } from '../components/Data';
import { Pagination } from '../components/Nav';
import './AdvancedTable.css';

export interface AdvancedTableProps<Row> {
  columns: TableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row, index: number) => string;
  /** 客户端分页：传 pageSize 即启用；不传（或配 total/page）走服务端分页 */
  pageSize?: number;
  /** 服务端分页模式：总条数 */
  total?: number;
  /** 服务端分页模式：受控当前页 */
  page?: number;
  onPageChange?: (p: number) => void;
  /** 工具栏插槽（搜索表单、批量按钮等） */
  toolbar?: ReactNode;
  empty?: ReactNode;
  className?: string;
}

/**
 * 通用业务组件 · 高级表格：Table + 分页 + 工具栏的组合。
 * 客户端 / 服务端分页二选一：传 pageSize 走客户端切片；传 total+page+onPageChange 走服务端（排序回调同样向上）。
 */
export function AdvancedTable<Row>(props: AdvancedTableProps<Row>) {
  const { columns, rows, rowKey, pageSize, total, page, onPageChange, toolbar, empty, className } = props;
  const [innerPage, setInnerPage] = useState(1);

  const clientMode = pageSize !== undefined && total === undefined;
  const currentPage = page ?? innerPage;
  const paged = clientMode ? rows.slice((currentPage - 1) * pageSize!, currentPage * pageSize!) : rows;
  const count = total ?? rows.length;
  const hasPagination = clientMode || total !== undefined;

  return (
    <Card padding="none" className={cn('ui-advtable', className)}>
      {toolbar && <div className="ui-advtable__toolbar">{toolbar}</div>}
      <Table columns={columns} rows={paged} rowKey={rowKey} empty={empty} />
      {hasPagination && (
        <div className="ui-advtable__footer">
          <span className="ui-advtable__total">共 {count} 条</span>
          <Pagination
            current={currentPage}
            total={count}
            pageSize={pageSize ?? 10}
            onChange={(p) => {
              setInnerPage(p);
              onPageChange?.(p);
            }}
          />
        </div>
      )}
    </Card>
  );
}
