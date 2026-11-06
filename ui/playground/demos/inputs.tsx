import { useState } from 'react';
import { AutoComplete } from '../../components/AutoComplete.tsx';
import { Button } from '../../components/Button.tsx';
import { Cascader } from '../../components/Cascader.tsx';
import { Checkbox } from '../../components/Checkbox.tsx';
import { CheckboxGroup } from '../../components/CheckboxGroup.tsx';
import { DatePicker } from '../../components/DatePicker.tsx';
import { DateRangePicker } from '../../components/DateRangePicker.tsx';
import { FormItem } from '../../components/FormItem.tsx';
import { FormList } from '../../components/FormList.tsx';
import { Icon } from '../../components/Icon.tsx';
import { IconButton } from '../../components/IconButton.tsx';
import { InputNumber, PasswordInput, SearchInput } from '../../components/InputExtra.tsx';
import { Stack } from '../../components/Layout.tsx';
import { SelectListbox } from '../../components/Listbox.tsx';
import { MultiSelect } from '../../components/MultiSelect.tsx';
import { Select, Slider } from '../../components/Pickers.tsx';
import { PinInput } from '../../components/PinInput.tsx';
import { RadioGroup } from '../../components/Radio.tsx';
import { Rate } from '../../components/Rate.tsx';
import { Switch } from '../../components/Switch.tsx';
import { Text, Title } from '../../components/Text.tsx';
import { TextInput } from '../../components/TextInput.tsx';
import { TagInput } from '../../components/TagInput.tsx';
import { Textarea } from '../../components/Textarea.tsx';
import { TimePicker } from '../../components/TimePicker.tsx';
import { Tooltip } from '../../components/Tooltip.tsx';
import { Transfer } from '../../components/Transfer.tsx';
import { Upload } from '../../components/Upload.tsx';
import { useCountdown } from '../../lib/timing.ts';

/* 数据录入组件实时演示（→ 规划表「四、数据录入」） */

export function DemoButtons() {
  const [saving, setSaving] = useState(false);
  return (
    <Stack direction="vertical" gap={3}>
      <Stack direction="horizontal" gap={2} align="center">
        <Button variant="primary">主要</Button>
        <Button>次要</Button>
        <Button variant="danger">危险</Button>
        <Button variant="ghost">幽灵</Button>
        <IconButton label="设置" variant="secondary">
          <Icon name="settings" size={14} />
        </IconButton>
        <Tooltip label="Tooltip 配 IconButton">
          <IconButton label="帮助">
            <Icon name="star" size={14} />
          </IconButton>
        </Tooltip>
      </Stack>
      <Button
        loading={saving}
        onClick={() => {
          setSaving(true);
          setTimeout(() => setSaving(false), 1200);
        }}
      >
        保存（在途禁用演示）
      </Button>
    </Stack>
  );
}

export function DemoTextInput() {
  const [v, setV] = useState('');
  const [err, setErr] = useState<string | null>(null);
  return (
    <div style={{ maxWidth: 320 }}>
      <TextInput
        label="名称"
        placeholder="输入试试（IME 安全）"
        hint="组合态不会被改写；留空提交看错误"
        value={v}
        error={err ?? undefined}
        onChange={(e) => {
          setV(e.target.value);
          setErr(e.target.value.trim() === '' ? '名称不能为空' : null);
        }}
      />
    </div>
  );
}

export function DemoTextarea() {
  const [v, setV] = useState('');
  return <Textarea label="备注" rows={3} value={v} onChange={(e) => setV(e.target.value)} placeholder="支持多行" />;
}

export function DemoCheckbox() {
  const [single, setSingle] = useState(false);
  const [values, setValues] = useState<string[]>(['前端']);
  return (
    <Stack direction="vertical" gap={3}>
      <Checkbox checked={single} onChange={(e) => setSingle(e.target.checked)} label="启用通知" description="包含邮件与站内提醒" />
      <CheckboxGroup
        values={values}
        onChange={setValues}
        options={[
          { value: '设计', label: '设计' },
          { value: '前端', label: '前端' },
          { value: '后端', label: '后端' },
        ]}
      />
      <Text type="secondary">已选：{values.join('、') || '（无）'} · 单选：{single ? '开' : '关'}</Text>
    </Stack>
  );
}

export function DemoSwitch() {
  const [on, setOn] = useState(true);
  return (
    <Stack direction="vertical" gap={3}>
      <Switch checked={on} onChange={setOn} label="自动同步" />
      <FormItem label="带壳层的开关" hint="FormItem 为任意控件补齐 label/error 关联">
        <Switch checked={on} onChange={setOn} label="自动同步" />
      </FormItem>
    </Stack>
  );
}

export function DemoRadio() {
  const [v, setV] = useState('week');
  return (
    <div>
      <RadioGroup
        name="freq"
        value={v}
        onChange={setV}
        options={[
          { value: 'day', label: '按天' },
          { value: 'week', label: '按周' },
          { value: 'month', label: '按月' },
        ]}
      />
      <Text type="secondary">当前：{v}</Text>
    </div>
  );
}

export function DemoInputNumber() {
  const [v, setV] = useState<number | null>(2);
  return (
    <div>
      <InputNumber value={v} onChange={setV} min={0} max={10} />
      <Text type="secondary">当前：{v ?? '（空）'}（min 0 / max 10 钳制）</Text>
    </div>
  );
}

export function DemoPassword() {
  return <PasswordInput label="密码" placeholder="输入密码" />;
}

export function DemoSearch() {
  return <SearchInput placeholder="搜索文件、标签…" />;
}

export function DemoSlider() {
  const [v, setV] = useState(40);
  return (
    <div>
      <Slider value={v} onChange={setV} label="音量" min={0} max={100} />
      <Text type="secondary">当前：{v}</Text>
    </div>
  );
}

export function DemoSelect() {
  const [v, setV] = useState('a');
  return (
    <Select
      label="原生版"
      value={v}
      onChange={setV}
      options={[
        { value: 'a', label: '选项 A' },
        { value: 'b', label: '选项 B' },
      ]}
    />
  );
}

export function DemoSelectListbox() {
  const [v, setV] = useState('o0');
  const options = Array.from({ length: 80 }, (_, i) => ({ value: `o${i}`, label: `选项 ${i + 1}` }));
  return (
    <div style={{ maxWidth: 240 }}>
      <SelectListbox value={v} onChange={setV} options={options} />
      <Text type="secondary">自绘 listbox：80 项（超过 60 自动窗口化）、完整键盘导航</Text>
    </div>
  );
}

export function DemoAutoComplete() {
  const [v, setV] = useState('');
  return (
    <div style={{ maxWidth: 280 }}>
      <AutoComplete value={v} onChange={setV} options={['组件导航', '组件卡', '组件注册表', '设计令牌']} placeholder="输入「组件」试试" />
    </div>
  );
}

export function DemoDatePicker() {
  const [d, setD] = useState<Date | null>(null);
  return (
    <div>
      <DatePicker value={d} onChange={setD} />
      <Text type="secondary">已选：{d ? d.toLocaleDateString() : '（未选）'}</Text>
    </div>
  );
}

export function DemoDateRange() {
  const [r, setR] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  return (
    <div>
      <DateRangePicker value={r} onChange={setR} />
      <Text type="secondary">
        {r.start ? r.start.toLocaleDateString() : '—'} ~ {r.end ? r.end.toLocaleDateString() : '…'}（悬停预览）
      </Text>
    </div>
  );
}

export function DemoTimePicker() {
  const [t, setT] = useState('09:30');
  return <TimePicker label="开始时间" value={t} onChange={setT} />;
}

export function DemoTagInput() {
  const [tags, setTags] = useState<string[]>(['设计']);
  return (
    <div style={{ maxWidth: 360 }}>
      <TagInput tags={tags} onChange={setTags} />
      <Text type="secondary">Enter/逗号提交、重复去重、末格 Backspace 删除</Text>
    </div>
  );
}

export function DemoTransfer() {
  const [value, setValue] = useState<string[]>(['2']);
  return (
    <Transfer
      options={[
        { value: '1', label: '成员一' },
        { value: '2', label: '成员二' },
        { value: '3', label: '成员三' },
        { value: '4', label: '成员四' },
      ]}
      value={value}
      onChange={setValue}
      titles={['候选', '项目成员']}
    />
  );
}

const CASCADER_OPTIONS = [
  {
    value: 'zh',
    label: '前端',
    children: [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
    ],
  },
  {
    value: 'be',
    label: '后端',
    children: [
      { value: 'go', label: 'Go' },
      { value: 'node', label: 'Node' },
    ],
  },
  { value: 'ops', label: '运维' },
];

export function DemoCascader() {
  const [path, setPath] = useState<string[]>([]);
  return (
    <div>
      <Cascader options={CASCADER_OPTIONS} value={path} onChange={(v) => setPath(v as string[])} showSearch />
      <Text type="secondary">路径：{path.length ? path.join(' / ') : '（未选）'}（showSearch 已开：面板顶搜叶子平铺全路径）</Text>
    </div>
  );
}

export function DemoCascaderMultiple() {
  const [paths, setPaths] = useState<string[][]>([]);
  return (
    <div>
      <Cascader options={CASCADER_OPTIONS} multiple value={paths} onChange={(v) => setPaths(v as string[][])} />
      <Text type="secondary">
        已选路径：{paths.length ? paths.map((p) => p.join('/')).join('、') : '（无）'}——叶子勾选累积路径，父节点复选框三态（勾选 = 子树全选），tag 可单独移除
      </Text>
    </div>
  );
}

export function DemoMultiSelect() {
  const [picked, setPicked] = useState<string[]>(['react']);
  return (
    <div>
      <MultiSelect
        options={[
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
          { value: 'svelte', label: 'Svelte' },
          { value: 'solid', label: 'Solid' },
          { value: 'angular', label: 'Angular' },
          { value: 'jquery', label: 'jQuery（禁用示例）', disabled: true },
        ]}
        value={picked}
        onChange={setPicked}
        maxTags={2}
      />
      <Text type="secondary">已选：{picked.length ? picked.join('、') : '（无）'}——tag 可点 × 移除，超出 2 个折叠 +N，面板底部全选/清空</Text>
    </div>
  );
}

export function DemoUpload() {
  return (
    <div style={{ maxWidth: 420 }}>
      <Upload
        accept=".md,.txt"
        upload={async (file, ctx) => {
          // 模拟进度（真实实现接分片/断点 →《分片上传与断点续传方案》）
          for (let p = 0; p <= 100; p += 10) {
            if (ctx.signal.aborted) throw new DOMException('aborted', 'AbortError');
            ctx.onProgress((p / 100) * file.size, file.size);
            await new Promise<void>((r) => setTimeout(r, 150));
          }
        }}
      />
      <Text type="secondary">试试点取消——进度条与取消链（AbortSignal）联动。</Text>
    </div>
  );
}

export function DemoPin() {
  const [code, setCode] = useState('');
  const [cooling, setCooling] = useState(false);
  const remain = useCountdown(60, cooling);
  return (
    <Stack direction="vertical" gap={3}>
      <PinInput value={code} onChange={setCode} length={6} onComplete={(v) => console.log('验证码填满', v)} />
      <Stack direction="horizontal" gap={2} align="center">
        <Button size="sm" disabled={cooling} onClick={() => setCooling(true)}>
          {cooling ? `重新发送（${remain}s）` : '发送验证码'}
        </Button>
        <Text type="secondary">useCountdown 驱动；粘贴自动分发</Text>
      </Stack>
    </Stack>
  );
}

export function DemoFormList() {
  const [fields, setFields] = useState([{ key: 'f1' }, { key: 'f2' }]);
  return (
    <div style={{ maxWidth: 420 }}>
      <FormList
        fields={fields}
        onChange={setFields}
        createRow={() => ({ key: `f${Date.now()}` })}
        renderRow={(f, i) => (
          <Stack direction="horizontal" gap={2} align="center">
            <Text>
              行 {i + 1}（{f.key.slice(0, 6)}）
            </Text>
          </Stack>
        )}
      />
    </div>
  );
}

export function DemoFormItemRate() {
  const [rate, setRate] = useState(3);
  return (
    <div style={{ maxWidth: 320 }}>
      <FormItem label="满意度" required hint="Rate 组件经由 FormItem 关联 label">
        <Rate value={rate} onChange={setRate} />
      </FormItem>
    </div>
  );
}

export function DemoInputsOverview() {
  return (
    <div>
      <Title level={2}>数据录入</Title>
      <Text type="secondary">左侧选择具体组件查看实时演示。</Text>
      <Stack direction="horizontal" gap={2}>
        <Button size="sm" variant="primary">从 Button 开始</Button>
      </Stack>
    </div>
  );
}

export function DemoDatePickerVariants() {
  const [d, setD] = useState<Date | null>(new Date(2026, 10, 6));
  const [m, setM] = useState<Date | null>(new Date(2026, 10, 1));
  const [y, setY] = useState<Date | null>(new Date(2026, 0, 1));
  const [q, setQ] = useState<Date | null>(new Date(2026, 9, 1));
  return (
    <Stack direction="vertical" gap={3}>
      <Stack direction="horizontal" gap={2} align="center">
        <DatePicker picker="week" value={d} onChange={setD} placeholder="选择周" />
        <Text type="secondary">week：整行选择，触发器带 ISO 周号</Text>
      </Stack>
      <Stack direction="horizontal" gap={2} align="center">
        <DatePicker picker="month" value={m} onChange={setM} placeholder="选择月份" />
        <Text type="secondary">month：12 月格（3 列），值归一化为当月 1 日</Text>
      </Stack>
      <Stack direction="horizontal" gap={2} align="center">
        <DatePicker picker="quarter" value={q} onChange={setQ} placeholder="选择季度" />
        <Text type="secondary">quarter：4 季格，值归一化为季首月 1 日</Text>
      </Stack>
      <Stack direction="horizontal" gap={2} align="center">
        <DatePicker picker="year" value={y} onChange={setY} placeholder="选择年份" />
        <Text type="secondary">year：十二年页（4 列），值归一化为 1 月 1 日</Text>
      </Stack>
    </Stack>
  );
}
