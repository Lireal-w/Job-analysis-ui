import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { AlertHistoryResult, AlertRuleResult } from '#/api';

import { $t } from '@vben/locales';

// ---------- Alert Rule ----------

export const METRIC_TYPES = [
  { label: 'CPU 使用率', value: 'cpu_usage' },
  { label: '内存使用率', value: 'memory_usage' },
  { label: '磁盘使用率', value: 'disk_usage' },
  { label: '网络延迟', value: 'network_latency' },
  { label: '错误率', value: 'error_rate' },
  { label: '请求量', value: 'request_count' },
  { label: '数据延迟', value: 'data_lag' },
];

export const CONDITIONS = [
  { label: '大于', value: 'gt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于', value: 'lt' },
  { label: '小于等于', value: 'lte' },
  { label: '等于', value: 'eq' },
];

export const SEVERITIES = [
  { label: '信息', value: 'info', color: 'blue' },
  { label: '警告', value: 'warning', color: 'orange' },
  { label: '严重', value: 'critical', color: 'red' },
  { label: '灾难', value: 'disaster', color: 'volcano' },
];

export const SEVERITY_COLORS: Record<string, string> = {
  info: 'blue',
  warning: 'orange',
  critical: 'red',
  disaster: 'volcano',
};

export const NOTIFY_CHANNELS = [
  { label: '邮件', value: 'email' },
  { label: '短信', value: 'sms' },
  { label: '企业微信', value: 'wechat' },
  { label: '钉钉', value: 'dingtalk' },
  { label: '飞书', value: 'feishu' },
];

export const ALERT_HISTORY_STATUSES = [
  { label: '已触发', value: 'fired' },
  { label: '已恢复', value: 'resolved' },
];

export const ruleQuerySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '规则名称',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: METRIC_TYPES,
      placeholder: $t('common.form.select'),
    },
    fieldName: 'metric_type',
    label: '指标类型',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: SEVERITIES,
      placeholder: $t('common.form.select'),
    },
    fieldName: 'severity',
    label: '严重级别',
  },
];

export const historyQuerySchema: VbenFormSchema[] = [
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: SEVERITIES,
      placeholder: $t('common.form.select'),
    },
    fieldName: 'severity',
    label: '严重级别',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: ALERT_HISTORY_STATUSES,
      placeholder: $t('common.form.select'),
    },
    fieldName: 'status',
    label: '状态',
  },
];

export function useRuleColumns(
  onActionClick?: OnActionClickFn<AlertRuleResult>,
): VxeGridProps['columns'] {
  return [
    { field: 'checkbox', type: 'checkbox', align: 'left', width: 50 },
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    { field: 'name', title: '规则名称', minWidth: 140 },
    {
      field: 'metric_type',
      title: '指标类型',
      width: 120,
      cellRender: {
        name: 'CellTag',
        options: METRIC_TYPES,
      },
    },
    {
      field: 'condition',
      title: '条件',
      width: 70,
      cellRender: {
        name: 'CellTag',
        options: CONDITIONS,
      },
    },
    { field: 'threshold', title: '阈值', width: 80 },
    { field: 'duration_seconds', title: '持续时间(秒)', width: 130 },
    {
      field: 'severity',
      title: '严重级别',
      width: 90,
      cellRender: {
        name: 'CellTag',
        options: SEVERITIES,
      },
    },
    {
      field: 'enabled',
      title: $t('common.form.status'),
      width: 80,
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'success', label: '启用', value: true },
          { color: 'error', label: '禁用', value: false },
        ],
      },
    },
    {
      field: 'created_time',
      title: $t('common.table.created_time'),
      width: 168,
    },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 150,
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: ['edit', 'delete'],
      },
    },
  ];
}

export function useHistoryColumns(
  onActionClick?: OnActionClickFn<AlertHistoryResult>,
): VxeGridProps['columns'] {
  return [
    { field: 'checkbox', type: 'checkbox', align: 'left', width: 50 },
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    { field: 'rule_name', title: '规则名称', minWidth: 140 },
    { field: 'metric_value', title: '指标值', width: 90 },
    {
      field: 'threshold',
      title: '阈值',
      width: 80,
      formatter({ cellValue }) {
        return cellValue != null ? String(cellValue) : '-';
      },
    },
    {
      field: 'severity',
      title: '严重级别',
      width: 90,
      cellRender: {
        name: 'CellTag',
        options: SEVERITIES,
      },
    },
    {
      field: 'status',
      title: '状态',
      width: 90,
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'error', label: '已触发', value: 'fired' },
          { color: 'success', label: '已恢复', value: 'resolved' },
        ],
      },
    },
    { field: 'message', title: '消息', minWidth: 150, showOverflow: true },
    {
      field: 'fired_time',
      title: '触发时间',
      width: 168,
    },
    {
      field: 'resolved_time',
      title: '恢复时间',
      width: 168,
      formatter({ cellValue }) {
        return cellValue || '-';
      },
    },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 100,
      cellRender: {
        attrs: {
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'details',
            text: '详情',
          },
        ],
      },
    },
  ];
}

export function useRuleCreateSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '规则名称',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        options: METRIC_TYPES,
        placeholder: '请选择指标类型',
      },
      fieldName: 'metric_type',
      label: '指标类型',
      rules: 'selectRequired',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        options: CONDITIONS,
        placeholder: '请选择条件',
      },
      fieldName: 'condition',
      label: '条件',
      rules: 'selectRequired',
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 0,
      },
      fieldName: 'threshold',
      label: '阈值',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 0,
      },
      fieldName: 'duration_seconds',
      label: '持续时间（秒）',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        options: SEVERITIES,
        placeholder: '请选择严重级别',
      },
      fieldName: 'severity',
      label: '严重级别',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        mode: 'multiple',
        options: NOTIFY_CHANNELS,
        placeholder: '请选择通知渠道',
      },
      fieldName: 'notify_channels',
      label: '通知渠道',
    },
    {
      component: 'Switch',
      fieldName: 'enabled',
      label: $t('common.form.status'),
      componentProps: {
        checkedChildren: '启用',
        unCheckedChildren: '禁用',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '描述',
    },
  ];
}
