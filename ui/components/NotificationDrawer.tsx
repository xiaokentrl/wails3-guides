import { Badge } from './Badge';
import { Drawer } from './Drawer';
import { Empty } from './Data';

export interface NotificationItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  read?: boolean;
}

export interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
  items: NotificationItem[];
  /** 点击单条：标记已读 + 跳转由调用方实现 */
  onItemClick?: (item: NotificationItem) => void;
  onMarkAllRead?: () => void;
}

/** 通知中心（Drawer 组合，→ 弹框家族「中打断」档）：未读计数在标题、点击单条标记已读、全部已读一键。 */
export function NotificationDrawer({ open, onClose, items, onItemClick, onMarkAllRead }: NotificationDrawerProps) {
  const unread = items.filter((n) => !n.read).length;
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={unread > 0 ? `通知（${unread} 条未读）` : '通知'}
      footer={
        onMarkAllRead && unread > 0 ? (
          <button type="button" className="ui-ndrawer__mark" onClick={onMarkAllRead}>
            全部标记已读
          </button>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <Empty variant="no-data" description="暂无通知" />
      ) : (
        <ul className="ui-ndrawer__list">
          {items.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                className="ui-ndrawer__item"
                onClick={() => onItemClick?.(n)}
                aria-label={n.read ? n.title : `${n.title}（未读）`}
              >
                <span className="ui-ndrawer__head">
                  <span className="ui-ndrawer__title">{n.title}</span>
                  {!n.read && <Badge tone="primary">未读</Badge>}
                </span>
                {n.description && <span className="ui-ndrawer__desc">{n.description}</span>}
                {n.time && <span className="ui-ndrawer__time">{n.time}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
