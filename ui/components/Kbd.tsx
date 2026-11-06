import { cn } from '../lib/cn';
import './Kbd.css';

/** 键位标签。修饰键应使用 Mod 令牌在调用方渲染（→ 快捷键方案）。 */
export function Kbd({ children, className }: { children: string; className?: string }) {
  return <kbd className={cn('ui-kbd', className)}>{children}</kbd>;
}

/** 视觉隐藏但读屏可达（→ 无障碍方案）。 */
export function VisuallyHidden({ children, className }: { children: string; className?: string }) {
  return <span className={cn('ui-visually-hidden', className)}>{children}</span>;
}
