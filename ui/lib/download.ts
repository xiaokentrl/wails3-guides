/**
 * 下载原语（→《验证码方案》无关；《长任务与后台工作技术方案》任务化、《系统能力与平台集成技术方案》下载矩阵）：
 * - saveBlob：Blob 落盘（ObjectURL + a[download]）；
 * - saveUrl：URL → Blob → 落盘（无进度；带进度的走 fetchWithProgress）；
 * - fetchWithProgress：流式读取 + 进度回调 + 可中止（signal，→ 任务队列取消链）。
 * URL 白名单由调用方裁决（→ 安全方案 scheme 白名单）；大文件分块 → 主大纲绑定表。
 */

export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function saveUrl(url: string, filename: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`下载失败：HTTP ${res.status}`);
  saveBlob(await res.blob(), filename);
}

export async function fetchWithProgress(
  url: string,
  onProgress: (loaded: number, total: number | null) => void,
  signal?: AbortSignal,
): Promise<Blob> {
  // signal 中止 → fetch 以 AbortError 拒绝（调用方区分取消与失败，→ 任务队列取消语义）
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`下载失败：HTTP ${res.status}`);
  const totalHeader = res.headers.get('content-length');
  const total = totalHeader ? Number(totalHeader) : null;
  if (!res.body) return await res.blob();

  const reader = res.body.getReader();
  const chunks: BlobPart[] = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      loaded += value.length;
      onProgress(loaded, total);
    }
  }
  return new Blob(chunks);
}

/* ---- CSV 导出：BOM 头保证 Excel 打开不乱码；转义双引号/换行/逗号 ---- */

function csvEscape(v: unknown): string {
  const s = String(v ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** 二维数据 → CSV Blob（表头 + 行；值经 csvEscape 转义）。落盘用 saveBlob。 */
export function toCsvBlob(headers: string[], rows: Array<Array<unknown>>): Blob {
  const lines = [headers.map(csvEscape).join(','), ...rows.map((r) => r.map(csvEscape).join(','))];
  return new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
}

/** 便捷导出：headers + rows 直接落盘为 .csv */
export function exportCsv(filename: string, headers: string[], rows: Array<Array<unknown>>): void {
  saveBlob(toCsvBlob(headers, rows), filename.endsWith('.csv') ? filename : `${filename}.csv`);
}
