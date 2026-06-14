import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { GoalResult } from '#/api';

import { $t } from '@vben/locales';

/** 目标状态选项 */
export const GOAL_STATUS_OPTIONS = [
  { label: '待开始', value: 0, color: 'default' },
  { label: '进行中', value: 1, color: 'processing' },
  { label: '已完成', value: 2, color: 'success' },
];

/** 目标表格列 */
export function goalColumns(
  onActionClick?: (params: { code: string; row: GoalResult }) => void,
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
      title: '目标标题',
      minWidth: 150,
    },
    {
      field: 'stage_order',
      title: '阶段顺序',
      width: 90,
    },
    {
      field: 'status',
      title: '状态',
      width: 100,
      slots: { default: 'status' },
    },
    {
      field: 'ai_generated',
      title: 'AI生成',
      width: 80,
      cellRender: {
        name: 'CellTag',
        options: [
          { label: '是', value: true, color: 'purple' },
          { label: '否', value: false, color: 'default' },
        ],
      },
    },
    {
      field: 'created_time',
      title: $t('common.table.created_time'),
      width: 168,
    },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 150,
      cellRender: {
        attrs: {
          nameField: 'title',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'status',
            text: '切换状态',
          },
          {
            code: 'delete',
          },
        ],
      },
    },
  ];
}

/** 创建目标表单 */
export const goalFormSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'title',
    label: '目标标题',
    rules: 'required',
  },
  {
    component: 'Textarea',
    fieldName: 'description',
    label: '目标描述',
  },
  {
    component: 'InputNumber',
    componentProps: {
      min: 0,
      placeholder: '请输入阶段顺序',
    },
    fieldName: 'stage_order',
    label: '阶段顺序',
  },
];
