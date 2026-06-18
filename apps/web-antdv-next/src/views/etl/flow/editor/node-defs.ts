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
  options?: { label: string; value: string }[];
  defaultValue?: string | boolean;
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
    label: '数据源',
    icon: '🗄️',
    color: '#1677ff',
    bgColor: '#e6f4ff',
    description: '从数据库、API 或文件读取数据',
    configFields: [
      {
        key: 'datasource',
        label: '数据源',
        type: 'select',
        required: true,
        defaultValue: '',
      },
      {
        key: 'query',
        label: '查询语句',
        type: 'textarea',
        defaultValue: '',
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
    ],
  },
  {
    type: 'transform',
    label: '字段映射',
    icon: '🔄',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    description: '映射和转换字段名称',
    configFields: [
      {
        key: 'mapping',
        label: '映射规则',
        type: 'textarea',
        defaultValue: '{}',
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
      },
      {
        key: 'aggregate',
        label: '聚合函数',
        type: 'select',
        options: [
          { label: 'SUM', value: 'SUM' },
          { label: 'AVG', value: 'AVG' },
          { label: 'COUNT', value: 'COUNT' },
          { label: 'MAX', value: 'MAX' },
          { label: 'MIN', value: 'MIN' },
        ],
        defaultValue: 'SUM',
      },
    ],
  },
  {
    type: 'transform',
    label: '数据合并',
    icon: '🔗',
    color: '#fa8c16',
    bgColor: '#fff7e6',
    description: '合并多个数据源',
    configFields: [
      {
        key: 'joinType',
        label: '合并方式',
        type: 'select',
        options: [
          { label: 'INNER JOIN', value: 'inner' },
          { label: 'LEFT JOIN', value: 'left' },
          { label: 'RIGHT JOIN', value: 'right' },
          { label: 'UNION', value: 'union' },
        ],
        defaultValue: 'inner',
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
        key: 'targetTable',
        label: '目标表',
        type: 'input',
        required: true,
      },
      {
        key: 'writeMode',
        label: '写入模式',
        type: 'select',
        options: [
          { label: '覆盖写入', value: 'overwrite' },
          { label: '追加写入', value: 'append' },
          { label: '增量更新', value: 'upsert' },
        ],
        defaultValue: 'append',
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
        ],
        defaultValue: 'csv',
      },
      {
        key: 'filePath',
        label: '输出路径',
        type: 'input',
        required: true,
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
        label: cell.getLabelAt(0)?.attrs?.label?.text || '',
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

  const nodeMap = new Map<string, string>();

  (data.nodes || []).forEach((nodeData) => {
    const node = graph.addNode({
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
          text: getNodeTypeLabel(nodeData.type || 'transform'),
        },
      },
    });
    if (node) {
      nodeMap.set(nodeData.id, node.id);
    }
  });

  (data.edges || []).forEach((edgeData) => {
    graph.addEdge({
      id: edgeData.id,
      source: edgeData.source,
      target: edgeData.target,
      attrs: {
        line: {
          stroke: '#1677ff',
          strokeWidth: 2,
          targetMarker: 'classic',
        },
      },
    });
  });
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
