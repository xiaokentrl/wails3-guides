import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePortalContainer } from '../lib/portal';
import './Tour.css';

export interface TourStep {
  /** 目标元素 CSS 选择器；不传则居中呈现 */
  target?: string;
  title: string;
  description?: ReactNode;
}

export interface TourProps {
  steps: TourStep[];
  open: boolean;
  onClose: () => void;
}

/** 序列引导（→ 弹框家族「中打断」档）：定位到目标元素、Next/Prev/Skip、Escape 跳过。目标缺失时居中兜底。 */
export function Tour({ steps, open, onClose }: TourProps) {
  const [i, setI] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const container = usePortalContainer('tour');

  useEffect(() => {
    if (open) setI(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || steps.length === 0 || !container) return null;
  const step = steps[Math.min(i, steps.length - 1)];
  const el = step.target ? document.querySelector<HTMLElement>(step.target) : null;
  const rect = el?.getBoundingClientRect();

  // 卡片定位：目标元素下方优先，放不下放上方；无目标则居中
  let style: CSSProperties = { position: 'fixed', left: '50%', top: '40%', transform: 'translate(-50%, -50%)' };
  if (rect) {
    const below = rect.bottom + 12;
    const putBelow = below + 180 < window.innerHeight;
    style = {
      position: 'fixed',
      left: Math.max(12, Math.min(rect.left, window.innerWidth - 340)),
      top: putBelow ? below : undefined,
      bottom: putBelow ? undefined : window.innerHeight - rect.top + 12,
      transform: 'none',
    };
  }

  // 高亮框：跟随目标矩形（无目标不画）
  const highlight: CSSProperties | null = rect
    ? {
        position: 'fixed',
        left: rect.left - 6,
        top: rect.top - 6,
        width: rect.width + 12,
        height: rect.height + 12,
      }
    : null;

  return createPortal(
    <div className="ui-tour__overlay" role="dialog" aria-label={`引导 ${i + 1} / ${steps.length}`}>
      {highlight && <div className="ui-tour__highlight" style={highlight} aria-hidden="true" />}
      <div ref={cardRef} className="ui-tour__card" style={style}>
        <div className="ui-tour__step">
          {i + 1} / {steps.length}
        </div>
        <h3 className="ui-tour__title">{step.title}</h3>
        {step.description && <div className="ui-tour__desc">{step.description}</div>}
        <div className="ui-tour__actions">
          <button type="button" className="ui-tour__skip" onClick={onClose}>
            跳过
          </button>
          {i > 0 && (
            <button type="button" className="ui-tour__btn" onClick={() => setI(i - 1)}>
              上一步
            </button>
          )}
          {i < steps.length - 1 ? (
            <button type="button" className="ui-tour__btn ui-tour__btn--primary" onClick={() => setI(i + 1)}>
              下一步
            </button>
          ) : (
            <button type="button" className="ui-tour__btn ui-tour__btn--primary" onClick={onClose}>
              完成
            </button>
          )}
        </div>
      </div>
    </div>,
    container,
  );
}
