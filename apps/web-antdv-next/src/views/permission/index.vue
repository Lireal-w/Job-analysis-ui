<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type {
  CreateDataMaskingRuleParams,
  CreateResourcePermissionParams,
  DataMaskingRuleResult,
  ResourcePermissionResult,
  UpdateDataMaskingRuleParams,
  UpdateResourcePermissionParams,
} from '#/api';

import { computed, ref } from 'vue';

import { confirm, Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { MaterialSymbolsAdd } from '@vben/icons';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createDataMaskingRuleApi,
  createResourcePermissionApi,
  deleteDataMaskingRuleApi,
  deleteResourcePermissionApi,
  getDataMaskingRuleListApi,
  getResourcePermissionListApi,
  updateDataMaskingRuleApi,
  updateResourcePermissionApi,
} from '#/api';

import {
  maskingQuerySchema,
  permissionQuerySchema,
  useMaskingColumns,
  useMaskingCreateSchema,
  usePermissionColumns,
  usePermissionCreateSchema,
} from './data';

const activeTab = ref<string>('permission');

// ==================== Resource Permission Grid ====================
const permissionFormOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: permissionQuerySchema,
};

function onPermissionActionClick({ code, row }: OnActionClickParams<ResourcePermissionResult>) {
  switch (code) {
    case 'delete': {
      confirm({
        icon: 'warning',
        content: `确认删除权限「${row.name}」吗？`,
      }).then(async () => {
        permissionGridApi.setLoading(true);
        try {
          await deleteResourcePermissionApi([row.id]);
          message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
          onPermissionRefresh();
        } catch (error) {
          console.error(error);
        } finally {
          permissionGridApi.setLoading(false);
        }
      });
      break;
    }
    case 'edit': {
      permissionFormData.value = row;
      permissionModalApi.setData(row).open();
      break;
    }
  }
}

const permissionGridOptions: VxeTableGridOptions<ResourcePermissionResult> = {
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
  columns: usePermissionColumns(onPermissionActionClick),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getResourcePermissionListApi({
          page: page.currentPage,
          size: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const [PermissionGrid, permissionGridApi] = useVbenVxeGrid({
  formOptions: permissionFormOptions,
  gridOptions: permissionGridOptions,
});

function onPermissionRefresh() {
  permissionGridApi.query();
}

// ==================== Data Masking Rule Grid ====================
const maskingFormOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: maskingQuerySchema,
};

function onMaskingActionClick({ code, row }: OnActionClickParams<DataMaskingRuleResult>) {
  switch (code) {
    case 'delete': {
      confirm({
        icon: 'warning',
        content: `确认删除掩码规则「${row.name}」吗？`,
      }).then(async () => {
        maskingGridApi.setLoading(true);
        try {
          await deleteDataMaskingRuleApi([row.id]);
          message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
          onMaskingRefresh();
        } catch (error) {
          console.error(error);
        } finally {
          maskingGridApi.setLoading(false);
        }
      });
      break;
    }
    case 'edit': {
      maskingFormData.value = row;
      maskingModalApi.setData(row).open();
      break;
    }
  }
}

const maskingGridOptions: VxeTableGridOptions<DataMaskingRuleResult> = {
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
  columns: useMaskingColumns(onMaskingActionClick),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getDataMaskingRuleListApi({
          page: page.currentPage,
          size: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const [MaskingGrid, maskingGridApi] = useVbenVxeGrid({
  formOptions: maskingFormOptions,
  gridOptions: maskingGridOptions,
});

function onMaskingRefresh() {
  maskingGridApi.query();
}

// ==================== Permission Create/Edit Modal ====================
const permissionFormData = ref<ResourcePermissionResult | null>(null);

const [PermissionForm, permissionFormApi] = useVbenForm({
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  showDefaultActions: false,
  schema: usePermissionCreateSchema(),
});

const permissionModalTitle = computed(() => {
  return permissionFormData.value?.id ? '编辑权限' : '创建权限';
});

const [PermissionModal, permissionModalApi] = useVbenModal({
  class: 'w-5/12',
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await permissionFormApi.validate();
    if (valid) {
      permissionModalApi.lock();
      const data = await permissionFormApi.getValues<
        CreateResourcePermissionParams | UpdateResourcePermissionParams
      >();
      try {
        await (permissionFormData.value?.id
          ? updateResourcePermissionApi(
              permissionFormData.value.id,
              data as UpdateResourcePermissionParams,
            )
          : createResourcePermissionApi(data as CreateResourcePermissionParams));
        message.success($t('ui.actionMessage.operationSuccess'));
        await permissionModalApi.close();
        await permissionFormApi.resetForm();
        onPermissionRefresh();
      } catch (error) {
        console.error(error);
      } finally {
        permissionModalApi.unlock();
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = permissionModalApi.getData<ResourcePermissionResult>();
      permissionFormApi.resetForm();
      if (data) {
        permissionFormData.value = data;
        permissionFormApi.setValues(data);
      } else {
        permissionFormData.value = null;
      }
    }
  },
});

// ==================== Masking Create/Edit Modal ====================
const maskingFormData = ref<DataMaskingRuleResult | null>(null);

const [MaskingForm, maskingFormApi] = useVbenForm({
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  showDefaultActions: false,
  schema: useMaskingCreateSchema(),
});

const maskingModalTitle = computed(() => {
  return maskingFormData.value?.id ? '编辑掩码规则' : '创建掩码规则';
});

const [MaskingModal, maskingModalApi] = useVbenModal({
  class: 'w-5/12',
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await maskingFormApi.validate();
    if (valid) {
      maskingModalApi.lock();
      const data = await maskingFormApi.getValues<
        CreateDataMaskingRuleParams | UpdateDataMaskingRuleParams
      >();
      try {
        await (maskingFormData.value?.id
          ? updateDataMaskingRuleApi(
              maskingFormData.value.id,
              data as UpdateDataMaskingRuleParams,
            )
          : createDataMaskingRuleApi(data as CreateDataMaskingRuleParams));
        message.success($t('ui.actionMessage.operationSuccess'));
        await maskingModalApi.close();
        await maskingFormApi.resetForm();
        onMaskingRefresh();
      } catch (error) {
        console.error(error);
      } finally {
        maskingModalApi.unlock();
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = maskingModalApi.getData<DataMaskingRuleResult>();
      maskingFormApi.resetForm();
      if (data) {
        maskingFormData.value = data;
        maskingFormApi.setValues(data);
      } else {
        maskingFormData.value = null;
      }
    }
  },
});
</script>

<template>
  <Page auto-content-height>
    <a-tabs v-model:activeKey="activeTab" type="card" class="permission-tabs">
      <a-tab-pane key="permission" tab="资源权限">
        <PermissionGrid>
          <template #toolbar-actions>
            <VbenButton @click="() => permissionModalApi.setData(null).open()">
              <MaterialSymbolsAdd class="size-5" />
              创建权限
            </VbenButton>
          </template>
        </PermissionGrid>
      </a-tab-pane>
      <a-tab-pane key="masking" tab="数据掩码规则">
        <MaskingGrid>
          <template #toolbar-actions>
            <VbenButton @click="() => maskingModalApi.setData(null).open()">
              <MaterialSymbolsAdd class="size-5" />
              创建掩码规则
            </VbenButton>
          </template>
        </MaskingGrid>
      </a-tab-pane>
    </a-tabs>

    <PermissionModal :title="permissionModalTitle">
      <PermissionForm />
    </PermissionModal>

    <MaskingModal :title="maskingModalTitle">
      <MaskingForm />
    </MaskingModal>
  </Page>
</template>

<style scoped>
.permission-tabs :deep(.vben-grid) {
  padding-top: 0;
}
</style>
