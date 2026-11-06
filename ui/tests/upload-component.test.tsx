/**
 * 上传进度与取消测试（→《任务队列方案》取消链、《防抖与节流方案》进度节流的组件级验证）。
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Upload } from '../components/Upload';

function fireFiles(files: File[]) {
  const input = document.querySelector('input[type=file]') as HTMLInputElement;
  Object.defineProperty(input, 'files', { value: files, configurable: true });
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('Upload 进度与取消', () => {
  it('进度回调驱动逐文件百分比显示', async () => {
    let finish = () => {};
    const upload = vi.fn((_f: File, ctx: { onProgress: (l: number, t: number) => void }) => {
      ctx.onProgress(40, 100);
      return new Promise<void>((r) => { finish = r; }); // 门闩：保持 uploading，避免慢环境竞态
    });
    render(<Upload upload={upload} />);
    fireFiles([new File(['x'.repeat(100)], 'a.txt')]);
    await waitFor(() => expect(screen.getByText('40%')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: '取消上传 a.txt' })).toBeInTheDocument();
    finish();
  });

  it('取消 → AbortError → 标记已取消', async () => {
    const upload = vi.fn((_f: File, ctx: { signal: AbortSignal }) => {
      return new Promise<void>((_r, reject) => {
        ctx.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
      });
    });
    render(<Upload upload={upload} />);
    fireFiles([new File(['x'], 'a.txt')]);
    await waitFor(() => expect(screen.getByRole('button', { name: '取消上传 a.txt' })).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: '取消上传 a.txt' }));
    await waitFor(() => expect(screen.getByText('已取消')).toBeInTheDocument());
    expect(screen.queryByText('完成')).not.toBeInTheDocument();
  });

  it('失败带原因并提供重试入口', async () => {
    const upload = vi.fn(async () => {
      throw new Error('磁盘已满');
    });
    render(<Upload upload={upload} />);
    fireFiles([new File(['x'], 'a.txt')]);
    await waitFor(() => expect(screen.getByText('失败')).toBeInTheDocument());
    expect(screen.getByText('磁盘已满')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '重试' })).toBeInTheDocument();
  });
});
