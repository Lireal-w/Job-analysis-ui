<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type {
  CreateDatasetParams,
  DatasetResult,
  UpdateDatasetParams,
} from '#/api';

import { computed, onMounted, ref } from 'vue';

import {
  confirm,
  Page,
  useVbenModal,
  VbenButton,
} from '@vben/common-ui';
import {
  MaterialSymbolsAdd,
  MaterialSymbolsFolderOutline,
} from '@vben/icons';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createDatasetApi,
  deleteDatasetApi,
  getAllDataLayerApi,
  getDatasetListApi,
  updateDatasetApi,
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

function onActionClick({ code, row }: OnActionClickParams<DatasetResult>) {
  switch (code) {
    case 'delete': {
      confirm({
        icon: 'warning',
        content: `确认删除数据集「${row.name}」吗？`,
      }).then(async () => {
        gridApi.setLoading(true);
        try {
          await deleteDatasetApi([row.id]);
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
  }
}

const gridOptions: VxeTableGridOptions<DatasetResult> = {
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
        return await getDatasetListApi({
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
const formData = ref<DatasetResult | null>(null);

const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  showDefaultActions: false,
  schema: useCreateSchema(),
});

const modalTitle = computed(() => {
  return formData.value?.id ? '编辑数据集' : '创建数据集';
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-5/12',
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues<
        CreateDatasetParams | UpdateDatasetParams
      >();
      try {
        await (formData.value?.id
          ? updateDatasetApi(
              formData.value.id,
              data as UpdateDatasetParams,
            )
          : createDatasetApi(data as CreateDatasetParams));
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
      const data = modalApi.getData<DatasetResult>();
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

// Data layer tree
const layers = ref<Array<{ id: number; name: string; layer_type: string; description: string | null }>>([]);
const selectedLayerId = ref<number | null>(null);

async function loadLayers() {
  try {
    const res = await getAllDataLayerApi();
    layers.value = res;
  } catch (error) {
    console.error(error);
  }
}

function onLayerSelect(layerId: number | null) {
  selectedLayerId.value = layerId;
  if (layerId) {
    gridApi.formApi?.setValues({ layer_id: layerId });
  } else {
    gridApi.formApi?.setValues({ layer_id: undefined });
  }
  gridApi.query();
}

onMounted(() => {
  loadLayers();
});
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full gap-4">
      <!-- Sidebar: Data Layer Tree -->
      <div class="w-56 shrink-0 overflow-auto rounded-lg bg-card p-3">
        <h3 class="mb-3 text-sm font-medium text-muted-foreground">数据分层</h3>
        <ul class="space-y-1">
          <li>
            <a
              class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
              :class="selectedLayerId === null ? 'bg-primary/15 text-primary font-bold' : 'text-foreground/70 hover:bg-accent'"
              @click="onLayerSelect(null)"
            >
              <MaterialSymbolsFolderOutline class="size-4 shrink-0" />
              全部
            </a>
          </li>
          <li v-for="layer in layers" :key="layer.id">
            <a
              class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
              :class="selectedLayerId === layer.id ? 'bg-primary/15 text-primary font-bold' : 'text-foreground/70 hover:bg-accent'"
              @click="onLayerSelect(layer.id)"
            >
              <MaterialSymbolsFolderOutline class="size-4 shrink-0" />
              {{ layer.name || layer.layer_type }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Main: Dataset Grid -->
      <div class="flex-1 overflow-hidden">
        <Grid>
          <template #toolbar-actions>
            <VbenButton @click="() => modalApi.setData(null).open()">
              <MaterialSymbolsAdd class="size-5" />
              创建数据集
            </VbenButton>
          </template>
        </Grid>
      </div>
    </div>

    <Modal :title="modalTitle">
      <Form />
    </Modal>
  </Page>
</template>
