import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { WorkerResult } from '#/api';

import { $t } from '@vben/locales';

/** Worker 状态 */
export const WORKER_STATUS_OPTIONS = [
  { label: '在线', value: 'online', color: 'success' },
  { label: '离线', value: 'offline', color: '#999' },
  { label: '忙碌', value: 'busy', color: 'orange' },
];

/** 查询表单 */
export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '节点名称',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: WORKER_STATUS_OPTIONS,
    },
    fieldName: 'status',
    label: '状态',
  },
];

/** 表格列 */
export function useColumns(
  onActionClick?: OnActionClickFn<WorkerResult>,
): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    {
      field: 'name',
      title: '节点名称',
      minWidth: 150,
    },
    {
      field: 'host',
      title: '主机地址',
      width: 150,
    },
    {
      field: 'port',
      title: '端口',
      width: 80,
    },
    {
      field: 'status',
      title: '状态',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: WORKER_STATUS_OPTIONS,
      },
    },
    {
      field: 'tags',
      title: '标签',
      width: 120,
      showOverflow: 'ellipsis',
    },
    {
      field: 'max_tasks',
      title: '最大任务数',
      width: 100,
    },
    {
      field: 'task_count',
      title: '当前任务数',
      width: 100,
    },
    {
      field: 'cpu_usage',
      title: 'CPU 使用率',
      width: 100,
      cellRender: {
        name: 'CellProgress',
      },
      formatter: ({ cellValue }: { cellValue: number | null }) => {
        if (cellValue === null || cellValue === undefined) return '-';
        return `${(cellValue * 100).toFixed(1)}%`;
      },
    },
    {
      field: 'memory_usage',
      title: '内存使用率',
      width: 100,
      cellRender: {
        name: 'CellProgress',
      },
      formatter: ({ cellValue }: { cellValue: number | null }) => {
        if (cellValue === null || cellValue === undefined) return '-';
        return `${(cellValue * 100).toFixed(1)}%`;
      },
    },
    {
      field: 'version',
      title: '版本',
      width: 100,
    },
    {
      field: 'description',
      title: $t('common.table.mark'),
      minWidth: 120,
      showOverflow: 'ellipsis',
    },
    {
      field: 'last_heartbeat',
      title: '最后心跳',
      width: 168,
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
        options: [
          'edit',
          {
            code: 'delete',
          },
        ],
      },
    },
  ];
}

/** 创建/编辑表单 */
export const formSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '节点名称',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'host',
    label: '主机地址',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    componentProps: {
      min: 1,
      max: 65535,
      placeholder: '端口号',
    },
    defaultValue: 8001,
    fieldName: 'port',
    label: '端口',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'tags',
    label: '标签',
    componentProps: {
      placeholder: '多个标签用逗号分隔',
    },
  },
  {
    component: 'InputNumber',
    componentProps: {
      min: 1,
      max: 100,
      placeholder: '最大并发任务数',
    },
    defaultValue: 5,
    fieldName: 'max_tasks',
    label: '最大任务数',
  },
  {
    component: 'Textarea',
    fieldName: 'description',
    label: '描述',
  },
];
