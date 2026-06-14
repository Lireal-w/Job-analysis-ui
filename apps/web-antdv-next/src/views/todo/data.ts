import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { TodoResult } from '#/api';

import { h } from 'vue';

import { $t } from '@vben/locales';

import { Tag } from 'antdv-next';

/** 任务类型选项 */
export const TASK_TYPE_OPTIONS = [
  { label: '每日任务', value: 0, color: 'blue' },
  { label: '周期任务', value: 1, color: 'orange' },
  { label: '定时任务', value: 2, color: 'purple' },
];

/** 任务状态选项 */
export const TASK_STATUS_OPTIONS = [
  { label: '待办', value: 0, color: 'default' },
  { label: '进行中', value: 1, color: 'processing' },
  { label: '已完成', value: 2, color: 'success' },
  { label: '已取消', value: 3, color: 'error' },
];

/** 任务优先级选项 */
export const TASK_PRIORITY_OPTIONS = [
  { label: '低', value: 0, color: 'green' },
  { label: '中', value: 1, color: 'blue' },
  { label: '高', value: 2, color: 'orange' },
  { label: '紧急', value: 3, color: 'red' },
];

/** 任务来源选项 */
export const TASK_SOURCE_OPTIONS = [
  { label: '上级分配', value: 0 },
  { label: '自己定制', value: 1 },
  { label: 'AI生成', value: 2 },
];

/** 目标状态选项 */
export const GOAL_STATUS_OPTIONS = [
  { label: '待开始', value: 0, color: 'default' },
  { label: '进行中', value: 1, color: 'processing' },
  { label: '已完成', value: 2, color: 'success' },
];

/** 渲染状态标签 */
export function renderStatusTag(status: number) {
  const option = TASK_STATUS_OPTIONS[status];
  return option
    ? h(Tag, { color: option.color }, () => option.label)
    : h('span', String(status));
}

/** 渲染优先级标签 */
export function renderPriorityTag(priority: number) {
  const option = TASK_PRIORITY_OPTIONS[priority];
  return option
    ? h(Tag, { color: option.color }, () => option.label)
    : h('span', String(priority));
}

/** 渲染任务类型标签 */
export function renderTaskTypeTag(taskType: number) {
  const option = TASK_TYPE_OPTIONS[taskType];
  return option
    ? h(Tag, { color: option.color }, () => option.label)
    : h('span', String(taskType));
}

/** 渲染目标状态标签 */
export function renderGoalStatusTag(status: number) {
  const option = GOAL_STATUS_OPTIONS[status];
  return option
    ? h(Tag, { color: option.color }, () => option.label)
    : h('span', String(status));
}

/** 查询表单 */
export const querySchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'title',
    label: '任务标题',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: TASK_TYPE_OPTIONS,
      placeholder: '请选择任务类型',
    },
    fieldName: 'task_type',
    label: '任务类型',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: TASK_STATUS_OPTIONS,
      placeholder: '请选择状态',
    },
    fieldName: 'status',
    label: '状态',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: TASK_PRIORITY_OPTIONS,
      placeholder: '请选择优先级',
    },
    fieldName: 'priority',
    label: '优先级',
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: TASK_SOURCE_OPTIONS,
      placeholder: '请选择来源',
    },
    fieldName: 'source',
    label: '来源',
  },
];

/** 表格列定义 */
export function useColumns(
  onActionClick?: OnActionClickFn<TodoResult>,
): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    {
      field: 'title',
      title: '任务标题',
      minWidth: 150,
      showOverflow: 'ellipsis',
    },
    {
      field: 'task_type',
      title: '任务类型',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: TASK_TYPE_OPTIONS,
      },
    },
    {
      field: 'priority',
      title: '优先级',
      width: 80,
      cellRender: {
        name: 'CellTag',
        options: TASK_PRIORITY_OPTIONS,
      },
    },
    {
      field: 'status',
      title: '状态',
      width: 90,
      cellRender: {
        name: 'CellTag',
        options: TASK_STATUS_OPTIONS,
      },
    },
    {
      field: 'progress',
      title: '进度',
      width: 120,
      cellRender: {
        name: 'CellProgress',
      },
    },
    {
      field: 'source',
      title: '来源',
      width: 90,
      cellRender: {
        name: 'CellTag',
        options: TASK_SOURCE_OPTIONS,
      },
    },
    {
      field: 'due_date',
      title: '截止时间',
      width: 168,
      formatter({ cellValue }) {
        return cellValue || '暂无';
      },
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
      width: 220,
      cellRender: {
        attrs: {
          nameField: 'title',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit',
          {
            code: 'goals',
            text: '目标管理',
          },
          {
            code: 'status',
            text: '更新状态',
          },
          {
            code: 'more',
            items: [
              { code: 'progress', text: '更新进度' },
              { code: 'delete', text: '删除' },
            ],
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
    fieldName: 'title',
    label: '任务标题',
    rules: 'required',
  },
  {
    component: 'Textarea',
    fieldName: 'description',
    label: '任务描述',
  },
  {
    component: 'Select',
    componentProps: {
      options: TASK_TYPE_OPTIONS,
    },
    defaultValue: 0,
    fieldName: 'task_type',
    label: '任务类型',
    rules: 'required',
  },
  {
    component: 'Select',
    componentProps: {
      options: TASK_PRIORITY_OPTIONS,
    },
    defaultValue: 1,
    fieldName: 'priority',
    label: '优先级',
    rules: 'required',
  },
  {
    component: 'Select',
    componentProps: {
      options: TASK_SOURCE_OPTIONS,
    },
    defaultValue: 1,
    fieldName: 'source',
    label: '来源',
    rules: 'required',
  },
  {
    component: 'DatePicker',
    componentProps: {
      class: 'w-full',
      showTime: true,
      placeholder: '请选择截止时间',
    },
    fieldName: 'due_date',
    label: '截止时间',
  },
  {
    component: 'DatePicker',
    componentProps: {
      class: 'w-full',
      showTime: true,
      placeholder: '请选择开始时间',
    },
    fieldName: 'start_date',
    label: '开始时间',
  },
  {
    component: 'Input',
    fieldName: 'remark',
    label: '备注',
  },
];

/** 更新状态表单 */
export const statusSchema: VbenFormSchema[] = [
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: TASK_STATUS_OPTIONS,
      optionType: 'button',
    },
    defaultValue: 0,
    fieldName: 'status',
    label: '任务状态',
    rules: 'required',
  },
];

/** 更新进度表单 */
export const progressSchema: VbenFormSchema[] = [
  {
    component: 'Slider',
    componentProps: {
      min: 0,
      max: 100,
      marks: {
        0: '0%',
        25: '25%',
        50: '50%',
        75: '75%',
        100: '100%',
      },
    },
    defaultValue: 0,
    fieldName: 'progress',
    label: '进度',
    rules: 'required',
  },
];
