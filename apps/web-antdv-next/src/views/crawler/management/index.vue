
<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { mockCrawlerData, querySchema, useColumns } from './data';

const formOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: querySchema,
};

const gridOptions: VxeTableGridOptions = {
  rowConfig: {
    keyField: 'id',
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
  pagerConfig: {
    enabled: false,
  },
  columns: useColumns(onActionClick),
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        let data = [...mockCrawlerData];
        if (formValues?.name) {
          data = data.filter((item) =>
            item.name.includes(formValues.name),
          );
        }
        if (formValues?.status !== undefined && formValues?.status !== null) {
          data = data.filter((item) => item.status === formValues.status);
        }
        if (formValues?.type) {
          data = data.filter((item) => item.type === formValues.type);
        }
        return data;
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

function onRefresh() {
  gridApi.query();
}

function onActionClick({ code, row }: OnActionClickParams) {
  switch (code) {
    case 'start': {
      confirm({
        icon: 'success',
        content: `确认启动爬虫「${row.name}」吗？`,
      }).then(() => {
        message.success(`爬虫「${row.name}」已启动`);
        onRefresh();
      });
      break;
    }
    case 'stop': {
      confirm({
        icon: 'warning',
        content: `确认停止爬虫「${row.name}」吗？`,
      }).then(() => {
        message.success(`爬虫「${row.name}」已停止`);
        onRefresh();
      });
      break;
    }
    case 'delete': {
      confirm({
        icon: 'warning',
        content: `确认删除爬虫「${row.name}」吗？`,
      }).then(() => {
        message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
        onRefresh();
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
