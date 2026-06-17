import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { DataMaskingRuleResult, ResourcePermissionResult } from '#/api';

import { $t } from '@vben/locales';

// ---------- Resource Permission ----------

export const PERMISSION_TYPES = [
  { label: '读取', value: 'read' },
  { label: '写入', value: 'write' },
  { label: '管理', value: 'admin' },
];

export const RESOURCE_TYPES = [
  { label: '数据源', value: 'datasource' },
  { label: '数据集', value: 'dataset' },
  { label: '报表', value: 'report' },
  { label: '任务', value: 'task' },
];

export const MASK_TYPES = [
  { label: '脱敏', value: 'mask' },
  { label: '替换', value: 'replace' },
  { label: '隐藏', value: 'hide' },
  { label: '哈希', value: 'hash' },
];

export const permissionQuerySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '权限名称',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: RESOURCE_TYPES,
      placeholder: $t('common.form.select'),
    },
    fieldName: 'resource_type',
    label: '资源类型',
  },
];

export const maskingQuerySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '规则名称',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: MASK_TYPES,
      placeholder: $t('common.form.select'),
    },
    fieldName: 'mask_type',
    label: '脱敏类型',
  },
];

export function usePermissionColumns(
  onActionClick?: OnActionClickFn<ResourcePermissionResult>,
): VxeGridProps['columns'] {
  return [
    { field: 'checkbox', type: 'checkbox', align: 'left', width: 50 },
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    { field: 'name', title: '权限名称', minWidth: 140 },
    {
      field: 'resource_type',
      title: '资源类型',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'blue', label: '数据源', value: 'datasource' },
          { color: 'cyan', label: '数据集', value: 'dataset' },
          { color: 'green', label: '报表', value: 'report' },
          { color: 'orange', label: '任务', value: 'task' },
        ],
      },
    },
    {
      field: 'permission_type',
      title: '权限类型',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: PERMISSION_TYPES,
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
      field: 'description',
      title: '描述',
      minWidth: 150,
      showOverflow: true,
      formatter({ cellValue }) {
        return cellValue || '-';
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

export function useMaskingColumns(
  onActionClick?: OnActionClickFn<DataMaskingRuleResult>,
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
      field: 'mask_type',
      title: '脱敏类型',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'purple', label: '脱敏', value: 'mask' },
          { color: 'blue', label: '替换', value: 'replace' },
          { color: 'orange', label: '隐藏', value: 'hide' },
          { color: 'volcano', label: '哈希', value: 'hash' },
        ],
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
      width: 120,
      formatter({ cellValue }) {
        return cellValue || '-';
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

export function usePermissionCreateSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '权限名称',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        options: RESOURCE_TYPES,
        placeholder: '请选择资源类型',
      },
      fieldName: 'resource_type',
      label: '资源类型',
      rules: 'selectRequired',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        options: PERMISSION_TYPES,
        placeholder: '请选择权限类型',
      },
      fieldName: 'permission_type',
      label: '权限类型',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      fieldName: 'resource_name',
      label: '资源名称',
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

export function useMaskingCreateSchema(): VbenFormSchema[] {
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
        options: MASK_TYPES,
        placeholder: '请选择脱敏类型',
      },
      fieldName: 'mask_type',
      label: '脱敏类型',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      fieldName: 'target_table',
      label: '目标表',
    },
    {
      component: 'Input',
      fieldName: 'target_field',
      label: '目标字段',
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
  ];
}
