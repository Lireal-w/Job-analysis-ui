
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

const LAST_STATUS_OPTIONS = [
  { color: 'success', label: '成功', value: 'completed' },
  { color: 'error', label: '失败', value: 'failed' },
  { color: 'warning', label: '运行中', value: 'running' },
  { color: 'default', label: '无', value: null },
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
      title: '当前状态',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: STATUS_OPTIONS,
      },
    },
    {
      field: 'total_run_count',
      title: '执行次数',
      width: 90,
    },
    {
      field: 'total_records',
      title: '采集总数',
      width: 100,
    },
    { field: 'last_run_time', title: '上次运行', width: 168 },
    {
      field: 'last_duration',
      title: '上次耗时(s)',
      width: 110,
      formatter({ cellValue }) {
        return cellValue != null ? String(cellValue) : '-';
      },
    },
    {
      field: 'last_status',
      title: '上次状态',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: LAST_STATUS_OPTIONS,
      },
    },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 100,
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [{ code: 'details', text: '详情' }],
      },
    },
  ];
}
