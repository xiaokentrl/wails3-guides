import { defineConfig } from 'vitest/config';

// ui/ 测试套件运行配置（jsdom + jest-dom 匹配器注入）。
// 测试文件在 ui/tests，从 .preview 运行；CSS 导入由 vitest 默认置空处理。
export default defineConfig({
  test: {
    globals: true, // RTL 自动清理依赖全局 afterEach；format.test 用全局 expect
    environment: 'jsdom',
    include: ['../ui/tests/**/*.test.ts', '../ui/tests/**/*.test.tsx'],
    setupFiles: ['./vitest.setup.ts'],
  },
  esbuild: { jsx: 'automatic' },
  resolve: { dedupe: ['react', 'react-dom'] },
  server: { fs: { allow: ['..'] } }, // 测试文件在宿主根之外（guides/ui）——与 dev server 同款放行
});
