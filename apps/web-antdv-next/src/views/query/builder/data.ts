import type { VbenFormSchema } from '#/adapter/form';

export const QUERY_TYPES = [
  { label: '标准查询', value: 'standard' },
  { label: '聚合查询', value: 'aggregate' },
  { label: '关联查询', value: 'join' },
  { label: '自定义', value: 'custom' },
];

export const DEFAULT_SQL_TEMPLATE = `SELECT * FROM dataset LIMIT 100`;

export const saveQuerySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '查询名称',
    rules: 'required',
  },
  {
    component: 'Textarea',
    fieldName: 'description',
    label: '描述',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: QUERY_TYPES,
    },
    fieldName: 'query_type',
    label: '查询类型',
  },
  {
    component: 'Input',
    fieldName: 'tags',
    label: '标签',
    help: '多个标签用逗号分隔',
  },
  {
    component: 'Switch',
    fieldName: 'is_public',
    label: '是否公开',
  },
];
