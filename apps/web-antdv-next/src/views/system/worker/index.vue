<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type {
  CreateWorkerParams,
  WorkerResult,
} from '#/api';

import { computed, ref } from 'vue';

import {
  Page,
  useVbenModal,
  VbenButton,
} from '@vben/common-ui';
import { MaterialSymbolsAdd } from '@vben/icons';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createWorkerApi,
  deleteWorkerApi,
  getWorkerListApi,
  updateWorkerApi,
} from '#/api';

import { formSchema, querySchema, useColumns } from './data';

const formOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: querySchema,
};

const gridOptions: VxeTableGridOptions<WorkerResult> = {
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
        return await getWorkerListApi({
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

function onActionClick({ code, row }: OnActionClickParams<WorkerResult>) {
  switch (code) {
    case 'delete': {
      deleteWorkerApi([row.id]).then(() => {
        message.success({
          content: $t('ui.actionMessage.deleteSuccess', [row.name]),
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

interface formWorkerParams extends CreateWorkerParams {
  id?: number;
}

const editFormData = ref<formWorkerParams>();

const modalTitle = computed(() => {
  return editFormData.value?.id
    ? $t('ui.actionTitle.edit', ['Worker 节点'])
    : $t('ui.actionTitle.create', ['Worker 节点']);
});

const [EditModal, editModalApi] = useVbenModal({
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await editFormApi.validate();
    if (valid) {
      editModalApi.lock();
      const data = await editFormApi.getValues<CreateWorkerParams>();
      try {
        await (editFormData.value?.id
          ? updateWorkerApi(editFormData.value.id, data)
          : createWorkerApi(data));
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
      const data = editModalApi.getData<formWorkerParams>();
      editFormApi.resetForm();
      if (data) {
        editFormData.value = data;
        editFormApi.setValues(data);
      }
    }
  },
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <VbenButton @click="() => editModalApi.setData(null).open()">
          <MaterialSymbolsAdd class="size-5" />
          新增 Worker 节点
        </VbenButton>
      </template>
    </Grid>
    <EditModal :title="modalTitle">
      <EditForm />
    </EditModal>
  </Page>
</template>
