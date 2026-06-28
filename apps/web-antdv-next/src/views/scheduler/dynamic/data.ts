import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeGridProps } from '#/adapter/vxe-table';
import type { DynamicScheduleResult } from '#/api/dynamic-schedule';

import { $t } from '@vben/locales';

import { z } from '#/adapter/form';
import { getTaskRegisteredApi } from '#/api/scheduler';
import { DictEnum, getDictOptions } from '#/utils/dict';

/** 表格列 */
export function useColumns(
  onActionClick?: OnActionClickFn<DynamicScheduleResult>,
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
      title: '任务名称',
      minWidth: 140,
    },
    {
      field: 'task',
      title: 'Celery 任务',
      minWidth: 200,
      showOverflow: 'ellipsis',
    },
    {
      field: 'type',
      title: '调度类型',
      width: 120,
      cellRender: {
        name: 'CellTag',
        options: getDictOptions(DictEnum.TASK_STRATEGY_TYPE),
      },
    },
    {
      field: 'schedule',
      title: '触发策略',
      minWidth: 150,
      slots: { default: 'schedule' },
    },
    {
      field: 'enabled',
      title: '状态',
      width: 80,
      slots: { default: 'enabled' },
    },
    {
      field: 'total_run_count',
      title: '执行总计',
      width: 90,
    },
    {
      field: 'last_run_at',
      title: '最近执行',
      width: 168,
    },
    {
      field: 'operation',
      title: $t('common.table.operation'),
      align: 'center',
      fixed: 'right',
      width: 180,
      cellRender: {
        attrs: {
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: ['edit', 'delete'],
      },
    },
  ];
}

/** 表单 Schema */
export function createSchema(isEdit: boolean): VbenFormSchema[] {
  return [
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: getDictOptions(DictEnum.TASK_STRATEGY_TYPE),
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'type',
      formItemClass: 'col-span-2 md:col-span-2',
      label: '调度类型',
    },
    {
      component: 'Input',
      componentProps: isEdit ? { disabled: true } : {},
      fieldName: 'name',
      label: '任务名称',
      rules: isEdit ? '' : 'required',
      help: isEdit ? '名称创建后不可修改' : '唯一标识，创建后不可修改',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: getTaskRegisteredApi,
        class: 'w-full',
        labelField: 'name',
        valueField: 'task',
        placeholder: '选择或输入 Celery 任务',
      },
      fieldName: 'task',
      label: 'Celery 任务',
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'args',
      label: '位置参数',
      help: 'JSON 数组格式，例如：[1, "hello", true]',
      rules: z
        .string()
        .optional()
        .transform((val, ctx) => {
          if (!val || val.trim() === '') return undefined;
          try {
            const parsed = JSON.parse(val);
            if (!Array.isArray(parsed)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: '必须是 JSON 数组格式',
              });
              return z.NEVER;
            }
            return JSON.stringify(parsed);
          } catch {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: '无效的 JSON 格式',
            });
            return z.NEVER;
          }
        }),
    },
    {
      component: 'Textarea',
      fieldName: 'kwargs',
      label: '关键字参数',
      help: 'JSON 对象格式，例如：{"key": "value"}',
      rules: z
        .string()
        .optional()
        .transform((val, ctx) => {
          if (!val || val.trim() === '') return undefined;
          try {
            const parsed = JSON.parse(val);
            if (
              typeof parsed !== 'object' ||
              parsed === null ||
              Array.isArray(parsed)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: '必须是 JSON 对象格式',
              });
              return z.NEVER;
            }
            return JSON.stringify(parsed);
          } catch {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: '无效的 JSON 格式',
            });
            return z.NEVER;
          }
        }),
    },
    {
      component: 'Input',
      fieldName: 'queue',
      label: '执行队列',
      help: '将任务下发到指定队列。存储在 options.queue 中',
    },
    {
      component: 'Input',
      fieldName: 'exchange',
      label: '消息交换机',
      help: '存储在 options.exchange 中',
    },
    {
      component: 'Input',
      fieldName: 'routing_key',
      label: '路由密钥',
      help: '存储在 options.routing_key 中',
    },
    {
      component: 'InputNumber',
      componentProps: { class: 'w-full', min: 1 },
      dependencies: {
        show: (values) => values.type === 0,
        required: (values) => values.type === 0,
        triggerFields: ['type'],
      },
      fieldName: 'interval_every',
      label: '执行周期',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        options: getDictOptions(DictEnum.TASK_PERIOD_TYPE),
      },
      dependencies: {
        show: (values) => values.type === 0,
        triggerFields: ['type'],
      },
      defaultValue: 'seconds',
      fieldName: 'interval_period',
      label: '周期类型',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '* * * * *',
      },
      dependencies: {
        show: (values) => values.type === 1,
        required: (values) => values.type === 1,
        triggerFields: ['type'],
      },
      fieldName: 'crontab',
      label: 'Crontab',
      rules: z
        .string()
        .optional()
        .refine(
          (val) =>
            !val ||
            val.trim() === '' ||
            /^(?:[\d*/,-]+\s+){4}[\d*/,-]+$/.test(val.trim()),
          { message: '无效的 Crontab 表达式' },
        ),
      help: 'Crontab 表达式，例如：* * * * *（每分钟）',
    },
    {
      component: 'Switch',
      defaultValue: true,
      fieldName: 'enabled',
      label: '启用',
    },
  ];
}
