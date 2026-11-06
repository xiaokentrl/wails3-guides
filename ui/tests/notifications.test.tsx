/**
 * 通知路由测试（→《验证码方案》无关；《操作反馈方案》层级路由 +《系统能力与平台集成技术方案》降级链的组件级验证）。
 * 覆盖：窗口可见 → Toast；不可见 → 系统通知；权限拒绝/桥接失败 → Toast 降级；点击路由 → 唤回+跳转。
 */
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationRouter, useNotifications } from '../components/NotificationRouter';

function setup(opts: {
  isWindowActive?: () => boolean;
  showSystemNotification?: ReturnType<typeof vi.fn>;
  requestPermission?: ReturnType<typeof vi.fn>;
  focusWindow?: ReturnType<typeof vi.fn>;
}) {
  const isWindowActive = opts.isWindowActive ?? (() => false);
  const showSystemNotification = opts.showSystemNotification ?? vi.fn(async () => 'sent' as const);
  const focusWindow = opts.focusWindow ?? vi.fn();
  const onClick = vi.fn();

  function Bridge() {
    const { notify, routeNotificationClick: route } = useNotifications();
    // 桥接层模拟：保存 route 供测试手动触发系统通知点击
    (globalThis as Record<string, unknown>).__route = route;
    return (
      <button type="button" onClick={() => notify({ title: '导出完成', body: 'report.pdf', tag: 'export-1', onClick })}>
        触发通知
      </button>
    );
  }

  render(
    <NotificationRouter
      isWindowActive={isWindowActive}
      showSystemNotification={showSystemNotification}
      focusWindow={focusWindow}
      requestPermission={opts.requestPermission}
    >
      <Bridge />
    </NotificationRouter>,
  );
  return { showSystemNotification, focusWindow, onClick, route: () => (globalThis as any).__route as (k: string) => void };
}

describe('NotificationRouter', () => {
  it('窗口可见 → Toast（不走系统通知）', async () => {
    const show = vi.fn(async () => 'sent' as const);
    setup({ isWindowActive: () => true, showSystemNotification: show });
    await userEvent.click(screen.getByRole('button', { name: '触发通知' }));
    expect(screen.getByRole('status')).toHaveTextContent('导出完成——report.pdf');
    expect(show).not.toHaveBeenCalled();
  });

  it('窗口不可见 → 系统通知（带 tag）', async () => {
    const show = vi.fn(async () => 'sent' as const);
    const { route, focusWindow, onClick } = setup({ isWindowActive: () => false, showSystemNotification: show });
    await userEvent.click(screen.getByRole('button', { name: '触发通知' }));
    await waitFor(() => expect(show).toHaveBeenCalledWith({ title: '导出完成', body: 'report.pdf', tag: 'export-1' }));
    // 平台点击回调 → 聚焦窗口 + 调用方跳转
    route()('export-1'); // route 是取值函数：先取 __route 再传 key
    expect(focusWindow).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('权限拒绝 → Toast 降级', async () => {
    const show = vi.fn(async () => 'sent' as const);
    const requestPermission = vi.fn(async () => 'denied' as const);
    setup({ isWindowActive: () => false, showSystemNotification: show, requestPermission });
    await userEvent.click(screen.getByRole('button', { name: '触发通知' }));
    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument()); // 降级为 Toast
    expect(show).not.toHaveBeenCalled();
  });

  it('桥接不可用 → Toast 降级', async () => {
    const show = vi.fn(async () => 'unavailable' as const);
    setup({ isWindowActive: () => false, showSystemNotification: show });
    await userEvent.click(screen.getByRole('button', { name: '触发通知' }));
    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument());
  });
});
