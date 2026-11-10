/**
 * 组件库收尾自查（固化版）——node scripts/check.mjs
 * 五项检查（对应历史上真实踩过的坑，非纸面清单）：
 *   1. index.ts 重复导出（多批次追加曾致 28 个重复）
 *   2. KeyboardEvent 等遮蔽：从 react 导入 DOM 同名类型且挂 document 监听、
 *      又未见 globalThis. 前缀（Cascader/Popselect 曾两次踩雷，removeChild 症状伪装）
 *   3. playground demo：JSX 标签/组件调用 vs import 对照（曾 96 处错级导入）
 *   4. CSS 裸色值（hex/rgb）：组件样式只允许 var(--ui-*)（暗色适配高危）
 *   5. registry 演示 id 重复
 * 退出码非 0 = 有 error 级问题。
 */
import { readFileSync, readdirSync, statSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = dirname(root); // guides/（专题指南在 ui 之外）
const esbuildBin = join(repoRoot, '.preview', 'node_modules', '.bin', 'esbuild');
let errors = 0;
let warnings = 0;
const fail = (msg) => { console.error('  ✗ ' + msg); errors++; };
const warn = (msg) => { console.warn('  ⚠ ' + msg); warnings++; };
const ok = (msg) => console.log('  ✓ ' + msg);

const read = (p) => readFileSync(join(root, p), 'utf8');
const walk = (dir, exts, out = []) => {
  for (const name of readdirSync(join(root, dir))) {
    const p = join(dir, name);
    if (statSync(join(root, p)).isDirectory()) walk(p, exts, out);
    else if (exts.some((e) => name.endsWith(e))) out.push(p);
  }
  return out;
};

/* 1. index.ts 重复导出 */
console.log('\n[1] index.ts 重复导出');
{
  const src = read('index.ts');
  const seen = new Map();
  let dup = 0;
  for (const m of src.matchAll(/export\s+\{([^}]+)\}/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop().trim();
      if (!name || name.startsWith('type ')) continue;
      if (seen.has(name)) { fail(`重复导出：${name}（第 ${seen.get(name)} 处之后再次出现）`); dup++; }
      else seen.set(name, m.index);
    }
  }
  if (!dup) ok(`共 ${seen.size} 个导出名，无重复`);
}

/* 2. KeyboardEvent 等遮蔽 */
console.log('\n[2] DOM 类型遮蔽（react 导入 × document 监听）');
{
  const files = [...walk('components', ['.tsx', '.ts']), ...walk('lib', ['.ts']), ...walk('business', ['.tsx'])];
  const domNames = ['KeyboardEvent', 'MouseEvent', 'WheelEvent', 'FocusEvent', 'ClipboardEvent', 'DragEvent', 'UIEvent'];
  let flagged = 0;
  for (const f of files) {
    const src = read(f);
    const imported = new Set();
    for (const m of src.matchAll(/import\s*(?:type\s*)?\{([^}]+)\}\s*from\s*'react'/g)) {
      for (const part of m[1].split(',')) {
        const name = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
        if (domNames.includes(name)) imported.add(name);
      }
    }
    if (!imported.has('KeyboardEvent')) continue;
    if (!/document\.addEventListener\('keydown'/.test(src)) continue; // mousedown 监听与 KeyboardEvent 无关
    if (/globalThis\.KeyboardEvent/.test(src)) continue;
    fail(`${f}：document keydown 监听 × react 导入的 KeyboardEvent 遮蔽（document 侧须用 globalThis.KeyboardEvent，范本 Tree.tsx）`);
    flagged++;
  }
  if (!flagged) ok('全部通过');
}

/* 3. demo 导入对照 */
console.log('\n[3] playground demo 导入对照');
{
  const demos = walk('playground/demos', ['.tsx']);
  const known = new Set();
  // 收集库内全部导出组件名（从 index.ts + 各组件文件的 export function/const）
  for (const f of [...walk('components', ['.tsx']), ...walk('business', ['.tsx']), ...walk('integrations', ['.tsx'])]) {
    const src = read(f);
    for (const m of src.matchAll(/export (?:function|const) ([A-Z]\w+)/g)) known.add(m[1]);
  }
  let bad = 0;
  for (const f of demos) {
    const src = read(f);
    const imported = new Set();
    for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*'[^']+'/g)) {
      for (const part of m[1].split(',')) {
        const name = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0].trim();
        if (name) imported.add(name);
      }
    }
    for (const d of src.matchAll(/import\s+(\w+)\s+from\s*'[^']+'/g)) imported.add(d[1]);
    for (const m of src.matchAll(/(?:function|const)\s+([A-Z]\w*)\s*[=(]/g)) imported.add(m[1]);
    const used = new Set();
    for (const m of src.matchAll(/(?<=[\s(>])<([A-Z]\w*)[\s/>]/g)) used.add(m[1]);
    for (const m of src.matchAll(/\b(use[A-Z]\w*)\s*\(/g)) used.add(m[1]);
    for (const u of used) {
      if (!imported.has(u) && u !== 'Fragment') { fail(`${f}：使用了未导入的 <${u}>`); bad++; }
    }
    // 库内组件标签拼错（非小写 html、非 demo 本地定义、非已知导出）
    for (const u of used) {
      if (known.has(u) || imported.has(u)) continue;
      if (u.length > 2 && /^[A-Z]/.test(u) && !/^(Fragment|SVG|Webkit)/.test(u)) {
        warn(`${f}：<${u}> 非库内已知导出（确认是否本地组件/拼写错误）`);
      }
    }
  }
  if (!bad) ok(`对照 ${demos.length} 个 demo，无未导入引用`);
}

/* 4. CSS 裸色值 */
console.log('\n[4] CSS 裸色值（组件样式只允许 var(--ui-*)）');
{
  const cssFiles = walk('components', ['.css']);
  const colorRe = /(?<!var\()#[0-9a-fA-F]{3,8}\b|rgba?\(/g;
  let bad = 0;
  for (const f of cssFiles) {
    const src = read(f);
    const lines = src.split('\n');
    lines.forEach((line, i) => {
      if (/^\s*(\/\*|\*|\/\/)/.test(line)) return; // 注释跳过
      const stripped = line.replace(/var\([^)]*\)/g, 'VAR');
      for (const m of stripped.matchAll(colorRe)) {
        if (!/--/.test(line.split(':')[0] ?? '')) {
          fail(`${f}:${i + 1} 裸色值 ${m[0]}（改用 var(--ui-*)，回退值放 var 内）`);
          bad++;
        }
      }
    });
  }
  if (!bad) ok('无裸色值');
}

/* 5. registry 演示 id 重复 */
console.log('\n[5] registry 演示 id 重复');
{
  const src = read('playground/registry.tsx');
  const ids = [...src.matchAll(/\{\s*id:\s*'([^']+)'/g)].map((m) => m[1]);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) fail(`重复 id：${[...new Set(dup)].join(', ')}`);
  else ok(`共 ${ids.length} 个演示 id，无重复`);
}

/* 6. 指南代码块可解析（go/ts/tsx——借鉴 spf13/go-skills check_skill_code.py：
   文档里的代码必须能过编译器/解析器，伪代码行（仅 … 或 ...）剥离后按文件/语句两种包裹尝试） */
console.log('\n[6] 指南代码块可解析（go/ts/tsx）');
{
  const guideDirs = ['专题', '分发与更新'];
  const mdFiles = [];
  const walkMd = (dir) => {
    if (!statSync(dir).isDirectory()) return;
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walkMd(p, mdFiles);
      else if (name.endsWith('.md')) mdFiles.push(p);
    }
  };
  for (const d of guideDirs) {
    const abs = join(repoRoot, d);
    try { walkMd(abs); } catch { /* 目录不存在跳过 */ }
  }
  const outline = join(repoRoot, 'Wails3桌面项目立项总大纲.md');
  try { if (statSync(outline).isFile()) mdFiles.push(outline); } catch { /* 可选 */ }

  let fences = 0;
  let bad = 0;
  const tmp = mkdtempSync(join(tmpdir(), 'guide-check-'));
  for (const f of mdFiles) {
    const src = readFileSync(f, 'utf8');
    const rel = f.slice(repoRoot.length + 1);
    const re = /```(go|ts|tsx|typescript)\n([\s\S]*?)```/g;
    let m;
    let idx = 0;
    while ((m = re.exec(src)) !== null) {
      idx++;
      const lang = m[1] === 'typescript' ? 'ts' : m[1];
      const raw = m[2]
        .split('\n')
        .filter((line) => !/^\s*(\.\.\.|…|\/\/ \.\.\.)\s*$/.test(line))
        .join('\n');
      if (!raw.trim()) continue;
      fences++;
      const file = join(tmp, `${lang}-${idx}-${f.replace(/[^\w]/g, '_')}.${lang === 'go' ? 'go' : lang === 'tsx' ? 'tsx' : 'ts'}`);
      let body = raw;
      if (lang === 'go') {
        // 片段宽容：原样 → 带包 → 带包带函数 三种包裹任一可解析即过
        const variants = [
          raw, // 已含 package 头的完整块
          `package main\n${raw}`, // 仅声明/语句片段
          `package main\nfunc _() {\n${raw}\n}`, // 语句片段
        ];
        let ok = false;
        let lastErr = '';
        for (const v of variants) {
          try {
            execFileSync('gofmt', ['-e'], { input: v, stdio: ['pipe', 'ignore', 'pipe'] });
            ok = true;
            break;
          } catch (e) {
            lastErr = String(e.message).split('\n')[0];
          }
        }
        if (!ok) {
          fail(`${rel} 代码块 #${idx}（go）无法解析：${lastErr}`);
          bad++;
        }
        continue;
      }
      // ts/tsx：esbuild transform（stdin，loader 按块语言）
      try {
        execFileSync(esbuildBin, [`--loader=${lang}`, '--log-level=error'], { input: raw, stdio: ['pipe', 'ignore', 'pipe'] });
      } catch (e) {
        fail(`${rel} 代码块 #${idx}（${lang}）无法解析：${String(e.message).split('\n')[0]}`);
        bad++;
      }
    }
  }
  rmSync(tmp, { recursive: true, force: true });
  if (!bad) ok(`共 ${fences} 个 go/ts/tsx 代码块，全部可解析`);
}

console.log(`\n==== 结果：${errors} error / ${warnings} warning ====`);
process.exit(errors > 0 ? 1 : 0);
