import { ReactNode, useState, KeyboardEvent } from 'react';
import { cn } from '../lib/cn';
import { Tag } from './Tag';
import './Composite.css';

export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  /** 重复值静默去重并保留既有标签 */
  dedupe?: boolean;
  renderTag?: (tag: string) => ReactNode;
  className?: string;
}

/**
 * 标签输入：Enter / 逗号提交、Backspace 删末尾、重复去重。
 * 提交的值由调用方在领域层校验（组件只做结构化，→ 输入验证方案）。
 */
export function TagInput({ tags, onChange, placeholder = '输入后回车', dedupe = true, renderTag, className }: TagInputProps) {
  const [draft, setDraft] = useState('');

  const commit = (raw: string) => {
    const v = raw.trim();
    if (!v) return;
    if (dedupe && tags.includes(v)) return;
    onChange([...tags, v]);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit(draft);
      setDraft('');
    } else if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className={cn('ui-tag-input', className)}>
      {tags.map((t) => (
        <Tag key={t} closable onClose={() => onChange(tags.filter((x) => x !== t))}>
          {renderTag ? renderTag(t) : t}
        </Tag>
      ))}
      <input
        className="ui-tag-input__field"
        value={draft}
        placeholder={tags.length === 0 ? placeholder : ''}
        onChange={(e) => {
          const v = e.target.value;
          if (v.endsWith(',')) {
            commit(v.slice(0, -1));
            setDraft('');
          } else {
            setDraft(v);
          }
        }}
        onKeyDown={onKey}
        onBlur={() => {
          commit(draft);
          setDraft('');
        }}
        aria-label="添加标签"
      />
    </div>
  );
}
