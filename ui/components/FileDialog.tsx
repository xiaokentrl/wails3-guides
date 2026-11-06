import { ReactNode, useEffect, useMemo, useState } from 'react';
import { cn } from '../lib/cn';
import { Modal } from './Modal';
import { TextInput } from './TextInput';
import { Button } from './Button';
import { Empty } from './Data';
import { Icon } from './Icon';
import { IconButton } from './IconButton';
import { ScrollArea } from './ScrollArea';
import './FileDialog.css';

export interface FileEntry {
  /** 全路径（如 `/docs/readme.md`）——结构化 ID，来自应用虚拟文件系统（→ 安全方案） */
  path: string;
  isDir: boolean;
  size?: number;
}

export interface FileDialogProps {
  open: boolean;
  onClose: () => void;
  /** open = 选文件；folder = 选文件夹；save = 输入文件名保存 */
  mode: 'open' | 'folder' | 'save';
  entries: FileEntry[];
  onSelect: (result: { path: string; entry?: FileEntry }) => void;
  /** save 模式默认文件名 */
  defaultName?: string;
  /** open 模式扩展名过滤（如 ['.md', '.txt']，不区分大小写） */
  accept?: string[];
  title?: string;
  className?: string;
}

const parentOf = (path: string) => {
  const i = path.lastIndexOf('/');
  return i <= 0 ? '/' : path.slice(0, i);
};
const nameOf = (path: string) => path.slice(path.lastIndexOf('/') + 1);

/**
 * 应用内文件对话框（→《系统能力与平台集成技术方案》：OS 原生对话框走桥接层，
 * 本组件服务于「文件来自应用虚拟文件系统」的场景——entries 由调用方提供，
 * 组件不接触真实文件系统；路径即结构化 ID。
 */
export function FileDialog({
  open,
  onClose,
  mode,
  entries,
  onSelect,
  defaultName = '',
  accept,
  title,
  className,
}: FileDialogProps) {
  const [cwd, setCwd] = useState('/');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    if (open) {
      setCwd('/');
      setSelectedPath(null);
      setName(defaultName);
    }
  }, [open, defaultName]);

  const inCwd = (e: FileEntry) => parentOf(e.path) === cwd;
  const matchAccept = (e: FileEntry) =>
    !accept || !accept.length || accept.some((ext) => e.path.toLowerCase().endsWith(ext.toLowerCase()));

  const dirs = entries.filter((e) => e.isDir && inCwd(e));
  const files = useMemo(
    () =>
      entries.filter(
        (e) => !e.isDir && inCwd(e) && (mode === 'open' ? matchAccept(e) : true),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entries, cwd, mode, accept],
  );

  const crumbs = cwd === '/' ? [] : cwd.slice(1).split('/');
  const canConfirm =
    mode === 'save' ? name.trim() !== '' && !name.includes('/') : mode === 'folder' ? true : !!selectedPath;

  const confirm = () => {
    if (mode === 'save') {
      const path = `${cwd === '/' ? '' : cwd}/${name.trim()}`;
      onSelect({ path });
    } else if (mode === 'folder') {
      const dir = selectedPath ? entries.find((e) => e.path === selectedPath && e.isDir) : null;
      const target = dir ? dir.path : cwd;
      onSelect({ path: target, entry: dir ?? undefined });
    } else {
      const entry = entries.find((e) => e.path === selectedPath && !e.isDir);
      if (!entry) return;
      onSelect({ path: entry.path, entry });
    }
    onClose();
  };

  const segLabel = mode === 'save' ? '保存' : mode === 'folder' ? '选择此文件夹' : '打开';

  return (
    <Modal open={open} onClose={onClose} title={title ?? (mode === 'save' ? '保存文件' : mode === 'folder' ? '选择文件夹' : '打开文件')} className={className}>
      {/* 路径面包屑 + 上级 */}
      <div className="ui-filedialog__nav">
        <IconButton label="上一级" onClick={() => setCwd(parentOf(cwd))} disabled={cwd === '/'}>
          <Icon name="arrow-up" size={14} />
        </IconButton>
        <button type="button" className="ui-filedialog__crumb" onClick={() => setCwd('/')}>
          根目录
        </button>
        {crumbs.map((c, i) => (
          <span key={i} className="ui-filedialog__crumb-wrap">
            <span aria-hidden="true">/</span>
            <button type="button" className="ui-filedialog__crumb" onClick={() => setCwd('/' + crumbs.slice(0, i + 1).join('/'))}>
              {c}
            </button>
          </span>
        ))}
      </div>

      <ScrollArea maxHeight={260} className="ui-filedialog__list-wrap">
        {dirs.length === 0 && files.length === 0 ? (
          <Empty variant="no-data" description="此文件夹为空" />
        ) : (
          <ul className="ui-filedialog__list">
            {dirs.map((d) => (
              <li key={d.path}>
                <button
                  type="button"
                  className="ui-filedialog__row ui-filedialog__row--dir"
                  onClick={() => setCwd(d.path)}
                >
                  <Icon name="folder" size={16} className="ui-filedialog__icon" />
                  <span className="ui-filedialog__name">{nameOf(d.path)}</span>
                </button>
              </li>
            ))}
            {mode !== 'folder' &&
              files.map((f) => (
                <li key={f.path}>
                  <button
                    type="button"
                    className={cn('ui-filedialog__row', selectedPath === f.path && 'ui-filedialog__row--selected')}
                    onClick={() => setSelectedPath(f.path)}
                    onDoubleClick={confirm}
                  >
                    <Icon name="file" size={16} className="ui-filedialog__icon" />
                    <span className="ui-filedialog__name">{nameOf(f.path)}</span>
                    {f.size !== undefined && <span className="ui-filedialog__size">{f.size} B</span>}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </ScrollArea>

      {mode === 'save' && (
        <TextInput
          label="文件名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={name.includes('/') ? '文件名不能包含 /' : undefined}
        />
      )}

      <div className="ui-filedialog__actions">
        {mode === 'folder' && <span className="ui-filedialog__hint">将选择当前文件夹：{cwd}</span>}
        <Button variant="ghost" onClick={onClose}>
          取消
        </Button>
        <Button variant="primary" disabled={!canConfirm} onClick={confirm}>
          {segLabel}
        </Button>
      </div>
    </Modal>
  );
}

/** 面包屑包装（供 Modal title 之外的辅助节点使用） */
export function FileDialogNav({ children }: { children: ReactNode }) {
  return <div className="ui-filedialog__nav">{children}</div>;
}
