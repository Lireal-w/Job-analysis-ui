<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { AuditLogResult } from '#/api';

import { computed, ref, watch } from 'vue';

import {
  confirm,
  Page,
  useVbenDrawer,
  VbenButton,
} from '@vben/common-ui';
import { MaterialSymbolsDelete } from '@vben/icons';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { clearAuditLogApi, deleteAuditLogApi, getAuditLogListApi } from '#/api';

import { querySchema, useColumns } from './data';

const formOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: querySchema,
};

function onActionClick({ code, row }: OnActionClickParams<AuditLogResult>) {
  switch (code) {
    case 'details': {
      auditLogDetails.value = row;
      drawerApi.open();
    }
  }
}

const gridOptions: VxeTableGridOptions<AuditLogResult> = {
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
        return await getAuditLogListApi({
          page: page.currentPage,
          size: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const gridEvents: VxeGridListeners<AuditLogResult> = {
  checkboxChange: () => {
    const data = gridApi.grid.getCheckboxRecords(true);
    checkedRows.value = data.map((item: any) => item.id);
  },
  checkboxAll: () => {
    const data = gridApi.grid.getCheckboxRecords(true);
    checkedRows.value = data.map((item: any) => item.id);
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
  gridEvents,
});

function onRefresh() {
  gridApi.query();
}

const checkedRows = ref<number[]>([]);
const deleteDisable = ref<boolean>(true);
const deleteLoading = ref<boolean>(false);
const clearLoading = ref<boolean>(false);

const deleteAuditLog = async () => {
  confirm({
    icon: 'warning',
    content: '确定删除已勾选的审计日志吗？',
  }).then(async () => {
    deleteLoading.value = true;
    try {
      await deleteAuditLogApi(checkedRows.value);
      message.success($t('ui.actionMessage.deleteSuccess'));
      onRefresh();
      deleteDisable.value = true;
    } catch (error) {
      console.error(error);
    } finally {
      deleteLoading.value = false;
    }
  });
};

const clearAuditLog = async () => {
  confirm({
    icon: 'warning',
    content: '确定清空所有审计日志吗？此操作不可恢复！',
  }).then(async () => {
    clearLoading.value = true;
    try {
      await clearAuditLogApi();
      message.success('审计日志已清空');
      onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      clearLoading.value = false;
    }
  });
};

watch(checkedRows, () => {
  deleteDisable.value = checkedRows.value.length === 0;
});

// Details drawer
const [Drawer, drawerApi] = useVbenDrawer({
  destroyOnClose: true,
  footer: false,
  class: 'w-2/5',
});

const auditLogDetails = ref<AuditLogResult>();

const auditLogDescItems = computed(() => {
  const d = auditLogDetails.value;
  return [
    { key: 'event_type', label: '事件类型', content: d?.event_type },
    { key: 'action', label: '操作', content: d?.action },
    { key: 'username', label: '用户名', content: d?.username },
    { key: 'resource_type', label: '资源类型', content: d?.resource_type },
    { key: 'resource_name', label: '资源名称', content: d?.resource_name },
    { key: 'resource_id', label: '资源 ID', content: d?.resource_id != null ? String(d.resource_id) : '-' },
    { key: 'ip', label: 'IP 地址', content: d?.ip },
    { key: 'request_method', label: '请求方法', content: d?.request_method },
    { key: 'request_path', label: '请求路径', content: d?.request_path, span: 2 },
    { key: 'response_code', label: '响应状态码', content: d?.response_code != null ? String(d.response_code) : '-' },
    { key: 'user_agent', label: '用户代理', content: d?.user_agent, span: 2 },
    { key: 'created_time', label: '创建时间', content: d?.created_time },
  ];
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <VbenButton
          variant="destructive"
          :disabled="deleteDisable"
          :loading="deleteLoading"
          @click="deleteAuditLog"
        >
          <MaterialSymbolsDelete class="size-5" />
          删除日志
        </VbenButton>
        <VbenButton
          variant="destructive"
          :loading="clearLoading"
          @click="clearAuditLog"
        >
          <MaterialSymbolsDelete class="size-5" />
          清空日志
        </VbenButton>
      </template>
    </Grid>
    <Drawer title="审计日志详情">
      <a-descriptions
        :styles="{ label: { color: '#6b7280' } }"
        class="ml-1"
        :column="2"
        :items="auditLogDescItems"
      >
        <template #contentRender="{ item }">
          <span>{{ item.content || '-' }}</span>
        </template>
      </a-descriptions>
    </Drawer>
  </Page>
</template>
