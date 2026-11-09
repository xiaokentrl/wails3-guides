import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const nm = fileURLToPath(new URL('./node_modules/', import.meta.url));
// monaco worker 别名（vite 5.4 对 ?worker 裸导入不走 exports 解析，与主配置同款）
const monacoWorkers = [
  ['monaco-editor/editor/editor.worker?worker', 'monaco-editor/esm/vs/editor/editor.worker.js'],
  ['monaco-editor/language/typescript/ts.worker?worker', 'monaco-editor/esm/vs/language/typescript/ts.worker.js'],
  ['monaco-editor/language/json/json.worker?worker', 'monaco-editor/esm/vs/language/json/json.worker.js'],
  ['monaco-editor/language/html/html.worker?worker', 'monaco-editor/esm/vs/language/html/html.worker.js'],
  ['monaco-editor/language/css/css.worker?worker', 'monaco-editor/esm/vs/language/css/css.worker.js'],
].map(([find, file]) => ({ find, replacement: `${nm}${file}?worker&inline` })); // 单文件版：worker 以 base64 内联

// 单文件构建：全部 JS/CSS 内联进一个 index.html——双击即开，无需服务器。
export default defineConfig({
  base: './',
  esbuild: { jsx: 'automatic' },
  resolve: { dedupe: ['react', 'react-dom'], alias: [...monacoWorkers] },
  plugins: [viteSingleFile({ removeViteModuleLoader: true })],
  build: { assetsInlineLimit: 100000000, chunkSizeWarningLimit: 100000000 },
  server: { fs: { allow: ['..'] } },
});
