import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { DataFlowResult } from '#/api';

import { $t } from '@vben/locales';

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '流程名称',
  },
  {
    component: 'Select',
    fieldName: 'status',
    label: $t('common.form.status'),
    componentProps: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已发布', value: 'published' },
        { label: '已归档', value: 'archived' },
      ],
      placeholder: $t('common.form.select'),
    },
  },
];

const STATUS_OPTIONS = [
  { color: 'warning', label: '草稿', value: 'draft' },
  { color: 'success', label: '已发布', value: 'published' },
  { color: 'default', label: '已归档', value: 'archived' },
];

export function useColumns(
  onActionClick?: OnActionClickFn<DataFlowResult>,
): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    { field: 'name', title: '流程名称', minWidth: 140 },
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
      field: 'status',
      title: $t('common.form.status'),
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: STATUS_OPTIONS,
      },
    },
    { field: 'version', title: '版本号', width: 80 },
    {
      field: 'enabled',
      title: '启用状态',
      width: 100,
      cellRender: {
        name: 'CellSwitch',
        attrs: {
          beforeChange: async (_newVal: boolean, row: DataFlowResult) => {
            return row.status === 'published';
          },
        },
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
            code: 'run',
            text: '运行',
          },
          {
            code: 'publish',
            text: '发布',
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
      label: '流程名称',
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '描述',
    },
    {
      component: 'Input',
      fieldName: 'nodes',
      label: '节点配置',
      help: 'JSON 格式，用于描述数据流节点',
    },
    {
      component: 'Input',
      fieldName: 'edges',
      label: '边配置',
      help: 'JSON 格式，用于描述数据流连接关系',
    },
  ];
}
