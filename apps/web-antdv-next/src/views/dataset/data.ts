import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { DatasetResult } from '#/api';

import { $t } from '@vben/locales';

export const LAYER_TYPE_OPTIONS = [
  { color: 'blue', label: 'ODS 原始数据层', value: 'ods' },
  { color: 'cyan', label: 'DWD 明细数据层', value: 'dwd' },
  { color: 'green', label: 'DWS 汇总数据层', value: 'dws' },
  { color: 'purple', label: 'ADS 应用数据层', value: 'ads' },
  { color: 'orange', label: 'DIM 维度数据层', value: 'dim' },
];

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '数据集名称',
  },
  {
    component: 'Select',
    fieldName: 'layer_id',
    label: '数据分层',
    componentProps: {
      allowClear: true,
      options: [],
      placeholder: $t('common.form.select'),
    },
  },
];

const STATUS_OPTIONS = [
  { color: 'success', label: '已启用', value: 1 },
  { color: 'default', label: '已禁用', value: 0 },
];

export function useColumns(
  onActionClick?: OnActionClickFn<DatasetResult>,
): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    { field: 'name', title: '数据集名称', minWidth: 140 },
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
      field: 'source_type',
      title: '来源类型',
      width: 100,
      formatter({ cellValue }) {
        return cellValue || '-';
      },
    },
    {
      field: 'record_count',
      title: '记录数',
      width: 100,
      formatter({ cellValue }) {
        if (cellValue === null || cellValue === undefined) return '-';
        return cellValue.toLocaleString();
      },
    },
    {
      field: 'storage_size',
      title: '存储大小',
      width: 100,
      formatter({ cellValue }) {
        if (cellValue === null || cellValue === undefined) return '-';
        if (cellValue < 1024) return `${cellValue} B`;
        if (cellValue < 1024 * 1024) return `${(cellValue / 1024).toFixed(1)} KB`;
        return `${(cellValue / (1024 * 1024)).toFixed(1)} MB`;
      },
    },
    {
      field: 'lifecycle_days',
      title: '生命周期(天)',
      width: 110,
      formatter({ cellValue }) {
        return cellValue != null ? `${cellValue} 天` : '永久';
      },
    },
    {
      field: 'status',
      title: $t('common.form.status'),
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: STATUS_OPTIONS,
      },
    },
    {
      field: 'created_time',
      title: '创建时间',
      width: 168,
    },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 180,
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit',
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
      label: '数据集名称',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'layer_id',
      label: '数据分层',
      componentProps: {
        allowClear: true,
        options: [],
        placeholder: '请选择数据分层',
      },
    },
    {
      component: 'Input',
      fieldName: 'source_type',
      label: '来源类型',
      help: '例如：datasource, crawler, etl',
    },
    {
      component: 'InputNumber',
      fieldName: 'lifecycle_days',
      label: '生命周期（天）',
      help: '留空表示永久保存',
      componentProps: {
        class: 'w-full',
        min: 1,
      },
    },
    {
      component: 'Textarea',
      fieldName: 'schema_config',
      label: 'Schema 配置',
      help: 'JSON 格式，定义数据集的字段结构',
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '描述',
    },
  ];
}
