
import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';

import { $t } from '@vben/locales';

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'crawler_name',
    label: '爬虫名称',
  },
  {
    component: 'Select',
    fieldName: 'status',
    label: $t('common.form.status'),
    componentProps: {
      options: [
        { label: '成功', value: 1 },
        { label: '失败', value: 0 },
      ],
      placeholder: $t('common.form.select'),
    },
  },
  {
    component: 'RangePicker',
    fieldName: 'run_time',
    label: '执行时间',
  },
];

export interface AnalysisRecord {
  id: number;
  crawler_name: string;
  task_id: string;
  status: number;
  start_time: string;
  end_time: string;
  cost_time: number;
  data_count: number;
  error_count: number;
  avg_speed: number;
  data_size: string;
  created_time: string;
}

export function useColumns(
  onActionClick?: OnActionClickFn<AnalysisRecord>,
): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    { field: 'crawler_name', title: '爬虫名称', minWidth: 140 },
    { field: 'task_id', title: '任务 ID', minWidth: 180, showOverflow: true },
    {
      field: 'status',
      title: $t('common.form.status'),
      width: 90,
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'success', label: '成功', value: 1 },
          { color: 'error', label: '失败', value: 0 },
        ],
      },
    },
    { field: 'start_time', title: '开始时间', width: 168 },
    { field: 'end_time', title: '结束时间', width: 168 },
    {
      field: 'cost_time',
      title: '耗时(秒)',
      width: 100,
    },
    {
      field: 'data_count',
      title: '采集数',
      width: 90,
    },
    {
      field: 'error_count',
      title: '错误数',
      width: 90,
    },
    {
      field: 'avg_speed',
      title: '平均速度(条/秒)',
      width: 140,
    },
    {
      field: 'data_size',
      title: '数据量',
      width: 100,
    },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 100,
      cellRender: {
        attrs: {
          nameField: 'crawler_name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          { code: 'details', text: '详情' },
        ],
      },
    },
  ];
}

/** 静态模拟数据 */
export const mockAnalysisData: AnalysisRecord[] = [
  {
    id: 1,
    crawler_name: '新闻资讯爬虫',
    task_id: 'task-20260503-001',
    status: 1,
    start_time: '2026-05-03 10:00:00',
    end_time: '2026-05-03 10:15:32',
    cost_time: 932,
    data_count: 1850,
    error_count: 12,
    avg_speed: 1.99,
    data_size: '23.5 MB',
    created_time: '2026-05-03 10:00:00',
  },
  {
    id: 2,
    crawler_name: '电商商品爬虫',
    task_id: 'task-20260503-002',
    status: 1,
    start_time: '2026-05-03 08:00:00',
    end_time: '2026-05-03 08:45:18',
    cost_time: 2718,
    data_count: 4320,
    error_count: 8,
    avg_speed: 1.59,
    data_size: '56.8 MB',
    created_time: '2026-05-03 08:00:00',
  },
  {
    id: 3,
    crawler_name: '社交媒体爬虫',
    task_id: 'task-20260502-003',
    status: 0,
    start_time: '2026-05-02 18:00:00',
    end_time: '2026-05-02 18:12:45',
    cost_time: 765,
    data_count: 320,
    error_count: 156,
    avg_speed: 0.42,
    data_size: '4.2 MB',
    created_time: '2026-05-02 18:00:00',
  },
  {
    id: 4,
    crawler_name: '数据库同步爬虫',
    task_id: 'task-20260503-004',
    status: 0,
    start_time: '2026-05-03 00:00:00',
    end_time: '2026-05-03 00:05:12',
    cost_time: 312,
    data_count: 180,
    error_count: 45,
    avg_speed: 0.58,
    data_size: '2.1 MB',
    created_time: '2026-05-03 00:00:00',
  },
  {
    id: 5,
    crawler_name: '天气数据爬虫',
    task_id: 'task-20260503-005',
    status: 1,
    start_time: '2026-05-03 06:00:00',
    end_time: '2026-05-03 06:02:15',
    cost_time: 135,
    data_count: 580,
    error_count: 0,
    avg_speed: 4.3,
    data_size: '1.8 MB',
    created_time: '2026-05-03 06:00:00',
  },
  {
    id: 6,
    crawler_name: '招聘信息爬虫',
    task_id: 'task-20260503-006',
    status: 1,
    start_time: '2026-05-03 08:00:00',
    end_time: '2026-05-03 08:28:40',
    cost_time: 1720,
    data_count: 2100,
    error_count: 15,
    avg_speed: 1.22,
    data_size: '18.6 MB',
    created_time: '2026-05-03 08:00:00',
  },
  {
    id: 7,
    crawler_name: '房产数据爬虫',
    task_id: 'task-20260502-007',
    status: 1,
    start_time: '2026-05-02 10:00:00',
    end_time: '2026-05-02 10:35:22',
    cost_time: 2122,
    data_count: 1560,
    error_count: 3,
    avg_speed: 0.74,
    data_size: '32.4 MB',
    created_time: '2026-05-02 10:00:00',
  },
  {
    id: 8,
    crawler_name: '学术论文爬虫',
    task_id: 'task-20260503-008',
    status: 1,
    start_time: '2026-05-03 02:00:00',
    end_time: '2026-05-03 02:18:50',
    cost_time: 1130,
    data_count: 920,
    error_count: 2,
    avg_speed: 0.81,
    data_size: '8.9 MB',
    created_time: '2026-05-03 02:00:00',
  },
  {
    id: 9,
    crawler_name: '新闻资讯爬虫',
    task_id: 'task-20260502-009',
    status: 1,
    start_time: '2026-05-02 10:00:00',
    end_time: '2026-05-02 10:12:08',
    cost_time: 728,
    data_count: 1620,
    error_count: 8,
    avg_speed: 2.23,
    data_size: '20.1 MB',
    created_time: '2026-05-02 10:00:00',
  },
  {
    id: 10,
    crawler_name: '电商商品爬虫',
    task_id: 'task-20260502-010',
    status: 1,
    start_time: '2026-05-02 08:00:00',
    end_time: '2026-05-02 08:52:30',
    cost_time: 3150,
    data_count: 4680,
    error_count: 12,
    avg_speed: 1.49,
    data_size: '61.3 MB',
    created_time: '2026-05-02 08:00:00',
  },
];

/** 统计概览数据 */
export const mockOverviewData = {
  totalTasks: 156,
  successTasks: 142,
  failTasks: 14,
  totalDataCount: 285600,
  todayDataCount: 8430,
  avgCostTime: 1280,
  avgSpeed: 1.68,
  totalDataSize: '1.2 GB',
};
