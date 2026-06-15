import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { SSHServerResult } from '#/api';

import { $t } from '@vben/locales';

/** 连接状态 */
export const SERVER_STATUS_OPTIONS = [
  { label: '停用', value: 0, color: 'error' },
  { label: '正常', value: 1, color: 'success' },
];

/** 查询表单 */
export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '服务器名称',
  },
];

/** 表格列 */
export function useColumns(
  onActionClick?: OnActionClickFn<SSHServerResult>,
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
      title: '服务器名称',
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
      field: 'username',
      title: '用户名',
      width: 120,
    },
    {
      field: 'status',
      title: '状态',
      width: 80,
      cellRender: {
        name: 'CellTag',
        options: SERVER_STATUS_OPTIONS,
      },
    },
    {
      field: 'description',
      title: $t('common.table.mark'),
      minWidth: 120,
      showOverflow: 'ellipsis',
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
      width: 200,
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'test',
            text: '测试连接',
          },
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
    label: '服务器名称',
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
    defaultValue: 22,
    fieldName: 'port',
    label: '端口',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'username',
    label: '用户名',
    rules: 'required',
  },
  {
    component: 'InputPassword',
    fieldName: 'password',
    label: '密码',
  },
  {
    component: 'Input',
    fieldName: 'ssh_key',
    label: 'SSH 密钥',
  },
  {
    component: 'Textarea',
    fieldName: 'description',
    label: '描述',
  },
];
