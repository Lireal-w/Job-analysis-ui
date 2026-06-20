import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { DataLayerResult } from '#/api';

import { $t } from '@vben/locales';

export const LAYER_TYPE_OPTIONS = [
  { color: 'blue', label: 'ODS 原始数据层', value: 'ods' },
  { color: 'cyan', label: 'DWD 明细数据层', value: 'dwd' },
  { color: 'green', label: 'DWS 汇总数据层', value: 'dws' },
  { color: 'purple', label: 'ADS 应用数据层', value: 'ads' },
  { color: 'orange', label: 'DIM 维度数据层', value: 'dim' },
];

export const LAYER_TYPE_COLORS: Record<string, string> = {
  ods: 'blue',
  dwd: 'cyan',
  dws: 'green',
  ads: 'purple',
  dim: 'orange',
};

export const LAYER_TYPE_MAP: Record<string, string> = {
  ods: 'ODS 原始数据层',
  dwd: 'DWD 明细数据层',
  dws: 'DWS 汇总数据层',
  ads: 'ADS 应用数据层',
  dim: 'DIM 维度数据层',
};

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '分层名称',
  },
  {
    component: 'Select',
    fieldName: 'layer_type',
    label: '分层类型',
    componentProps: {
      allowClear: true,
      options: LAYER_TYPE_OPTIONS,
      placeholder: $t('common.form.select'),
    },
  },
];

export function useColumns(
  onActionClick?: OnActionClickFn<DataLayerResult>,
): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    { field: 'name', title: '分层名称', minWidth: 140 },
    {
      field: 'layer_type',
      title: '分层类型',
      width: 150,
      cellRender: {
        name: 'CellTag',
        options: LAYER_TYPE_OPTIONS,
      },
    },
    {
      field: 'description',
      title: '描述',
      minWidth: 180,
      showOverflow: true,
      formatter({ cellValue }) {
        return cellValue || '-';
      },
    },
    {
      field: 'sort',
      title: '排序',
      width: 80,
      align: 'center',
    },
    {
      field: 'created_time',
      title: $t('common.table.created_time'),
      width: 168,
    },
    {
      field: 'updated_time',
      title: $t('common.table.updated_time'),
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
      width: 180,
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

export function useCreateSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '分层名称',
      rules: 'required',
    },
    {
      component: 'Select',
      fieldName: 'layer_type',
      label: '分层类型',
      rules: 'selectRequired',
      componentProps: {
        allowClear: false,
        options: LAYER_TYPE_OPTIONS,
        placeholder: '请选择分层类型',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '描述',
    },
    {
      component: 'InputNumber',
      fieldName: 'sort',
      label: '排序',
      help: '数字越小越靠前',
      componentProps: {
        class: 'w-full',
        min: 0,
      },
    },
  ];
}
