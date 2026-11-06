import { useEffect, RefObject, useRef, useState } from 'react';
import { acquireModal, isTopModal, releaseModal } from './modalStack';

/**
 * 模态焦点陷阱（Modal / Drawer / 全屏浮层共用，→ 组件库方案弹框横切机制）：
 * - 焦点陷阱：打开聚焦首元素、Tab 循环、关闭归还触发者
 * - **弹框栈**：z-index 随栈深递增、滚动锁定引用计数（嵌套不互相解锁）、Escape 只关最上层
 * - modal=true 时参与栈管理；false（非模态浮层）不参与
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
  options?: { modal?: boolean },
): { zIndex: number | null; isTop: () => boolean } {
  const modal = options?.modal ?? true;
  const [zIndex, setZIndex] = useState<number | null>(null);
  const idRef = useRef<number | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const panel = ref.current;
    if (!panel) return;

    // 入栈：拿层级 + 滚动锁（引用计数）。嵌套真实流程为先后打开（跨 commit）→ 后开者居顶；
    // 同 commit 声明式嵌套的边界见 modalStack 头注。
    let id: number | null = null;
    if (modal) {
      const r = acquireModal();
      id = r.id;
      idRef.current = r.id;
      setZIndex(r.zIndex);
    }

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'));

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // 只关最上层：非顶层弹框不响应 Escape
        if (modal && id !== null && !isTopModal(id)) return;
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (list.length === 0) {
        e.preventDefault();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      if (id !== null) releaseModal(id);
      idRef.current = null;
      opener?.focus();
    };
  }, [open, modal, ref]);

  return { zIndex, isTop: () => idRef.current !== null && isTopModal(idRef.current) };
}
