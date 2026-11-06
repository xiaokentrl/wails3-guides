import { cn } from '../lib/cn';
import './Heatmap.css';

export interface HeatmapDatum {
  /** 日期（YYYY-MM-DD） */
  date: string;
  count: number;
}

export interface HeatmapProps {
  /** 按日期升序的数据点（连续日期；缺日视为 0） */
  data: HeatmapDatum[];
  /** 强度分级数（0–4） */
  levels?: number;
  /** 单格提示模板（{count} 占位） */
  tooltip?: (d: HeatmapDatum) => string;
  className?: string;
}

/** 日历热图（GitHub 风格列周布局）：强度用主色不同透明度（不引入裸色，→ 令牌纪律）。 */
export function Heatmap({ data, levels = 4, tooltip, className }: HeatmapProps) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const levelOf = (count: number) => (count <= 0 ? 0 : Math.min(levels, 1 + Math.floor((count / max) * levels)));
  // 列周布局：切成 7 行的列
  const columns: (HeatmapDatum | null)[][] = [];
  let col: (HeatmapDatum | null)[] = [];
  data.forEach((d, i) => {
    col.push(d);
    if (col.length === 7) {
      columns.push(col);
      col = [];
    }
    if (i === data.length - 1 && col.length > 0) columns.push(col);
  });

  return (
    <div className={cn('ui-heatmap', className)} role="img" aria-label={`热图：${data.length} 天数据`}>
      {columns.map((week, ci) => (
        <div key={ci} className="ui-heatmap__col">
          {week.map((d, ri) => {
            if (!d) return <span key={ri} className="ui-heatmap__cell ui-heatmap__cell--empty" />;
            const lv = levelOf(d.count);
            return (
              <span
                key={d.date}
                className={cn('ui-heatmap__cell', `ui-heatmap__cell--lv${lv}`)}
                title={tooltip ? tooltip(d) : `${d.date}：${d.count}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
