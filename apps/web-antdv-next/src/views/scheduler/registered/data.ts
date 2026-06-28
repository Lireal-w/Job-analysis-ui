import type { VxeGridProps } from '#/adapter/vxe-table';

import { $t } from '@vben/locales';

export interface TaskRegisteredResult {
  name: string;
  task: string;
}

export function useColumns(): VxeGridProps['columns'] {
  return [
    {
      field: 'seq',
      title: $t('common.table.id'),
      type: 'seq',
      width: 50,
    },
    {
      field: 'name',
      title: '任务描述',
      minWidth: 200,
      showOverflow: 'ellipsis',
    },
    {
      field: 'task',
      title: 'Celery 任务路径',
      minWidth: 300,
      showOverflow: 'ellipsis',
    },
  ];
}
