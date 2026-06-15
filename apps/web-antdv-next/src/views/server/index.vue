<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type {
  CreateSSHServerParams,
  SSHServerResult,
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
  createSSHServerApi,
  deleteSSHServerApi,
  getSSHServerListApi,
  testSSHConnectionApi,
  updateSSHServerApi,
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

const gridOptions: VxeTableGridOptions<SSHServerResult> = {
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
        return await getSSHServerListApi({
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

function onActionClick({ code, row }: OnActionClickParams<SSHServerResult>) {
  switch (code) {
    case 'delete': {
      deleteSSHServerApi([row.id]).then(() => {
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

async function testConnection(row: SSHServerResult) {
  testingId.value = row.id;
  try {
    const result = await testSSHConnectionApi({
      host: row.host,
      port: row.port,
      username: row.username,
      password: row.password,
      ssh_key: row.ssh_key,
    });
    if (result.success) {
      Modal.success({
        title: '连接测试',
        content: `服务器「${row.name}」连接成功！`,
      });
    } else {
      Modal.error({
        title: '连接测试',
        content: `服务器「${row.name}」${result.message || '连接失败'}`,
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

interface formServerParams extends CreateSSHServerParams {
  id?: number;
}

const editFormData = ref<formServerParams>();

const modalTitle = computed(() => {
  return editFormData.value?.id
    ? $t('ui.actionTitle.edit', ['SSH 服务器'])
    : $t('ui.actionTitle.create', ['SSH 服务器']);
});

const [EditModal, editModalApi] = useVbenModal({
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await editFormApi.validate();
    if (valid) {
      editModalApi.lock();
      const data = await editFormApi.getValues<CreateSSHServerParams>();
      try {
        await (editFormData.value?.id
          ? updateSSHServerApi(editFormData.value.id, data)
          : createSSHServerApi(data));
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
          新增 SSH 服务器
        </VbenButton>
      </template>
    </Grid>
    <EditModal :title="modalTitle">
      <EditForm />
    </EditModal>
  </Page>
</template>
