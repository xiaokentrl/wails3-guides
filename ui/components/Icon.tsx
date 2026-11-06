import { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './Icon.css';

/**
 * 图标体系（→《多平台一致组件库方案》：单一来源单色线性、tint 走 currentColor）。
 * 内置注册表覆盖首批通用图标；项目专属图标用 registerIcon 扩展，不散落 SVG。
 * 全部 aria-hidden：图标不承载唯一信息（→ 无障碍第二通道）。
 */
const registry: Record<string, ReactNode> = {
  check: <path d="M20 6L9 17l-5-5" />,
  close: (
    <>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  'chevron-right': <path d="M9 18l6-6-6-6" />,
  'chevron-left': <path d="M15 18l-6-6 6-6" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  star: <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />,
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4M16 2v4M3 9h18" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.2 2.2M16.9 17l2.2 2.2M19.1 4.9l-2.2 2.2M7.1 16.9l-2.2 2.2" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  file: (
    <>
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M13 2v7h7" />
    </>
  ),
  'arrow-up': <path d="M12 19V5M5 12l7-7 7 7" />,
};

/** 项目专属图标注册（同名覆盖视为错误，控制台警告）。 */
export function registerIcon(name: string, node: ReactNode) {
  if (registry[name]) {
    console.warn(`[ui/Icon] 图标「${name}」已存在，拒绝覆盖`);
    return;
  }
  registry[name] = node;
}

export interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 16, className }: IconProps) {
  const node = registry[name] ?? registry['plus']; // 缺省占位（注册表 miss 可见，不静默空白）
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('ui-icon', className)}
    >
      {node}
    </svg>
  );
}
