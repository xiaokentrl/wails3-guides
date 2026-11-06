import { useRef, useState } from 'react';
import { Button, Stack, Text } from '../../index';
import { Chart } from '../../integrations/Chart.tsx';
import { QrCode } from '../../integrations/QrCode.tsx';
import { CodeEditor } from '../../integrations/CodeEditor.tsx';
import { Map } from '../../integrations/Map.tsx';
import { RichText } from '../../integrations/RichText.tsx';
import { Terminal, type TerminalRef } from '../../integrations/Terminal.tsx';
import { Whiteboard } from '../../integrations/Whiteboard.tsx';
import '@xterm/xterm/css/xterm.css';
import 'leaflet/dist/leaflet.css';
import 'tldraw/tldraw.css';

/* 集成封装演示（→ 组件库全景「专项能力层」）：
   模式四件套 = 懒加载 peer 库 / Loading 兜底 / ResizeObserver 自适应 / 卸载即销毁。
   集成件不从 index.ts 导出（零运行时依赖纪律），demo 直接从 integrations/ 引入。 */

export function DemoChart() {
  const [week, setWeek] = useState(true);
  const option = week
    ? {
        xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
        yAxis: { type: 'value' },
        series: [{ type: 'line', smooth: true, data: [120, 200, 150, 80, 70, 110, 130] }],
        tooltip: { trigger: 'axis' },
      }
    : {
        xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: [420, 380, 510, 490] }],
        tooltip: { trigger: 'axis' },
      };
  return (
    <div>
      <Stack direction="horizontal" gap={2} align="center">
        <Button size="sm" onClick={() => setWeek(true)}>
          周视图（折线）
        </Button>
        <Button size="sm" onClick={() => setWeek(false)}>
          季视图（柱状）
        </Button>
      </Stack>
      <Chart option={option} height={260} />
      <Text type="secondary">懒加载 echarts / Loading 兜底 / 容器 resize 自适应 / option 切换走 setOption 增量合并 / 卸载即 dispose</Text>
    </div>
  );
}

export function DemoMap() {
  return (
    <div>
      <Map
        center={[39.9042, 116.4074]}
        zoom={12}
        markers={[[39.9042, 116.4074, '北京 · 市中心']]}
        height={300}
      />
      <Text type="secondary">
        懒加载 leaflet / 卸载即 remove（防定时器泄漏）/ invalidateSize 跟随容器。瓦片源为项目决策——离线桌面场景换本地瓦片（→《网络与离线弹性技术方案》）；沙箱无外网时瓦片空白属预期，交互（拖拽/缩放）仍可用
      </Text>
    </div>
  );
}

const DEFAULT_CODE = `// Monaco 懒加载示例：语言服务跑在 Web Worker
export function greet(name: string): string {
  return \`你好，\${name}！\`;
}
`;

export function DemoCodeEditor() {
  const [code, setCode] = useState(DEFAULT_CODE);
  return (
    <div>
      <CodeEditor value={code} onChange={setCode} language="typescript" height={220} />
      <Text type="secondary">
        受控 value / onChange（applying 防回环）；字符数：{code.length}——Worker 语言服务（TS 诊断/补全）已随 MonacoEnvironment 配置启用
      </Text>
    </div>
  );
}

export function DemoTerminal() {
  const termRef = useRef<TerminalRef | null>(null);
  const [lineCount, setLineCount] = useState(0);
  return (
    <div>
      <Terminal
        welcome="集成终端（echo REPL）：输入任意文字回车\r\n"
        height={220}
        onInput={(data) => {
          // echo REPL：用户键入 → 回显（真实实现接后端 pty/命令通道 → 系统能力方案）
          const term = termRef.current;
          if (!term) return;
          if (data === '\r') {
            term.write('\r\n');
            setLineCount((n) => n + 1);
          } else if (data === '\u007f') {
            term.write('\b \b'); // 退格
          } else if (data >= ' ' || data === '\t') {
            term.write(data);
          }
        }}
        onReady={(t) => {
          termRef.current = t;
        }}
      />
      <Stack direction="horizontal" gap={2} align="center">
        <Button
          size="sm"
          onClick={() => {
            termRef.current?.writeln(`系统消息 ${new Date().toLocaleTimeString()}`);
            setLineCount((n) => n + 1);
          }}
        >
          写入一行
        </Button>
        <Button size="sm" variant="ghost" onClick={() => termRef.current?.clear()}>
          清屏
        </Button>
        <Text type="secondary">已写入 {lineCount} 行——流式写屏走 ref API（React 不适合高频 write 走 props）</Text>
      </Stack>
    </div>
  );
}

export function DemoRichText() {
  const [html, setHtml] = useState('<p>富文本 <strong>加粗</strong> 与 <em>斜体</em>。</p>');
  return (
    <div>
      <RichText value={html} onChange={setHtml} height={160} />
      <Text type="secondary">
        StarterKit（标题/列表/代码块/历史…）；HTML 导出——存储与回显前须消毒（DOMPurify → 安全边界方案），本封装不代消毒
      </Text>
      <div style={{ marginTop: 8, padding: 8, border: '1px dashed var(--ui-border)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--ui-font-mono)' }}>
        {html.slice(0, 160)}
      </div>
    </div>
  );
}

export function DemoWhiteboard() {
  return (
    <div>
      <Whiteboard height={340} />
      <Text type="secondary">React.lazy 懒加载（tldraw 体量大）；内存态（persistenceKey 不传）——持久化接状态持久化方案，键属项目决策</Text>
    </div>
  );
}

export function DemoQrCode() {
  const [text, setText] = useState('https://example.com/pair/DEMO-42');
  return (
    <div>
      <Stack direction="horizontal" gap={2} align="center">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ padding: '4px 8px', border: '1px solid var(--ui-border)', borderRadius: 6, background: 'var(--ui-surface)', color: 'var(--ui-text)', minWidth: 260 }}
          aria-label="二维码内容"
        />
      </Stack>
      <QrCode value={text} size={160} />
      <Text type="secondary">懒加载 qrcode 库（Reed-Solomon 不自研）；编码失败显式错误态；深浅色随主题令牌传入</Text>
    </div>
  );
}
