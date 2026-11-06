import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import './EmojiPicker.css';

export interface EmojiPickerProps {
  /** 选中回调 */
  onPick: (emoji: string) => void;
  /** 受控开关（不传则自管） */
  open?: boolean;
  onClose?: () => void;
  /** 最近使用的容量（localStorage，默认 16） */
  recentCapacity?: number;
  /** 关键词搜索（匹配 emoji 的中英文关键词） */
  showSearch?: boolean;
  disabled?: boolean;
  className?: string;
}

interface EmojiDef {
  e: string;
  kw: string;
}

/** 内置词表（精简版：分类 + 中英关键词；项目期可换成完整 CLDR 数据） */
const CATEGORIES: Array<{ id: string; label: string; emojis: EmojiDef[] }> = [
  {
    id: 'smileys',
    label: '表情',
    emojis: [
      { e: '😀', kw: 'grin 笑 开心 happy' }, { e: '😂', kw: 'joy 大笑 泪 tears' },
      { e: '🤣', kw: 'rofl 笑哭' }, { e: '😊', kw: 'blush 微信 微笑 smile' },
      { e: '😍', kw: 'heart eyes 爱 love' }, { e: '🤔', kw: 'think 思考 想' },
      { e: '😎', kw: 'cool 墨镜 酷' }, { e: '😭', kw: 'sob 哭 cry' },
      { e: '😡', kw: 'angry 生气 怒' }, { e: '🥳', kw: 'party 庆祝 庆贺' },
      { e: '😴', kw: 'sleep 睡 困' }, { e: '🤯', kw: 'mind blown 爆炸 惊' },
      { e: '🥺', kw: 'pleading 求可怜' }, { e: '😱', kw: 'scream 惊恐 吓' },
      { e: '🤗', kw: 'hug 抱抱' }, { e: '🤫', kw: 'shh 嘘 安静' },
    ],
  },
  {
    id: 'gestures',
    label: '手势',
    emojis: [
      { e: '👍', kw: 'thumbs up 赞 好' }, { e: '👎', kw: 'thumbs down 踩 差' },
      { e: '👌', kw: 'ok 可以' }, { e: '✌️', kw: 'victory 耶 胜利' },
      { e: '🤝', kw: 'handshake 合作 握手' }, { e: '🙏', kw: 'pray 拜托 感谢 thanks' },
      { e: '👏', kw: 'clap 鼓掌 棒' }, { e: '💪', kw: 'muscle 加油 强' },
    ],
  },
  {
    id: 'status',
    label: '状态',
    emojis: [
      { e: '✅', kw: 'check 完成 通过 done' }, { e: '❌', kw: 'x 错误 失败 fail' },
      { e: '⚠️', kw: 'warning 警告 注意' }, { e: '🔥', kw: 'fire 火 热门' },
      { e: '⭐', kw: 'star 星 收藏' }, { e: '❓', kw: 'question 疑问 问题' },
      { e: '💡', kw: 'bulb 想法 点子 idea' }, { e: '🚀', kw: 'rocket 发布 上线 launch' },
      { e: '🐛', kw: 'bug 虫 缺陷' }, { e: '📌', kw: 'pin 置顶 钉' },
      { e: '👀', kw: 'eyes 关注 看 watch' }, { e: '💯', kw: 'hundred 满分 完美' },
    ],
  },
  {
    id: 'objects',
    label: '物品',
    emojis: [
      { e: '📎', kw: 'paperclip 附件 attach' }, { e: '📁', kw: 'folder 文件夹 目录' },
      { e: '💾', kw: 'floppy 保存 save' }, { e: '🔍', kw: 'search 搜索 查找' },
      { e: '⏰', kw: 'alarm 闹钟 提醒' }, { e: '📦', kw: 'package 包裹 打包' },
      { e: '🎮', kw: 'game 游戏 玩' }, { e: '🎵', kw: 'music 音乐 歌' },
    ],
  },
];

const RECENT_KEY = 'ui-emojipicker-recent';

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * 表情选择器（→ 弹框阶梯「中打断」：选择器面板档）。
 * 分类页签 + 关键词搜索（中英文）+ 最近使用（localStorage 容量上限）。
 * 纪律：词表内置精简版，项目期可整体替换为 CLDR 数据（结构不变）。
 * 网格按钮天然 Tab 可达；高级网格方向键导航标「待验证」。
 */
export function EmojiPicker({ onPick, open: openProp, onClose, recentCapacity = 16, showSearch = true, disabled, className }: EmojiPickerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = openProp ?? uncontrolledOpen;
  const [cat, setCat] = useState(CATEGORIES[0].id);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>(() => loadRecent());
  const rootRef = useRef<HTMLDivElement>(null);

  const setOpen = (v: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(v);
    else onClose?.();
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
    // eslint 下批补齐：setOpen 稳定性由调用方保证
  }, [open]);

  const list: EmojiDef[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return CATEGORIES.flatMap((c) => c.emojis).filter((d) => d.kw.toLowerCase().includes(q) || d.e === q);
    }
    return CATEGORIES.find((c) => c.id === cat)?.emojis ?? [];
  }, [cat, query]);

  const pick = (emoji: string) => {
    onPick(emoji);
    const next = [emoji, ...recent.filter((x) => x !== emoji)].slice(0, recentCapacity);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* 存储满/隐私模式：静默降级为会话内记忆 */
    }
  };

  return (
    <div ref={rootRef} className={cn('ui-emoji', disabled && 'ui-emoji--disabled', className)}>
      <button
        type="button"
        className="ui-emoji__trigger"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="选择表情"
        onClick={() => setOpen(!open)}
      >
        🙂
      </button>
      {open && (
        <div role="dialog" aria-label="表情选择" className="ui-emoji__panel">
          {showSearch && (
            <input
              type="text"
              className="ui-emoji__search"
              placeholder="搜索表情（如：赞 / fire）"
              aria-label="搜索表情"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          )}
          {!query && recent.length > 0 && (
            <>
              <div className="ui-emoji__cat-label">最近使用</div>
              <div className="ui-emoji__grid">
                {recent.map((e) => (
                  <button key={`r-${e}`} type="button" className="ui-emoji__cell" aria-label={`插入 ${e}`} onClick={() => pick(e)}>
                    {e}
                  </button>
                ))}
              </div>
            </>
          )}
          {!query && (
            <div role="tablist" aria-label="表情分类" className="ui-emoji__tabs">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={c.id === cat}
                  className={cn('ui-emoji__tab', c.id === cat && 'ui-emoji__tab--active')}
                  onClick={() => setCat(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
          <div className="ui-emoji__grid">
            {list.length === 0 ? (
              <div className="ui-emoji__empty">没有匹配的表情</div>
            ) : (
              list.map((d) => (
                <button key={d.e} type="button" className="ui-emoji__cell" aria-label={`插入 ${d.kw.split(' ')[0]}`} onClick={() => pick(d.e)}>
                  {d.e}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
