<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type {
  CreateServerParams,
  ServerResult,
} from '#/api';

import { computed, ref } from 'vue';

import {
  Page,
  useVbenModal,
  VbenButton,
} from '@vben/common-ui';
import { MaterialSymbolsAdd } from '@vben/icons';
import { $t } from '@vben/locales';

import { message, Modal } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createServerApi,
  deleteServerApi,
  getServerListApi,
  SERVER_PROTOCOL_OPTIONS,
  testServerConnectionApi,
  updateServerApi,
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

const gridOptions: VxeTableGridOptions<ServerResult> = {
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
        return await getServerListApi({
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

function onActionClick({ code, row }: OnActionClickParams<ServerResult>) {
  switch (code) {
    case 'delete': {
      deleteServerApi(row.id).then(() => {
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
    case 'test': {
      testConnection(row);
      break;
    }
  }
}

/**
 * 测试连接
 */
const testingId = ref<number | null>(null);

async function testConnection(row: ServerResult) {
  testingId.value = row.id;
  try {
    const result = await testServerConnectionApi({
      protocol: row.protocol,
      ip: row.ip,
      port: row.port,
      username: row.username,
    });
    if (result.success) {
      Modal.success({
        title: '连接测试',
        content: `服务器「${row.name}」${result.message}`,
      });
    } else {
      Modal.error({
        title: '连接测试',
        content: `服务器「${row.name}」${result.message}`,
      });
    }
  } catch (error) {
    Modal.error({
      title: '连接测试',
      content: `服务器「${row.name}」连接测试异常`,
    });
  } finally {
    testingId.value = null;
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

interface formServerParams extends CreateServerParams {
  id?: number;
}

const editFormData = ref<formServerParams>();

const modalTitle = computed(() => {
  return editFormData.value?.id
    ? $t('ui.actionTitle.edit', ['服务器'])
    : $t('ui.actionTitle.create', ['服务器']);
});

const [EditModal, editModalApi] = useVbenModal({
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await editFormApi.validate();
    if (valid) {
      editModalApi.lock();
      const data = await editFormApi.getValues<CreateServerParams>();
      try {
        await (editFormData.value?.id
          ? updateServerApi(editFormData.value.id, data)
          : createServerApi(data));
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
      const data = editModalApi.getData<formServerParams>();
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
          新增服务器
        </VbenButton>
      </template>
    </Grid>
    <EditModal :title="modalTitle">
      <EditForm />
    </EditModal>
  </Page>
</template>
