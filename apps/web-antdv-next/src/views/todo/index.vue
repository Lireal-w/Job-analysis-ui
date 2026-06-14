<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type {
  CreateTodoParams,
  TodoResult,
  UpdateTodoProgressParams,
} from '#/api';

import { computed, ref } from 'vue';

import {
  Page,
  useVbenDrawer,
  useVbenModal,
  VbenButton,
} from '@vben/common-ui';
import { MaterialSymbolsAdd } from '@vben/icons';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createTodoApi,
  deleteTodoApi,
  getTodoListApi,
  updateTodoApi,
  updateTodoProgressApi,
  updateTodoStatusApi,
} from '#/api';

import {
  formSchema,
  progressSchema,
  querySchema,
  statusSchema,
  useColumns,
} from './data';
import GoalDrawer from './goal-drawer.vue';

const formOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: querySchema,
};

const gridOptions: VxeTableGridOptions<TodoResult> = {
  rowConfig: {
    keyField: 'id',
  },
  checkboxConfig: {
    highlight: true,
  },
  height: 'auto',
  exportConfig: {},
  printConfig: {},
  toolbarConfig: {
    export: true,
    print: true,
    refresh: true,
    refreshOptions: {
      code: 'query',
    },
    custom: true,
    zoom: true,
  },
  columns: useColumns(onActionClick),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getTodoListApi({
          page: page.currentPage,
          size: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

function onRefresh() {
  gridApi.query();
}

function onActionClick({ code, row }: OnActionClickParams<TodoResult>) {
  switch (code) {
    case 'delete': {
      deleteTodoApi(row.id).then(() => {
        message.success({
          content: $t('ui.actionMessage.deleteSuccess', [row.title]),
          key: 'action_process_msg',
        });
        onRefresh();
      });
      break;
    }
    case 'edit': {
      editFormData.value = row;
      editModalApi.setData(row).open();
      break;
    }
    case 'goals': {
      goalDrawerApi.setData({ taskId: row.id, taskTitle: row.title }).open();
      break;
    }
    case 'status': {
      statusFormData.value = { status: row.status };
      statusModalApi.setData({ id: row.id, status: row.status }).open();
      break;
    }
    case 'progress': {
      progressFormData.value = { progress: row.progress };
      progressModalApi.setData({ id: row.id, progress: row.progress }).open();
      break;
    }
  }
}

/**
 * 创建/编辑 Modal
 */
const [EditForm, editFormApi] = useVbenForm({
  layout: 'vertical',
  showDefaultActions: false,
  schema: formSchema,
});

interface formTodoParams extends CreateTodoParams {
  id?: number;
}

const editFormData = ref<formTodoParams>();

const modalTitle = computed(() => {
  return editFormData.value?.id
    ? $t('ui.actionTitle.edit', ['任务'])
    : $t('ui.actionTitle.create', ['任务']);
});

const [EditModal, editModalApi] = useVbenModal({
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await editFormApi.validate();
    if (valid) {
      editModalApi.lock();
      const data = await editFormApi.getValues<CreateTodoParams>();
      try {
        await (editFormData.value?.id
          ? updateTodoApi(editFormData.value.id, data)
          : createTodoApi(data));
        message.success($t('ui.actionMessage.operationSuccess'));
        await editModalApi.close();
        onRefresh();
      } finally {
        editModalApi.unlock();
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = editModalApi.getData<formTodoParams>();
      editFormApi.resetForm();
      if (data) {
        editFormData.value = data;
        editFormApi.setValues(data);
      }
    }
  },
});

/**
 * 更新状态 Modal
 */
const [StatusForm, statusFormApi] = useVbenForm({
  layout: 'vertical',
  showDefaultActions: false,
  schema: statusSchema,
});

const statusFormData = ref<{ id?: number; status: number }>({ status: 0 });

const [StatusModal, statusModalApi] = useVbenModal({
  destroyOnClose: true,
  title: '更新任务状态',
  async onConfirm() {
    const { valid } = await statusFormApi.validate();
    if (valid) {
      statusModalApi.lock();
      const data = await statusFormApi.getValues<{ status: number }>();
      try {
        await updateTodoStatusApi(statusFormData.value.id!, data.status);
        message.success($t('ui.actionMessage.operationSuccess'));
        await statusModalApi.close();
        onRefresh();
      } finally {
        statusModalApi.unlock();
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = statusModalApi.getData<{ id: number; status: number }>();
      statusFormApi.resetForm();
      if (data) {
        statusFormData.value = data;
        statusFormApi.setValues({ status: data.status });
      }
    }
  },
});

/**
 * 更新进度 Modal
 */
const [ProgressForm, progressFormApi] = useVbenForm({
  layout: 'vertical',
  showDefaultActions: false,
  schema: progressSchema,
});

const progressFormData = ref<UpdateTodoProgressParams>({ progress: 0 });

const [ProgressModal, progressModalApi] = useVbenModal({
  destroyOnClose: true,
  title: '更新任务进度',
  async onConfirm() {
    const { valid } = await progressFormApi.validate();
    if (valid) {
      progressModalApi.lock();
      const data =
        await progressFormApi.getValues<UpdateTodoProgressParams>();
      try {
        await updateTodoProgressApi(
          progressModalApi.getData<{ id: number }>().id,
          data,
        );
        message.success($t('ui.actionMessage.operationSuccess'));
        await progressModalApi.close();
        onRefresh();
      } finally {
        progressModalApi.unlock();
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = progressModalApi.getData<{
        id: number;
        progress: number;
      }>();
      progressFormApi.resetForm();
      if (data) {
        progressFormData.value = { progress: data.progress };
        progressFormApi.setValues({ progress: data.progress });
      }
    }
  },
});

/**
 * 目标管理 Drawer
 */
const [GoalDrawerComponent, goalDrawerApi] = useVbenDrawer({
  connectedComponent: GoalDrawer,
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <VbenButton @click="() => editModalApi.setData(null).open()">
          <MaterialSymbolsAdd class="size-5" />
          新增任务
        </VbenButton>
      </template>
    </Grid>
    <EditModal :title="modalTitle">
      <EditForm />
    </EditModal>
    <StatusModal>
      <StatusForm />
    </StatusModal>
    <ProgressModal>
      <ProgressForm />
    </ProgressModal>
    <GoalDrawerComponent />
  </Page>
</template>
