import type { VbenFormSchema } from '#/adapter/form';

export const WIDGET_TYPES = [
  { type: 'bar', label: '柱状图', icon: 'ant-design:bar-chart-outlined' },
  { type: 'line', label: '折线图', icon: 'ant-design:line-chart-outlined' },
  { type: 'pie', label: '饼图', icon: 'ant-design:pie-chart-outlined' },
  { type: 'scatter', label: '散点图', icon: 'ant-design:dot-chart-outlined' },
  { type: 'area', label: '面积图', icon: 'ant-design:area-chart-outlined' },
  { type: 'table', label: '数据表格', icon: 'ant-design:table-outlined' },
  { type: 'stat', label: '统计卡片', icon: 'ant-design:number-outlined' },
];

export const THEME_OPTIONS = [
  { label: '默认', value: 'default' },
  { label: '暗色', value: 'dark' },
  { label: '清新', value: 'light' },
  { label: '海洋', value: 'ocean' },
  { label: '森林', value: 'forest' },
];

export const widgetConfigSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'title',
    label: '组件标题',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: false,
      options: WIDGET_TYPES,
    },
    fieldName: 'widget_type',
    label: '组件类型',
    rules: 'selectRequired',
  },
  {
    component: 'Textarea',
    fieldName: 'query_sql',
    label: '查询SQL',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 1,
      max: 12,
    },
    fieldName: 'config.cols',
    label: '宽度 (1-12)',
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 1,
      max: 6,
    },
    fieldName: 'config.rows',
    label: '高度 (1-6)',
  },
];

export const createReportSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '报表名称',
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
      allowClear: false,
      options: THEME_OPTIONS,
    },
    fieldName: 'theme',
    label: '主题',
  },
  {
    component: 'InputNumber',
    componentProps: {
      class: 'w-full',
      min: 0,
      max: 3600,
    },
    fieldName: 'refresh_interval',
    label: '刷新间隔(秒)',
    help: '0 表示不自动刷新',
  },
  {
    component: 'Switch',
    fieldName: 'is_public',
    label: '是否公开',
  },
];
