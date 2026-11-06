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
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
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

console.log(`\n==== 结果：${errors} error / ${warnings} warning ====`);
process.exit(errors > 0 ? 1 : 0);
