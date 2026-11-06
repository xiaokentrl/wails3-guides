import { Fragment, ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Text.css';

export interface HighlightProps {
  /** 原文（可以是任意节点内的字符串段落） */
  text: string;
  /** 搜索词：空串/纯空白则原样返回 */
  query: string;
  /** 是否区分大小写（默认不区分） */
  caseSensitive?: boolean;
  /** 命中片段的附加类名（默认用 <mark> 语义样式） */
  markClassName?: string;
  className?: string;
}

/**
 * 搜索命中高亮：把 text 按 query 的全部出现位置切段，命中段包 <mark>。
 * 返回 Fragment 数组而非 dangerouslySetInnerHTML——天然免疫 XSS（→《安全边界与权限技术方案》）。
 * 典型用法：AutoComplete/搜索结果列表里对标题做命中标注。
 */
export function Highlight({ text, query, caseSensitive = false, markClassName, className }: HighlightProps) {
  const q = query.trim();
  if (!q) return <span className={className}>{text}</span>;

  const haystack = caseSensitive ? text : text.toLowerCase();
  const needle = caseSensitive ? q : q.toLowerCase();

  const parts: Array<{ s: string; hit: boolean }> = [];
  let from = 0;
  let idx = haystack.indexOf(needle);
  while (idx !== -1) {
    if (idx > from) parts.push({ s: text.slice(from, idx), hit: false });
    parts.push({ s: text.slice(idx, idx + needle.length), hit: true });
    from = idx + needle.length;
    idx = haystack.indexOf(needle, from);
  }
  if (from < text.length) parts.push({ s: text.slice(from), hit: false });

  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.hit ? (
          <mark key={i} className={cn('ui-highlight__mark', markClassName)}>
            {p.s}
          </mark>
        ) : (
          <Fragment key={i}>{p.s}</Fragment>
        ),
      )}
    </span>
  );
}

/** 便捷包装：对任意节点不做高亮（只有字符串段落才切分），透传其余 */
export function HighlightNode({ children, query, ...rest }: Omit<HighlightProps, 'text'> & { children: ReactNode }) {
  if (typeof children !== 'string') return <>{children}</>;
  return <Highlight text={children} query={query} {...rest} />;
}
