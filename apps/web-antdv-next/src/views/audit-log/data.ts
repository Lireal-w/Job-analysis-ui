import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { AuditLogResult } from '#/api';

import { $t } from '@vben/locales';

export const EVENT_TYPES = [
  { label: '登录', value: 'login' },
  { label: '登出', value: 'logout' },
  { label: '创建', value: 'create' },
  { label: '更新', value: 'update' },
  { label: '删除', value: 'delete' },
  { label: '查询', value: 'query' },
  { label: '导出', value: 'export' },
  { label: '导入', value: 'import' },
  { label: '其他', value: 'other' },
];

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: EVENT_TYPES,
      placeholder: $t('common.form.select'),
    },
    fieldName: 'event_type',
    label: '事件类型',
  },
  {
    component: 'Input',
    fieldName: 'username',
    label: '用户名',
  },
  {
    component: 'Input',
    fieldName: 'ip',
    label: 'IP 地址',
  },
  {
    component: 'DatePicker',
    fieldName: 'start_date',
    label: '开始日期',
    componentProps: {
      placeholder: '开始日期',
      valueFormat: 'YYYY-MM-DD',
    },
  },
  {
    component: 'DatePicker',
    fieldName: 'end_date',
    label: '结束日期',
    componentProps: {
      placeholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
    },
  },
];

export function useColumns(
  onActionClick?: OnActionClickFn<AuditLogResult>,
): VxeGridProps['columns'] {
  return [
    { field: 'checkbox', type: 'checkbox', align: 'left', width: 50 },
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    { field: 'username', title: '用户名', width: 100 },
    {
      field: 'event_type',
      title: '事件类型',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: EVENT_TYPES,
      },
    },
    { field: 'action', title: '操作', minWidth: 120 },
    {
      field: 'resource_type',
      title: '资源类型',
      width: 100,
      formatter({ cellValue }) {
        return cellValue || '-';
      },
    },
    { field: 'resource_name', title: '资源名称', width: 140 },
    { field: 'ip', title: 'IP 地址', width: 130 },
    {
      field: 'request_method',
      title: '请求方法',
      width: 110,
      formatter({ cellValue }) {
        return cellValue || '-';
      },
    },
    { field: 'request_path', title: '请求路径', minWidth: 200, showOverflow: true },
    {
      field: 'response_code',
      title: '状态码',
      width: 80,
      formatter({ cellValue }) {
        return cellValue != null ? String(cellValue) : '-';
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
