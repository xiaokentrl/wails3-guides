import { useLayoutEffect, useState } from 'react';

/**
 * 弹框家族共享的专属 portal 容器（→ Modal/Drawer/Lightbox/CommandPalette/Tour）。
 * 每个 portal 实例一个独立 div，不与其他 portal 共享 document.body——
 * 规避多 portal 卸载竞争导致的 removeChild 冲突。
 * 纪律：容器身份在首次挂载确定（useState 初始化器**不做 DOM 副作用**），
 * 挂载/卸载统一走 layout effect——卸载时 React 已先清空 portal 内容，
 * 再移除空容器，顺序天然安全。
 */
export function usePortalContainer(name: string): HTMLDivElement | null {
  const [container] = useState<HTMLDivElement | null>(() => {
    if (typeof document === 'undefined') return null;
    const div = document.createElement('div');
    div.dataset.uiPortal = name;
    return div;
  });

  useLayoutEffect(() => {
    if (!container) return;
    document.body.appendChild(container);
    return () => { container.remove(); };
  }, [container]);

  return container;
}
