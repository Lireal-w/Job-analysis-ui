<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type {
  CreateDataFlowParams,
  DataFlowResult,
  UpdateDataFlowParams,
} from '#/api';

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { confirm, Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { MaterialSymbolsAdd } from '@vben/icons';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createDataFlowApi,
  deleteDataFlowApi,
  getDataFlowListApi,
  publishDataFlowApi,
  runDataFlowApi,
  updateDataFlowApi,
} from '#/api';

import { querySchema, useColumns, useCreateSchema } from './data';

const router = useRouter();

const formOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: querySchema,
};

function onActionClick({ code, row }: OnActionClickParams<DataFlowResult>) {
  switch (code) {
    case 'design': {
      router.push(`/etl/flow/editor/${row.id}`);
      break;
    }
    case 'delete': {
      confirm({
        icon: 'warning',
        content: `确认删除数据流程「${row.name}」吗？`,
      }).then(async () => {
        gridApi.setLoading(true);
        try {
          await deleteDataFlowApi([row.id]);
          message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
          onRefresh();
        } catch (error) {
          console.error(error);
        } finally {
          gridApi.setLoading(false);
        }
      });
      break;
    }
    case 'edit': {
      formData.value = row;
      modalApi.setData(row).open();
      break;
    }
    case 'run': {
      confirm({
        icon: 'success',
        content: `确认运行数据流程「${row.name}」吗？`,
      }).then(async () => {
        gridApi.setLoading(true);
        try {
          await runDataFlowApi(row.id);
          message.success(`流程「${row.name}」已启动运行`);
          onRefresh();
        } catch (error) {
          console.error(error);
        } finally {
          gridApi.setLoading(false);
        }
      });
      break;
    }
    case 'publish': {
      confirm({
        icon: 'success',
        content: `确认发布数据流程「${row.name}」吗？`,
      }).then(async () => {
        gridApi.setLoading(true);
        try {
          await publishDataFlowApi(row.id);
          message.success(`流程「${row.name}」已发布`);
          onRefresh();
        } catch (error) {
          console.error(error);
        } finally {
          gridApi.setLoading(false);
        }
      });
      break;
    }
  }
}

const gridOptions: VxeTableGridOptions<DataFlowResult> = {
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
        return await getDataFlowListApi({
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

// Create/Edit modal
const formData = ref<DataFlowResult | null>(null);

const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  showDefaultActions: false,
  schema: useCreateSchema(),
});

const modalTitle = computed(() => {
  return formData.value?.id ? '编辑数据流程' : '创建数据流程';
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-5/12',
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues<
        CreateDataFlowParams | UpdateDataFlowParams
      >();
      try {
        await (formData.value?.id
          ? updateDataFlowApi(
              formData.value.id,
              data as UpdateDataFlowParams,
            )
          : createDataFlowApi(data as CreateDataFlowParams));
        message.success($t('ui.actionMessage.operationSuccess'));
        await modalApi.close();
        await formApi.resetForm();
        onRefresh();
      } catch (error) {
        console.error(error);
      } finally {
        modalApi.unlock();
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<DataFlowResult>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        formApi.setValues(data);
      } else {
        formData.value = null;
      }
    }
  },
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <VbenButton @click="() => modalApi.setData(null).open()">
          <MaterialSymbolsAdd class="size-5" />
          创建数据流程
        </VbenButton>
      </template>
    </Grid>
    <Modal :title="modalTitle">
      <Form />
    </Modal>
  </Page>
</template>
