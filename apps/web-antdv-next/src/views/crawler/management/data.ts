
import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';

import { $t } from '@vben/locales';

export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '爬虫名称',
  },
  {
    component: 'Select',
    fieldName: 'status',
    label: $t('common.form.status'),
    componentProps: {
      options: [
        { label: '运行中', value: 1 },
        { label: '已停止', value: 0 },
        { label: '异常', value: 2 },
      ],
      placeholder: $t('common.form.select'),
    },
  },
  {
    component: 'Select',
    fieldName: 'type',
    label: '爬虫类型',
    componentProps: {
      options: [
        { label: '网页爬虫', value: 'web' },
        { label: 'API 爬虫', value: 'api' },
        { label: '数据库爬虫', value: 'db' },
      ],
      placeholder: $t('common.form.select'),
    },
  },
];

export interface CrawlerRecord {
  id: number;
  name: string;
  type: string;
  status: number;
  target_url: string;
  schedule: string;
  last_run_time: string;
  next_run_time: string;
  total_count: number;
  success_count: number;
  fail_count: number;
  created_time: string;
  updated_time: string | null;
  remark: string | null;
}

export function useColumns(
  onActionClick?: OnActionClickFn<CrawlerRecord>,
): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    { field: 'name', title: '爬虫名称', minWidth: 140 },
    {
      field: 'type',
      title: '爬虫类型',
      width: 110,
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'processing', label: '网页爬虫', value: 'web' },
          { color: 'success', label: 'API 爬虫', value: 'api' },
          { color: 'warning', label: '数据库爬虫', value: 'db' },
        ],
      },
    },
    {
      field: 'status',
      title: $t('common.form.status'),
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'success', label: '运行中', value: 1 },
          { color: 'default', label: '已停止', value: 0 },
          { color: 'error', label: '异常', value: 2 },
        ],
      },
    },
    { field: 'target_url', title: '目标地址', minWidth: 180, showOverflow: true },
    { field: 'schedule', title: '调度规则', width: 120 },
    { field: 'total_count', title: '总采集数', width: 100 },
    { field: 'success_count', title: '成功数', width: 90 },
    { field: 'fail_count', title: '失败数', width: 90 },
    { field: 'last_run_time', title: '上次运行', width: 168 },
    { field: 'next_run_time', title: '下次运行', width: 168 },
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
          { code: 'start', text: '启动' },
          { code: 'stop', text: '停止' },
          { code: 'delete', text: '删除' },
        ],
      },
    },
  ];
}

/** 静态模拟数据 */
export const mockCrawlerData: CrawlerRecord[] = [
  {
    id: 1,
    name: '新闻资讯爬虫',
    type: 'web',
    status: 1,
    target_url: 'https://news.example.com',
    schedule: '0 */2 * * *',
    last_run_time: '2026-05-03 10:00:00',
    next_run_time: '2026-05-03 12:00:00',
    total_count: 12580,
    success_count: 12450,
    fail_count: 130,
    created_time: '2026-01-15 08:00:00',
    updated_time: null,
    remark: '采集主流新闻网站资讯',
  },
  {
    id: 2,
    name: '电商商品爬虫',
    type: 'api',
    status: 1,
    target_url: 'https://api.shop.example.com/v2/products',
    schedule: '0 8 * * *',
    last_run_time: '2026-05-03 08:00:00',
    next_run_time: '2026-05-04 08:00:00',
    total_count: 8960,
    success_count: 8900,
    fail_count: 60,
    created_time: '2026-02-10 10:30:00',
    updated_time: '2026-03-20 14:00:00',
    remark: '采集电商平台商品数据',
  },
  {
    id: 3,
    name: '社交媒体爬虫',
    type: 'web',
    status: 0,
    target_url: 'https://social.example.com/feed',
    schedule: '0 */6 * * *',
    last_run_time: '2026-05-02 18:00:00',
    next_run_time: '-',
    total_count: 5430,
    success_count: 5380,
    fail_count: 50,
    created_time: '2026-03-01 09:00:00',
    updated_time: null,
    remark: '采集社交媒体公开内容',
  },
  {
    id: 4,
    name: '数据库同步爬虫',
    type: 'db',
    status: 2,
    target_url: 'mysql://db.example.com:3306/source_db',
    schedule: '0 0 * * *',
    last_run_time: '2026-05-03 00:00:00',
    next_run_time: '-',
    total_count: 3200,
    success_count: 3100,
    fail_count: 100,
    created_time: '2026-01-20 14:00:00',
    updated_time: '2026-04-15 09:30:00',
    remark: '从外部数据库同步数据',
  },
  {
    id: 5,
    name: '天气数据爬虫',
    type: 'api',
    status: 1,
    target_url: 'https://api.weather.example.com/v1/daily',
    schedule: '0 6,18 * * *',
    last_run_time: '2026-05-03 06:00:00',
    next_run_time: '2026-05-03 18:00:00',
    total_count: 2100,
    success_count: 2100,
    fail_count: 0,
    created_time: '2026-02-28 11:00:00',
    updated_time: null,
    remark: '采集全国主要城市天气数据',
  },
  {
    id: 6,
    name: '招聘信息爬虫',
    type: 'web',
    status: 1,
    target_url: 'https://jobs.example.com/list',
    schedule: '0 */4 * * *',
    last_run_time: '2026-05-03 08:00:00',
    next_run_time: '2026-05-03 12:00:00',
    total_count: 6780,
    success_count: 6700,
    fail_count: 80,
    created_time: '2026-03-15 16:00:00',
    updated_time: null,
    remark: '采集主流招聘网站职位信息',
  },
  {
    id: 7,
    name: '房产数据爬虫',
    type: 'web',
    status: 0,
    target_url: 'https://house.example.com/city/sh',
    schedule: '0 10 * * 1-5',
    last_run_time: '2026-05-02 10:00:00',
    next_run_time: '-',
    total_count: 4320,
    success_count: 4280,
    fail_count: 40,
    created_time: '2026-04-01 08:00:00',
    updated_time: null,
    remark: '采集房产网站房源数据',
  },
  {
    id: 8,
    name: '学术论文爬虫',
    type: 'api',
    status: 1,
    target_url: 'https://api.paper.example.com/search',
    schedule: '0 2 * * *',
    last_run_time: '2026-05-03 02:00:00',
    next_run_time: '2026-05-04 02:00:00',
    total_count: 980,
    success_count: 975,
    fail_count: 5,
    created_time: '2026-04-10 13:00:00',
    updated_time: null,
    remark: '采集学术论文元数据',
  },
];
