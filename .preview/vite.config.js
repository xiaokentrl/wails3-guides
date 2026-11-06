import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// ui/ 经符号链接共享本目录 node_modules。为杜绝双 React 实例
// （/@fs 服务 ui 文件时拿到原始 CJS react，hooks dispatcher 为 null），
// 把 react/react-dom 及其运行时入口全部别名到**预打包的 ESM deps**。
const nm = fileURLToPath(new URL('./node_modules/', import.meta.url));

// Monaco worker：vite 5.4 对带 ?worker 后缀的裸导入不走 exports 解析
// （monaco 0.57 exports 为 "./*" → "./esm/vs/*.js"）——精确别名指到物理文件。
// 消费方项目若同版本组合复现，同样补这组别名（已写入组件卡）。
const monacoWorkers = [
  ['monaco-editor/editor/editor.worker?worker', 'monaco-editor/esm/vs/editor/editor.worker.js'],
  ['monaco-editor/language/typescript/ts.worker?worker', 'monaco-editor/esm/vs/language/typescript/ts.worker.js'],
  ['monaco-editor/language/json/json.worker?worker', 'monaco-editor/esm/vs/language/json/json.worker.js'],
  ['monaco-editor/language/html/html.worker?worker', 'monaco-editor/esm/vs/language/html/html.worker.js'],
  ['monaco-editor/language/css/css.worker?worker', 'monaco-editor/esm/vs/language/css/css.worker.js'],
].map(([find, file]) => ({ find, replacement: `${nm}${file}?worker` }));

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [...monacoWorkers],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['monaco-editor'], // worker 以物理文件 ?worker 引入，不入预打包
  },
  server: { port: 5183, host: '127.0.0.1', fs: { allow: ['..'] } },
});
