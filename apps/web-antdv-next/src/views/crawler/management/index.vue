<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { CrawlTaskResult } from '#/api';

import { confirm, Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteCrawlTaskApi,
  getCrawlTaskListApi,
  startCrawlTaskApi,
  stopCrawlTaskApi,
} from '#/api';

import { querySchema, useColumns } from './data';

const formOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: querySchema,
};

const gridOptions: VxeTableGridOptions<CrawlTaskResult> = {
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
        return await getCrawlTaskListApi({
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

function onActionClick({ code, row }: OnActionClickParams<CrawlTaskResult>) {
  switch (code) {
    case 'delete': {
      confirm({
        icon: 'warning',
        content: `确认删除任务「${row.name}」吗？`,
      }).then(async () => {
        gridApi.setLoading(true);
        try {
          await deleteCrawlTaskApi([row.id]);
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
    case 'start': {
      confirm({
        icon: 'success',
        content: `确认启动任务「${row.name}」吗？`,
      }).then(async () => {
        gridApi.setLoading(true);
        try {
          await startCrawlTaskApi(row.id);
          message.success(`任务「${row.name}」已启动`);
          onRefresh();
        } catch (error) {
          console.error(error);
        } finally {
          gridApi.setLoading(false);
        }
      });
      break;
    }
    case 'stop': {
      confirm({
        icon: 'warning',
        content: `确认停止任务「${row.name}」吗？`,
      }).then(async () => {
        gridApi.setLoading(true);
        try {
          await stopCrawlTaskApi(row.id);
          message.success(`任务「${row.name}」已停止`);
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
</script>

<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
