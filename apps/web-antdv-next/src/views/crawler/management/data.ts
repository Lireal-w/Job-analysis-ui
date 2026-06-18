import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { CrawlTaskResult } from '#/api';

import { $t } from '@vben/locales';

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '任务名称',
  },
  {
    component: 'Select',
    fieldName: 'status',
    label: $t('common.form.status'),
    componentProps: {
      options: [
        { label: '运行中', value: 'running' },
        { label: '已停止', value: 'stopped' },
        { label: '异常', value: 'failed' },
        { label: '待执行', value: 'pending' },
        { label: '已完成', value: 'completed' },
      ],
      placeholder: $t('common.form.select'),
    },
  },
  {
    component: 'Select',
    fieldName: 'crawl_mode',
    label: '采集模式',
    componentProps: {
      options: [
        { label: '全量采集', value: 'full' },
        { label: '增量采集', value: 'incremental' },
      ],
      placeholder: $t('common.form.select'),
    },
  },
];

export const STATUS_OPTIONS = [
  { color: 'processing', label: '运行中', value: 'running' },
  { color: 'default', label: '已停止', value: 'stopped' },
  { color: 'error', label: '异常', value: 'failed' },
  { color: 'warning', label: '待执行', value: 'pending' },
  { color: 'success', label: '已完成', value: 'completed' },
];

export const CRAWL_MODE_OPTIONS = [
  { color: 'blue', label: '全量采集', value: 'full' },
  { color: 'cyan', label: '增量采集', value: 'incremental' },
];

export const TARGET_STORAGE_OPTIONS = [
  { color: 'purple', label: '数据库', value: 'database' },
  { color: 'green', label: '文件系统', value: 'filesystem' },
  { color: 'orange', label: '消息队列', value: 'message_queue' },
  { color: 'geekblue', label: '自定义 API', value: 'custom_api' },
];

export const SCHEDULE_TYPE_OPTIONS = [
  { color: 'blue', label: 'Crontab', value: 'crontab' },
  { color: 'cyan', label: '间隔', value: 'interval' },
  { color: 'default', label: '手动', value: 'manual' },
];

export function useColumns(
  onActionClick?: OnActionClickFn<CrawlTaskResult>,
): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    { field: 'name', title: '任务名称', minWidth: 140 },
    {
      field: 'crawl_mode',
      title: '采集模式',
      width: 110,
      cellRender: {
        name: 'CellTag',
        options: CRAWL_MODE_OPTIONS,
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
      field: 'target_storage',
      title: '目标存储',
      width: 110,
      cellRender: {
        name: 'CellTag',
        options: TARGET_STORAGE_OPTIONS,
      },
    },
    {
      field: 'schedule_type',
      title: '调度方式',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: SCHEDULE_TYPE_OPTIONS,
      },
    },
    { field: 'total_records', title: '采集总数', width: 100 },
    { field: 'total_run_count', title: '执行次数', width: 100 },
    { field: 'last_run_time', title: '上次运行', width: 168 },
    { field: 'last_duration', title: '上次耗时(s)', width: 110 },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 310,
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          { code: 'view', text: '查看' },
          { code: 'edit', text: '编辑' },
          { code: 'start', text: '启动' },
          { code: 'stop', text: '停止' },
          { code: 'trigger', text: '触发' },
          { code: 'delete', text: '删除' },
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
      label: '任务名称',
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '任务描述',
    },
    {
      component: 'Input',
      fieldName: 'tags',
      label: '标签',
      help: '多个标签用逗号分隔',
    },
    {
      component: 'Select',
      fieldName: 'source_datasource_id',
      label: '源数据源',
      rules: 'selectRequired',
      help: '选择要采集的数据源',
      componentProps: {
        allowClear: false,
        placeholder: '请选择源数据源',
        options: [],
      },
    },
    {
      component: 'Select',
      fieldName: 'crawl_mode',
      label: '采集模式',
      componentProps: {
        allowClear: false,
        options: [
          { label: '全量采集', value: 'full' },
          { label: '增量采集', value: 'incremental' },
        ],
        placeholder: '请选择采集模式',
      },
    },
    {
      component: 'Input',
      fieldName: 'incremental_key',
      label: '增量键',
      help: '增量采集的时间字段名，如 updated_at',
      dependencies: {
        show: (values) => values?.crawl_mode === 'incremental',
        triggerFields: ['crawl_mode'],
      },
    },
    {
      component: 'Input',
      fieldName: 'incremental_start',
      label: '增量起始值',
      help: '增量采集的起始时间，如 2024-01-01T00:00:00',
      dependencies: {
        show: (values) => values?.crawl_mode === 'incremental',
        triggerFields: ['crawl_mode'],
      },
    },
    {
      component: 'Select',
      fieldName: 'target_storage',
      label: '目标存储',
      rules: 'selectRequired',
      componentProps: {
        allowClear: false,
        options: [
          { label: '数据库', value: 'database' },
          { label: '文件系统', value: 'filesystem' },
          { label: '消息队列', value: 'message_queue' },
          { label: '自定义 API', value: 'custom_api' },
        ],
        placeholder: '请选择目标存储类型',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'target_datasource_id',
      label: '目标数据源ID',
      help: '当目标存储为数据库时，填写目标数据源ID',
      dependencies: {
        show: (values) => values?.target_storage === 'database',
        triggerFields: ['target_storage'],
      },
    },
    {
      component: 'Textarea',
      fieldName: 'source_config',
      label: '源配置(JSON)',
      help: '可选，JSON格式的源数据配置',
    },
    {
      component: 'Textarea',
      fieldName: 'target_config',
      label: '目标配置(JSON)',
      help: '可选，JSON格式的目标存储配置',
    },
    {
      component: 'Select',
      fieldName: 'schedule_type',
      label: '调度方式',
      componentProps: {
        allowClear: false,
        options: [
          { label: '手动', value: 'manual' },
          { label: 'Crontab', value: 'crontab' },
          { label: '间隔', value: 'interval' },
        ],
        placeholder: '请选择调度方式',
      },
    },
    {
      component: 'Input',
      fieldName: 'cron_expr',
      label: 'Crontab 表达式',
      help: '如：0 0 * * * 表示每天凌晨执行',
      dependencies: {
        show: (values) => values?.schedule_type === 'crontab',
        triggerFields: ['schedule_type'],
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'interval_seconds',
      label: '间隔秒数',
      dependencies: {
        show: (values) => values?.schedule_type === 'interval',
        triggerFields: ['schedule_type'],
      },
      componentProps: {
        class: 'w-full',
        min: 1,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'concurrency',
      label: '并发数',
      componentProps: {
        class: 'w-full',
        min: 1,
        max: 100,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'batch_size',
      label: '批量大小',
      componentProps: {
        class: 'w-full',
        min: 10,
        max: 10000,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'rate_limit',
      label: '速率限制(条/秒)',
      componentProps: {
        class: 'w-full',
        min: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'priority',
      label: '优先级',
      help: '数值越大优先级越高',
      componentProps: {
        class: 'w-full',
        min: 0,
        max: 10,
      },
    },
    {
      component: 'Switch',
      fieldName: 'retry_enabled',
      label: '启用重试',
      componentProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'max_retries',
      label: '最大重试次数',
      dependencies: {
        show: (values) => values?.retry_enabled === true,
        triggerFields: ['retry_enabled'],
      },
      componentProps: {
        class: 'w-full',
        min: 1,
        max: 10,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'retry_delay',
      label: '重试延迟(秒)',
      dependencies: {
        show: (values) => values?.retry_enabled === true,
        triggerFields: ['retry_enabled'],
      },
      componentProps: {
        class: 'w-full',
        min: 1,
      },
    },
    {
      component: 'Switch',
      fieldName: 'retry_backoff',
      label: '启用回退策略',
      help: '每次重试间隔递增',
      dependencies: {
        show: (values) => values?.retry_enabled === true,
        triggerFields: ['retry_enabled'],
      },
      componentProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
    },
  ];
}
