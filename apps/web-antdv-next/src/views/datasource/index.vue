<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type {
  CreateDatasourceParams,
  DatasourceResult,
  DatasourceTestParams,
  UpdateDatasourceParams,
} from '#/api';

import { computed, ref } from 'vue';

import { confirm, Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { MaterialSymbolsAdd } from '@vben/icons';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createDatasourceApi,
  deleteDatasourceApi,
  getDatasourceListApi,
  testDatasourceConnectionApi,
  updateDatasourceApi,
  updateDatasourceStatusApi,
} from '#/api';

import { querySchema, useColumns, useCreateSchema } from './data';

const formOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: querySchema,
};

function onActionClick({ code, row }: OnActionClickParams<DatasourceResult>) {
  switch (code) {
    case 'delete': {
      confirm({
        icon: 'warning',
        content: `确认删除数据源「${row.name}」吗？`,
      }).then(async () => {
        gridApi.setLoading(true);
        try {
          await deleteDatasourceApi([row.id]);
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
    case 'test_connection': {
      handleTestConnection(row);
      break;
    }
  }
}

const gridOptions: VxeTableGridOptions<DatasourceResult> = {
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
        return await getDatasourceListApi({
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

// Test connection
async function handleTestConnection(row: DatasourceResult) {
  const params: DatasourceTestParams = {
    db_type: row.db_type,
    host: row.host,
    port: row.port,
    database_name: row.database_name || undefined,
    username: row.username || undefined,
    password: row.password || undefined,
    extra_params: row.extra_params || undefined,
  };
  testLoadingMap.value[row.id] = true;
  try {
    const result = await testDatasourceConnectionApi(params);
    if (result.success) {
      message.success(`连接成功: ${result.message}`);
    } else {
      message.error(`连接失败: ${result.message}`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    testLoadingMap.value[row.id] = false;
  }
}

const testLoadingMap = ref<Record<number, boolean>>({});

// Status toggle
const statusLoadingMap = ref<Record<number, boolean>>({});

async function handleStatusChange(row: DatasourceResult, checked: boolean) {
  statusLoadingMap.value[row.id] = true;
  try {
    await updateDatasourceStatusApi(row.id, checked ? 1 : 0);
    row.status = checked ? 1 : 0;
    message.success($t('ui.actionMessage.operationSuccess'));
  } catch (error) {
    console.error(error);
  } finally {
    statusLoadingMap.value[row.id] = false;
  }
}

// Create/Edit modal (single modal for both)
const formData = ref<DatasourceResult | null>(null);

const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  showDefaultActions: false,
  schema: useCreateSchema(),
});

const modalTitle = computed(() => {
  return formData.value?.id ? '编辑数据源' : '创建数据源';
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-5/12',
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues<
        CreateDatasourceParams | UpdateDatasourceParams
      >();
      try {
        await (formData.value?.id
          ? updateDatasourceApi(
              formData.value.id,
              data as UpdateDatasourceParams,
            )
          : createDatasourceApi(data as CreateDatasourceParams));
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
      const data = modalApi.getData<DatasourceResult>();
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
          创建数据源
        </VbenButton>
      </template>
      <template #status="{ row }">
        <a-switch
          :checked="row.status === 1"
          :checked-value="1"
          :un-checked-value="0"
          checked-children="启用"
          un-checked-children="禁用"
          :loading="!!statusLoadingMap[row.id]"
          @change="handleStatusChange(row, $event)"
        />
      </template>
    </Grid>
    <Modal :title="modalTitle">
      <Form />
    </Modal>
  </Page>
</template>
