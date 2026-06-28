<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, VbenButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getTaskRegisteredApi } from '#/api/scheduler';

import { useColumns } from './data';

const columns = useColumns();

const gridOptions: VxeTableGridOptions = {
  rowConfig: {
    keyField: 'task',
  },
  height: 'auto',
  exportConfig: {},
  printConfig: {},
  toolbarConfig: {
    export: true,
    print: true,
    refresh: true,
    custom: true,
    zoom: true,
  },
  columns,
  proxyConfig: {
    ajax: {
      query: async () => {
        const res = await getTaskRegisteredApi();
        // API returns flat array { name, task }[]
        const items = Array.isArray(res) ? res : [];
        return { items, total: items.length };
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

function onRefresh() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <VbenButton @click="onRefresh">
          {{ $t('common.refresh') }}
        </VbenButton>
      </template>
    </Grid>
  </Page>
</template>
