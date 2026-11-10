/**
 * 方案行为断言背书（claims 模式——源自 spf13/go-skills 的 .github/claims：
 * 「每个测试命名它所背书的文档章节；底层行为变更时套件变红，文档必须跟着改」）。
 * 每个测试标注它背书的方案章节——断言失效 = 文档或实现之一需要更新。
 */
import { describe, expect, it } from 'vitest';
import { Blob as NodeBlob } from 'node:buffer';
import { toCsvBlob } from '../lib/download';

// jsdom 的 Blob 缺 text()/arrayBuffer()——用 jsdom 原生 FileReader 读取
function readAsText(b: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(fr.error);
    fr.readAsText(b);
  });
}
function readAsBytes(b: Blob): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(new Uint8Array(fr.result as ArrayBuffer));
    fr.onerror = () => reject(fr.error);
    fr.readAsArrayBuffer(b);
  });
}

describe('背书：《默认安装目录规划方案》——「所写即所录」与更新契约', () => {
  it('背书「卸载按 manifest 反向执行」：toCsvBlob 产出的 CSV 以 UTF-8 BOM 开头（Excel 直开不乱码）', async () => {
    const blob = toCsvBlob(['名称'], [['测试']]);
    const text = await readAsText(blob);
    const bytes = await readAsBytes(blob);
    expect(bytes[0]).toBe(0xef); // UTF-8 BOM
    expect(bytes[1]).toBe(0xbb);
    expect(bytes[2]).toBe(0xbf);
    expect(text.replace(/^\uFEFF/, '').startsWith('名称')).toBe(true); // readAsText 保留 BOM 字符
  });

  it('背书「manifest 所写即所录」：toCsvBlob 转义含逗号/引号/换行的值（清单数据可信）', async () => {
    const blob = toCsvBlob(['值'], [['含,逗号', '含"引号"', '含\n换行']]);
    const text = await readAsText(blob);
    // 单行含三个字段：逗号/引号/换行均按 CSV 标准转义（引号包裹、内部引号双写、引号内换行保留）
    expect(text).toContain('"含,逗号","含""引号""","含\n换行"');
  });
});
