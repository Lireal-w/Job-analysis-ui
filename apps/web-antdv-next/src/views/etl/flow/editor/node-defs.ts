import type { Node } from '@antv/x6';

/**
 * ETL 节点类型定义
 */
export interface EtlNodeMeta {
  type: 'source' | 'transform' | 'target';
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
  configFields?: EtlConfigField[];
}

export interface EtlConfigField {
  key: string;
  label: string;
  type: 'input' | 'select' | 'textarea' | 'switch';
  required?: boolean;
  /** 静态选项 */
  options?: { label: string; value: string }[];
  /** 动态选项：从 API 加载时的 key 标识 */
  dynamicOptions?: string;
  defaultValue?: string | boolean;
  /** 当另一个字段等于某个值时隐藏 */
  hiddenIf?: { field: string; value: string };
  placeholder?: string;
  help?: string;
}

import { Graph } from '@antv/x6';

/**
 * 注册 X6 自定义 ETL 节点样式
 */
export function registerEtlNode() {
  Graph.registerNode(
    'etl-node',
    {
      inherit: 'rect',
      width: 200,
      height: 80,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'rect',
          selector: 'headerBg',
        },
        {
          tagName: 'text',
          selector: 'iconText',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
        {
          tagName: 'text',
          selector: 'typeLabel',
        },
        {
          tagName: 'circle',
          selector: 'statusDot',
        },
      ],
      attrs: {
        body: {
          fill: 'var(--ant-color-bg-container, #fff)',
          stroke: '#d9d9d9',
          strokeWidth: 1,
          rx: 6,
          ry: 6,
        },
        headerBg: {
          fill: '#1677ff',
          height: 28,
          y: 0,
          rx: 6,
          ry: 6,
        },
        iconText: {
          text: '📦',
          fontSize: 14,
          x: 12,
          y: 18,
          'text-anchor': 'start',
        },
        label: {
          text: '节点',
          fontSize: 13,
          fontWeight: '600',
          fill: '#fff',
          x: 32,
          y: 18,
          'text-anchor': 'start',
        },
        typeLabel: {
          text: '类型',
          fontSize: 11,
          fill: '#999',
          x: 12,
          y: 52,
          'text-anchor': 'start',
        },
        statusDot: {
          r: 4,
          fill: '#52c41a',
          cx: 184,
          cy: 14,
        },
      },
      ports: {
        groups: {
          top: { position: 'top', attrs: { circle: { r: 4, magnet: true, stroke: '#1677ff', strokeWidth: 2, fill: '#fff' } } },
          bottom: { position: 'bottom', attrs: { circle: { r: 4, magnet: true, stroke: '#1677ff', strokeWidth: 2, fill: '#fff' } } },
          left: { position: 'left', attrs: { circle: { r: 4, magnet: true, stroke: '#1677ff', strokeWidth: 2, fill: '#fff' } } },
          right: { position: 'right', attrs: { circle: { r: 4, magnet: true, stroke: '#1677ff', strokeWidth: 2, fill: '#fff' } } },
        },
        items: [
          { group: 'top' },
          { group: 'bottom' },
          { group: 'left' },
          { group: 'right' },
        ],
      },
    },
    true,
  );
}

/**
 * 可用的 ETL 节点类型配置
 */
export const ETL_NODE_TYPES: EtlNodeMeta[] = [
  {
    type: 'source',
    label: '数据库输入',
    icon: '🗄️',
    color: '#1677ff',
    bgColor: '#e6f4ff',
    description: '从已有的数据源读取数据',
    configFields: [
      {
        key: 'datasourceId',
        label: '选择数据源',
        type: 'select',
        required: true,
        dynamicOptions: 'datasources',
        placeholder: '请选择数据源',
      },
      {
        key: 'sourceType',
        label: '数据对象类型',
        type: 'select',
        required: true,
        options: [
          { label: '表/视图', value: 'table' },
          { label: '自定义 SQL', value: 'sql' },
        ],
        defaultValue: 'table',
      },
      {
        key: 'tableName',
        label: '表名',
        type: 'input',
        required: true,
        placeholder: '请输入表名或视图名',
        hiddenIf: { field: 'sourceType', value: 'sql' },
      },
      {
        key: 'query',
        label: '查询语句',
        type: 'textarea',
        placeholder: 'SELECT * FROM ...',
        hiddenIf: { field: 'sourceType', value: 'table' },
      },
    ],
  },
  {
    type: 'source',
    label: 'API 输入',
    icon: '🌐',
    color: '#1677ff',
    bgColor: '#e6f4ff',
    description: '通过 HTTP API 接收数据',
    configFields: [
      {
        key: 'endpoint',
        label: '接口地址',
        type: 'input',
        required: true,
        placeholder: 'https://api.example.com/data',
      },
      {
        key: 'method',
        label: '请求方法',
        type: 'select',
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
        ],
        defaultValue: 'GET',
      },
      {
        key: 'headers',
        label: '请求头 (JSON)',
        type: 'textarea',
        placeholder: '{"Authorization": "Bearer xxx"}',
      },
    ],
  },
  {
    type: 'transform',
    label: '字段映射',
    icon: '🔄',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    description: '映射和转换字段名称与类型',
    configFields: [
      {
        key: 'mappingRules',
        label: '映射规则 (JSON)',
        type: 'textarea',
        required: true,
        placeholder: '[{"from":"old_name","to":"new_name","type":"string"}]',
      },
      {
        key: 'dropUnmatched',
        label: '丢弃未匹配字段',
        type: 'switch',
        defaultValue: true,
      },
    ],
  },
  {
    type: 'transform',
    label: '数据过滤',
    icon: '🔍',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    description: '按条件过滤数据行',
    configFields: [
      {
        key: 'condition',
        label: '过滤条件',
        type: 'input',
        required: true,
        placeholder: '例如: age > 18 AND status = "active"',
      },
    ],
  },
  {
    type: 'transform',
    label: '数据聚合',
    icon: '📊',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    description: '按字段分组聚合计算',
    configFields: [
      {
        key: 'groupBy',
        label: '分组字段',
        type: 'input',
        required: true,
        placeholder: '逗号分隔多个字段',
      },
      {
        key: 'aggregateField',
        label: '聚合字段',
        type: 'input',
        required: true,
        placeholder: '例如: amount',
      },
      {
        key: 'aggregateFunc',
        label: '聚合函数',
        type: 'select',
        options: [
          { label: 'SUM 求和', value: 'SUM' },
          { label: 'AVG 平均值', value: 'AVG' },
          { label: 'COUNT 计数', value: 'COUNT' },
          { label: 'MAX 最大值', value: 'MAX' },
          { label: 'MIN 最小值', value: 'MIN' },
        ],
        defaultValue: 'SUM',
      },
      {
        key: 'alias',
        label: '结果字段名',
        type: 'input',
        placeholder: '默认: aggregate_{field}',
      },
    ],
  },
  {
    type: 'transform',
    label: '数据合并',
    icon: '🔗',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    description: '合并多个上游数据源',
    configFields: [
      {
        key: 'joinType',
        label: '合并方式',
        type: 'select',
        options: [
          { label: 'INNER JOIN', value: 'inner' },
          { label: 'LEFT JOIN', value: 'left' },
          { label: 'RIGHT JOIN', value: 'right' },
          { label: 'FULL JOIN', value: 'full' },
          { label: 'UNION ALL', value: 'union_all' },
        ],
        defaultValue: 'inner',
      },
      {
        key: 'joinKey',
        label: '关联字段',
        type: 'input',
        placeholder: '用于 JOIN 的关联字段名',
        help: '多个字段用逗号分隔',
      },
    ],
  },
  {
    type: 'target',
    label: '数据库输出',
    icon: '💾',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    description: '写入目标数据库',
    configFields: [
      {
        key: 'targetDatasourceId',
        label: '目标数据源',
        type: 'select',
        required: true,
        dynamicOptions: 'datasources',
        placeholder: '请选择目标数据源',
      },
      {
        key: 'targetTable',
        label: '目标表名',
        type: 'input',
        required: true,
        placeholder: '例如: dwd_sales_summary',
      },
      {
        key: 'writeMode',
        label: '写入模式',
        type: 'select',
        options: [
          { label: '覆盖写入 (Overwrite)', value: 'overwrite' },
          { label: '追加写入 (Append)', value: 'append' },
          { label: '增量更新 (Upsert)', value: 'upsert' },
        ],
        defaultValue: 'append',
      },
      {
        key: 'createTable',
        label: '自动建表',
        type: 'switch',
        defaultValue: true,
      },
    ],
  },
  {
    type: 'target',
    label: '文件输出',
    icon: '📁',
    color: '#722ed1',
    bgColor: '#f9f0ff',
    description: '导出到文件存储',
    configFields: [
      {
        key: 'fileFormat',
        label: '文件格式',
        type: 'select',
        options: [
          { label: 'CSV', value: 'csv' },
          { label: 'JSON', value: 'json' },
          { label: 'Parquet', value: 'parquet' },
          { label: 'Excel', value: 'xlsx' },
        ],
        defaultValue: 'csv',
      },
      {
        key: 'filePath',
        label: '输出路径',
        type: 'input',
        required: true,
        placeholder: '/data/export/output',
      },
      {
        key: 'fileName',
        label: '文件名前缀',
        type: 'input',
        defaultValue: 'export',
      },
      {
        key: 'withHeader',
        label: '包含表头',
        type: 'switch',
        defaultValue: true,
      },
    ],
  },
];

/**
 * 序列化 X6 节点为后端存储格式
 */
export function serializeGraph(graph: any): {
  nodes: Record<string, any>[];
  edges: Record<string, any>[];
} {
  const cells = graph.getCells();
  const nodes: Record<string, any>[] = [];
  const edges: Record<string, any>[] = [];

  cells.forEach((cell: any) => {
    if (cell.isNode()) {
      const data = cell.getData() || {};
      nodes.push({
        id: cell.id,
        type: data.etlType || 'transform',
        label: cell.attr('label/text') || '节点',
        icon: data.icon || '',
        x: cell.position().x,
        y: cell.position().y,
        config: data.config || {},
      });
    } else if (cell.isEdge()) {
      edges.push({
        id: cell.id,
        source: cell.getSourceCellId(),
        target: cell.getTargetCellId(),
      });
    }
  });

  return { nodes, edges };
}

/**
 * 反序列化后端数据为 X6 节点
 */
export function deserializeToGraph(
  graph: any,
  data: { nodes?: Record<string, any>[]; edges?: Record<string, any>[] },
) {
  graph.clearCells();

  (data.nodes || []).forEach((nodeData: Record<string, any>) => {
    const def = ETL_NODE_TYPES.find(
      (t) => t.type === nodeData.type && t.label === nodeData.label,
    );
    graph.addNode({
      id: nodeData.id,
      shape: 'etl-node',
      x: nodeData.x || 120,
      y: nodeData.y || 120,
      data: {
        etlType: nodeData.type || 'transform',
        icon: nodeData.icon || '',
        config: nodeData.config || {},
      },
      attrs: {
        label: {
          text: nodeData.label || '节点',
        },
        typeLabel: {
          text: def?.description || getNodeTypeLabel(nodeData.type || 'transform'),
        },
        headerBg: {
          fill: def?.color || '#1677ff',
        },
      },
    });
  });

  (data.edges || []).forEach((edgeData: Record<string, any>) => {
    graph.addEdge({
      id: edgeData.id,
      source: edgeData.source,
      target: edgeData.target,
      attrs: {
        line: {
          stroke: '#1677ff',
          strokeWidth: 2,
          targetMarker: { name: 'classic', size: 8 },
        },
      },
    });
  });
}

/**
 * 根据节点配置获取显示文本（用于在节点上展示配置摘要）
 */
export function getNodeConfigSummary(nodeData: any): string {
  const config = nodeData.config || {};
  const etlType = nodeData.etlType || '';

  if (etlType === 'source') {
    return config.datasourceName || config.tableName || config.endpoint || '';
  }
  if (etlType === 'target') {
    return config.targetDatasourceName
      ? `${config.targetDatasourceName} → ${config.targetTable || ''}`
      : config.targetTable || config.filePath || '';
  }
  if (etlType === 'transform') {
    return config.condition || config.groupBy || config.joinType || '';
  }
  return '';
}

function getNodeTypeLabel(type: string): string {
  switch (type) {
    case 'source':
      return '数据源';
    case 'target':
      return '数据目标';
    default:
      return '数据转换';
  }
}
