import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { ReportResult } from '#/api';

import { $t } from '@vben/locales';

export const STATUS_OPTIONS = [
  { label: '草稿', value: 0 },
  { label: '已发布', value: 1 },
  { label: '已归档', value: 2 },
];

export const STATUS_COLORS: Record<number, string> = {
  0: 'default',
  1: 'green',
  2: 'orange',
};

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '报表名称',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: STATUS_OPTIONS,
      placeholder: $t('common.form.select'),
    },
    fieldName: 'status',
    label: '状态',
  },
];

export function useColumns(
  onActionClick?: OnActionClickFn<ReportResult>,
): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    { field: 'name', title: '报表名称', minWidth: 160 },
    {
      field: 'description',
      title: '描述',
      minWidth: 200,
      showOverflow: true,
      formatter({ cellValue }) {
        return cellValue || '-';
      },
    },
    {
      field: 'theme',
      title: '主题',
      width: 100,
    },
    {
      field: 'status',
      title: $t('common.form.status'),
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: STATUS_OPTIONS.map((t) => ({
          ...t,
          color: STATUS_COLORS[t.value] || 'default',
        })),
      },
    },
    {
      field: 'refresh_interval',
      title: '刷新间隔',
      width: 100,
      formatter({ cellValue }) {
        return cellValue ? `${cellValue}s` : '-';
      },
    },
    {
      field: 'is_public',
      title: '公开',
      width: 80,
      cellRender: {
        name: 'CellTag',
        options: [
          { label: '是', value: true, color: 'green' },
          { label: '否', value: false, color: 'default' },
        ],
      },
    },
    {
      field: 'created_time',
      title: '创建时间',
      width: 168,
    },
    {
      field: 'updated_time',
      title: '更新时间',
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
      width: 200,
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'design',
            text: '设计',
          },
          'edit',
          'delete',
        ],
      },
    },
  ];
}
