import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { QualityRuleResult } from '#/api';

import { $t } from '@vben/locales';

export const RULE_TYPE_OPTIONS = [
  { label: '空值检查', value: 'null_check' },
  { label: '唯一性检查', value: 'unique_check' },
  { label: '范围检查', value: 'range_check' },
  { label: '格式检查', value: 'format_check' },
  { label: '引用完整性', value: 'referential_integrity' },
  { label: '自定义 SQL', value: 'custom_sql' },
];

export const SEVERITY_OPTIONS = [
  { color: 'success', label: '提示', value: 'info' },
  { color: 'warning', label: '警告', value: 'warning' },
  { color: 'error', label: '严重', value: 'critical' },
];

const RULE_TYPE_COLORS: Record<string, string> = {
  null_check: 'blue',
  unique_check: 'purple',
  range_check: 'cyan',
  format_check: 'orange',
  referential_integrity: 'geekblue',
  custom_sql: 'volcano',
};

const STATUS_OPTIONS = [
  { color: 'success', label: '已启用', value: 1 },
  { color: 'default', label: '已禁用', value: 0 },
];

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '规则名称',
  },
  {
    component: 'Select',
    fieldName: 'rule_type',
    label: '规则类型',
    componentProps: {
      allowClear: true,
      options: RULE_TYPE_OPTIONS,
      placeholder: $t('common.form.select'),
    },
  },
  {
    component: 'Select',
    fieldName: 'severity',
    label: '严重级别',
    componentProps: {
      allowClear: true,
      options: [
        { label: '提示', value: 'info' },
        { label: '警告', value: 'warning' },
        { label: '严重', value: 'critical' },
      ],
      placeholder: $t('common.form.select'),
    },
  },
];

export function useColumns(
  onActionClick?: OnActionClickFn<QualityRuleResult>,
): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    { field: 'name', title: '规则名称', minWidth: 140 },
    {
      field: 'rule_type',
      title: '规则类型',
      width: 120,
      cellRender: {
        name: 'CellTag',
        options: RULE_TYPE_OPTIONS.map((t) => ({
          ...t,
          color: RULE_TYPE_COLORS[t.value] || 'default',
        })),
      },
    },
    {
      field: 'target_table',
      title: '目标表',
      width: 120,
      formatter({ cellValue }) {
        return cellValue || '-';
      },
    },
    {
      field: 'target_field',
      title: '目标字段',
      width: 110,
      formatter({ cellValue }) {
        return cellValue || '-';
      },
    },
    {
      field: 'severity',
      title: '严重级别',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: SEVERITY_OPTIONS,
      },
    },
    {
      field: 'enabled',
      title: '启用状态',
      width: 100,
      cellRender: {
        name: 'CellSwitch',
      },
    },
    {
      field: 'status',
      title: '执行状态',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: STATUS_OPTIONS,
      },
    },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 280,
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit',
          {
            code: 'run_check',
            text: '执行检查',
          },
          'delete',
        ],
      },
    },
  ];
}

export function useCreateSchema(): VbenFormSchema[] {
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
        options: RULE_TYPE_OPTIONS,
        placeholder: '请选择规则类型',
      },
      fieldName: 'rule_type',
      label: '规则类型',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      fieldName: 'target_table',
      label: '目标表',
      help: '例如：ods_order_info',
    },
    {
      component: 'Input',
      fieldName: 'target_field',
      label: '目标字段',
      help: '例如：order_status',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        options: [
          { label: '提示', value: 'info' },
          { label: '警告', value: 'warning' },
          { label: '严重', value: 'critical' },
        ],
        placeholder: '请选择严重级别',
      },
      fieldName: 'severity',
      label: '严重级别',
      rules: 'selectRequired',
    },
    {
      component: 'Textarea',
      fieldName: 'rule_config',
      label: '规则配置',
      help: 'JSON 格式，例如：{"min": 0, "max": 100}',
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '描述',
    },
  ];
}
