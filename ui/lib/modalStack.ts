/**
 * 弹框栈管理器（→《组件库全景》弹框横切机制）：
 * - z-index 自动递增（后开者层级更高、容器追加更晚——双保险居上）
 * - 滚动锁定引用计数（嵌套内层关闭不解锁外层）
 * - Escape 路由（isTopModal：只关最上层）
 * - **已知边界**：同一 commit 同时挂载的嵌套弹框（声明式双 open），effect 子先父后
 *   会使外层后入栈而成为顶层——真实流程是先后打开（跨 commit），不受影响；
 *   声明式同帧嵌套请改为条件渲染内层。
 */

interface StackEntry {
  id: number;
}

const stack: StackEntry[] = [];
let nextId = 1;
let lockCount = 0;

export function acquireModal(): { id: number; zIndex: number } {
  const id = nextId++;
  stack.push({ id });
  lockCount += 1;
  if (lockCount === 1) {
    document.body.style.overflow = 'hidden';
  }
  return { id, zIndex: stack.length };
}

export function releaseModal(id: number) {
  const i = stack.findIndex((e) => e.id === id);
  if (i >= 0) stack.splice(i, 1);
  lockCount -= 1;
  if (lockCount <= 0) {
    lockCount = 0;
    document.body.style.overflow = '';
  }
}

export function isTopModal(id: number): boolean {
  return stack.length > 0 && stack[stack.length - 1].id === id;
}
