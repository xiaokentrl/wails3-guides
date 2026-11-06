import { ReactNode, useState } from 'react';
import { Button } from '../../components/Button.tsx';
import { ErrorBoundary } from '../../components/ErrorBoundary.tsx';
import { Alert, Result } from '../../components/Feedback.tsx';
import { GlobalProgressBar } from '../../components/GlobalProgressBar.tsx';
import { Stack } from '../../components/Layout.tsx';
import { Modal } from '../../components/Modal.tsx';
import { NotificationDrawer } from '../../components/NotificationDrawer.tsx';
import { NotificationRouter, useNotifications } from '../../components/NotificationRouter.tsx';
import { Text, Title } from '../../components/Text.tsx';
import { ToastProvider, useToast } from '../../components/Toast.tsx';

/* 反馈组件实时演示（→ 规划表「六、反馈」）。通知路由由 Playground 外壳提供。 */

export function DemoAlert() {
  return (
    <Stack direction="vertical" gap={2}>
      <Alert tone="info">信息提示：普通说明性内容。</Alert>
      <Alert tone="success" title="操作成功">配置已生效。</Alert>
      <Alert tone="warning" title="配额将满">当前用量已达 90%，建议清理历史数据。</Alert>
      <Alert tone="danger" title="校验失败">签名校验未通过——查看日志后重试。</Alert>
    </Stack>
  );
}

export function DemoResult() {
  const [showError, setShowError] = useState(false);
  return (
    <div>
      <Result status="success" title="已发布" description="版本 v1.0.0 已上线" />
      {showError ? (
        <Result
          status="error"
          title="发布失败"
          description="签名校验未通过——查看日志后重试。"
          extra={
            <>
              <Button variant="primary" onClick={() => setShowError(false)}>
                重试
              </Button>
              <Button variant="ghost" onClick={() => setShowError(false)}>
                返回
              </Button>
            </>
          }
        />
      ) : (
        <Button size="sm" onClick={() => setShowError(true)}>
          看看失败终态的样子
        </Button>
      )}
    </div>
  );
}

export function DemoModal() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>打开模态</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="确认操作"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              确认删除
            </Button>
          </>
        }
      >
        焦点陷阱、Escape、关闭后焦点归还——试试 Tab 循环与 Escape。
      </Modal>
    </div>
  );
}

export function DemoErrorBoundary() {
  const [boom, setBoom] = useState(false);
  return (
    <div>
      <ErrorBoundary
        fallback={(error, reset) => (
          <Alert tone="danger" title={`组件崩溃：${error.message}`}>
            <Button size="sm" onClick={reset}>
              重置
            </Button>
          </Alert>
        )}
        onError={(err) => console.warn('[演示] 组件级错误上报挂接点', err)}
      >
        {boom ? <Boom /> : <Button onClick={() => setBoom(true)}>触发组件内崩溃</Button>}
      </ErrorBoundary>
    </div>
  );
}

function Boom(): ReactNode {
  throw new Error('演示用崩溃');
}

export function DemoGlobalProgress() {
  const [progress, setProgress] = useState<number | null | undefined>(null);
  return (
    <div>
      {progress !== null && <GlobalProgressBar value={progress} />}
      <Stack direction="horizontal" gap={2}>
        <Button
          size="sm"
          onClick={() => {
            let p = 0;
            setProgress(0);
            const t = setInterval(() => {
              p += 10;
              setProgress(p);
              if (p >= 100) {
                clearInterval(t);
                setTimeout(() => setProgress(null), 600);
              }
            }, 300);
          }}
        >
          定值进度
        </Button>
        <Button size="sm" onClick={() => setProgress(undefined)}>
          不定态进度
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setProgress(null)}>
          隐藏
        </Button>
      </Stack>
    </div>
  );
}

function RouterSandbox({ visible }: { visible: boolean }) {
  const { notify, routeNotificationClick } = useNotifications();
  return (
    <div>
      <Stack direction="horizontal" gap={2}>
        <Button size="sm" onClick={() => notify({ title: '导出完成', body: 'report.pdf', tag: 'export-1', onClick: () => console.log('跳转到导出页') })}>
          通知（按可见性路由）
        </Button>
        <Button size="sm" onClick={() => notify({ title: '重要提醒', forceChannel: 'system' })}>
          强制系统通道
        </Button>
        <Button size="sm" onClick={() => notify({ title: '站内提示', forceChannel: 'toast' })}>
          强制 Toast
        </Button>
        <Button size="sm" variant="ghost" onClick={() => routeNotificationClick('export-1')}>
          模拟点击系统通知
        </Button>
      </Stack>
      <Text type="secondary">
        沙箱窗口状态：{visible ? '可见 → Toast' : '隐藏 → 系统通知（演示桥接恒为 sent；真实环境点击唤回由桥接调 routeNotificationClick）'}
      </Text>
    </div>
  );
}

export function DemoNotificationRouter() {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Stack direction="horizontal" gap={2} align="center">
        <Button size="sm" variant={visible ? 'primary' : 'secondary'} onClick={() => setVisible(true)}>
          窗口设为可见
        </Button>
        <Button size="sm" variant={!visible ? 'primary' : 'secondary'} onClick={() => setVisible(false)}>
          窗口设为隐藏
        </Button>
      </Stack>
      {/* 沙箱：嵌套独立 Router，演示环境桥接恒为 sent */}
      <NotificationRouter
        isWindowActive={() => visible}
        showSystemNotification={async () => 'sent'}
        focusWindow={() => console.log('[演示] 聚焦窗口')}
      >
        <RouterSandbox visible={visible} />
      </NotificationRouter>
    </div>
  );
}

export function DemoNotificationDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { id: '1', title: '构建完成', description: 'v1.0.0 已打包', time: '10:24', read: false },
    { id: '2', title: '新评论', description: '甲 评论了组件导航', time: '09:10', read: false },
    { id: '3', title: '同步完成', description: '3 个文件已同步', time: '昨天', read: true },
  ]);
  const unread = items.filter((n) => !n.read).length;
  return (
    <div>
      <Button onClick={() => setOpen(true)}>打开通知中心（{unread} 条未读）</Button>
      <NotificationDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        onItemClick={(n) => setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
        onMarkAllRead={() => setItems((prev) => prev.map((x) => ({ ...x, read: true })))}
      />
    </div>
  );
}

function ToastDemoInner() {
  const toast = useToast();
  return (
    <Stack direction="horizontal" gap={2}>
      <Button size="sm" onClick={() => toast.toast({ kind: 'success', message: '已导出到磁盘' })}>
        成功（结果不在眼前才用 Toast）
      </Button>
      <Button size="sm" onClick={() => toast.toast({ kind: 'error', message: '导出失败——磁盘已满。清理后重试' })}>
        失败三件套
      </Button>
    </Stack>
  );
}

export function DemoToast() {
  return (
    <div>
      <ToastProvider>
        <ToastDemoInner />
      </ToastProvider>
    </div>
  );
}

export function DemoFeedbackOverview() {
  return (
    <div>
      <Title level={2}>反馈</Title>
      <Text type="secondary">左侧选择具体组件查看实时演示。</Text>
    </div>
  );
}
