import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { DatasourceResult } from '#/api';

import { $t } from '@vben/locales';

export const DATASOURCE_TYPES = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'SQLite', value: 'sqlite' },
  { label: 'MongoDB', value: 'mongodb' },
  { label: 'Redis', value: 'redis' },
  { label: 'SQL Server', value: 'mssql' },
  { label: 'Oracle', value: 'oracle' },
  { label: 'REST API', value: 'api_rest' },
  { label: 'CSV 文件', value: 'file_csv' },
  { label: 'Excel 文件', value: 'file_excel' },
  { label: 'JSON 文件', value: 'file_json' },
  { label: 'Kafka', value: 'kafka' },
  { label: 'S3/OSS', value: 's3' },
];

export const DB_TYPE_COLORS: Record<string, string> = {
  mysql: 'blue',
  postgresql: 'cyan',
  sqlite: 'orange',
  mongodb: 'green',
  redis: 'red',
  mssql: 'purple',
  oracle: 'volcano',
  api_rest: 'geekblue',
  file_csv: 'lime',
  file_excel: 'green',
  file_json: 'gold',
  kafka: 'magenta',
  s3: 'volcano',
};

export const DEFAULT_PORTS: Record<string, number> = {
  mysql: 3306,
  postgresql: 5432,
  sqlite: 0,
  mongodb: 27_017,
  redis: 6379,
  mssql: 1433,
  oracle: 1521,
  api_rest: 0,
  file_csv: 0,
  file_excel: 0,
  file_json: 0,
  kafka: 9092,
  s3: 0,
};

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '数据源名称',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: DATASOURCE_TYPES,
      placeholder: $t('common.form.select'),
    },
    fieldName: 'db_type',
    label: '数据库类型',
  },
];

export function useColumns(
  onActionClick?: OnActionClickFn<DatasourceResult>,
): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    { field: 'name', title: '数据源名称', minWidth: 140 },
    {
      field: 'db_type',
      title: '数据库类型',
      width: 120,
      cellRender: {
        name: 'CellTag',
        options: DATASOURCE_TYPES.map((t) => ({
          ...t,
          color: DB_TYPE_COLORS[t.value] || 'default',
        })),
      },
    },
    { field: 'host', title: '主机地址', width: 140 },
    { field: 'port', title: '端口', width: 80 },
    {
      field: 'database_name',
      title: '数据库名',
      width: 140,
      formatter({ cellValue }) {
        return cellValue || '-';
      },
    },
    {
      field: 'status',
      title: $t('common.form.status'),
      width: 100,
      slots: { default: 'status' },
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
      title: '创建时间',
      width: 168,
    },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 250,
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit',
          {
            code: 'test_connection',
            text: '测试连接',
          },
          'delete',
        ],
      },
    },
  ];
}

function getDbTypeOptions() {
  return DATASOURCE_TYPES;
}

export function useCreateSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '数据源名称',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        options: getDbTypeOptions(),
        placeholder: '请选择数据库类型',
      },
      fieldName: 'db_type',
      label: '数据库类型',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      fieldName: 'host',
      label: '主机地址',
      help: '例如：localhost 或 192.168.1.100',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 1,
        max: 65_535,
      },
      fieldName: 'port',
      label: '端口',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'database_name',
      label: '数据库名称',
    },
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户名',
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: '密码',
    },
    {
      component: 'Textarea',
      fieldName: 'extra_params',
      label: '额外参数',
      help: 'JSON 格式，例如：{"charset": "utf8mb4"}',
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '描述',
    },
  ];
}

export function useEditSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '数据源名称',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        options: getDbTypeOptions(),
        placeholder: '请选择数据库类型',
      },
      fieldName: 'db_type',
      label: '数据库类型',
      rules: 'selectRequired',
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
        class: 'w-full',
        min: 1,
        max: 65_535,
      },
      fieldName: 'port',
      label: '端口',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'database_name',
      label: '数据库名称',
    },
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户名',
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: '密码',
      help: '留空则不修改密码',
    },
    {
      component: 'Textarea',
      fieldName: 'extra_params',
      label: '额外参数',
      help: 'JSON 格式，例如：{"charset": "utf8mb4"}',
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '描述',
    },
  ];
}
