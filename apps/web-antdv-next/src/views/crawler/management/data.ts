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

const STATUS_OPTIONS = [
  { color: 'processing', label: '运行中', value: 'running' },
  { color: 'default', label: '已停止', value: 'stopped' },
  { color: 'error', label: '异常', value: 'failed' },
  { color: 'warning', label: '待执行', value: 'pending' },
  { color: 'success', label: '已完成', value: 'completed' },
];

const CRAWL_MODE_OPTIONS = [
  { color: 'blue', label: '全量采集', value: 'full' },
  { color: 'cyan', label: '增量采集', value: 'incremental' },
];

const TARGET_STORAGE_OPTIONS = [
  { color: 'purple', label: '数据库', value: 'database' },
  { color: 'green', label: '文件系统', value: 'filesystem' },
  { color: 'orange', label: '消息队列', value: 'message_queue' },
  { color: 'geekblue', label: '自定义 API', value: 'custom_api' },
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
        options: [
          { color: 'blue', label: 'Crontab', value: 'crontab' },
          { color: 'cyan', label: '间隔', value: 'interval' },
          { color: 'default', label: '手动', value: 'manual' },
        ],
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
      width: 250,
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          { code: 'start', text: '启动' },
          { code: 'stop', text: '停止' },
          { code: 'delete', text: '删除' },
        ],
      },
    },
  ];
}
