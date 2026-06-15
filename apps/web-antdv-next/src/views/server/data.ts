import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { ServerResult } from '#/api';

import { $t } from '@vben/locales';

import { SERVER_PROTOCOL_OPTIONS } from '#/api';

/** 连接状态 */
export const SERVER_STATUS_OPTIONS = [
  { label: '离线', value: 0, color: 'error' },
  { label: '在线', value: 1, color: 'success' },
];

/** 查询表单 */
export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '服务器名称',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: SERVER_PROTOCOL_OPTIONS,
      placeholder: '请选择协议',
    },
    fieldName: 'protocol',
    label: '连接协议',
  },
  {
    component: 'Input',
    fieldName: 'ip',
    label: 'IP 地址',
  },
];

/** 表格列 */
export function useColumns(
  onActionClick?: OnActionClickFn<ServerResult>,
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
      field: 'protocol',
      title: '连接协议',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: SERVER_PROTOCOL_OPTIONS,
      },
    },
    {
      field: 'ip',
      title: 'IP 地址',
      width: 140,
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
      title: '连接状态',
      width: 90,
      cellRender: {
        name: 'CellTag',
        options: SERVER_STATUS_OPTIONS,
      },
    },
    {
      field: 'remark',
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
    component: 'Select',
    componentProps: {
      options: SERVER_PROTOCOL_OPTIONS,
      placeholder: '请选择连接协议',
      onChange: (value: string) => {
        const option = SERVER_PROTOCOL_OPTIONS.find(
          (p) => p.value === value,
        );
        if (option) {
          // 自动填充协议默认端口
          const portField = document.querySelector(
            '[data-field-name="port"] input',
          ) as HTMLInputElement;
          if (portField) {
            portField.value = String(option.port);
          }
        }
      },
    },
    fieldName: 'protocol',
    label: '连接协议',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'ip',
    label: 'IP 地址',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    componentProps: {
      min: 1,
      max: 65535,
      placeholder: '端口号',
    },
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
    component: 'Textarea',
    fieldName: 'remark',
    label: '备注',
  },
];
