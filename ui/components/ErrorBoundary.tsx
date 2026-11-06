import { Component, ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  /** 降级 UI；必须给出恢复入口（重试），不许只有一段死文案 */
  fallback: (error: Error, reset: () => void) => ReactNode;
  children: ReactNode;
  /** 上报挂接点：诊断链路 →《日志与可诊断性技术方案》（此处仅回调，不直接实现上报） */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

/** 组件级错误边界。页面级 / 应用级在此之上分层（→ 组件库方案横切：错误边界分级）。 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}
