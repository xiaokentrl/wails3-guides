import { useState } from 'react';
import { AdvancedTable } from '../../business/AdvancedTable.tsx';
import { OrgSelector } from '../../business/OrgSelector.tsx';
import { SearchForm } from '../../business/SearchForm.tsx';
import { Text, Title } from '../../components/Text.tsx';

/* 通用业务组件实时演示（→ 规划表「业务组件」；三级组件中间层） */

const ORG_DATA = [
  {
    key: 'hq',
    label: '总部',
    children: [
      { key: 'hq-fe', label: '前端组' },
      { key: 'hq-be', label: '后端组' },
    ],
  },
  {
    key: 'branch',
    label: '深圳分部',
    children: [{ key: 'branch-fe', label: '分部前端组' }],
  },
];

export function DemoSearchForm() {
  const [result, setResult] = useState('（尚未查询）');
  return (
    <div>
      <SearchForm
        fields={[
          { key: 'q', label: '关键词', placeholder: '名称 / 编号' },
          { key: 'status', label: '状态', kind: 'select', options: [{ value: 'open', label: '进行中' }, { value: 'done', label: '已完成' }] },
          { key: 'owner', label: '负责人', placeholder: '任意' },
        ]}
        onSearch={(values) => setResult(JSON.stringify(values))}
        onReset={() => setResult('（已重置）')}
      />
      <Text type="secondary">提交结果：{result}</Text>
    </div>
  );
}

export function DemoAdvancedTable() {
  return (
    <AdvancedTable
      columns={[
        { key: 'name', title: '文件名', sorter: (a: unknown, b: unknown) => String((a as { name: string }).name).localeCompare(String((b as { name: string }).name)) },
        { key: 'owner', title: '负责人' },
        { key: 'size', title: '大小', align: 'right' },
      ]}
      rows={Array.from({ length: 23 }, (_, i) => ({ name: `文档 ${i + 1}.md`, owner: i % 2 ? '甲' : '乙', size: (i + 1) * 1024 }))}
      rowKey={(r) => String(r.name)}
      pageSize={8}
      toolbar={<Text type="secondary">工具栏插槽：筛选与批量操作放这里</Text>}
    />
  );
}

export function DemoOrgSelector() {
  const [org, setOrg] = useState<string | undefined>(undefined);
  return (
    <div>
      <OrgSelector data={ORG_DATA} value={org} onChange={setOrg} />
      <Text type="secondary">当前组织：{org ?? '（未选）'}（面板内搜索保留祖先链）</Text>
    </div>
  );
}

export function DemoBusinessOverview() {
  return (
    <div>
      <Title level={2}>业务组件</Title>
      <Text type="secondary">三级组件中间层：跨业务线复用的复合模块。新成员按三次规则入库。</Text>
    </div>
  );
}
