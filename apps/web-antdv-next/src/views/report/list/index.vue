<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type {
  CreateReportParams,
  ReportResult,
  UpdateReportParams,
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
  createReportApi,
  deleteReportApi,
  getReportListApi,
  updateReportApi,
} from '#/api';

import { querySchema, useColumns } from './data';

const router = useRouter();

const formOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: querySchema,
};

function onActionClick({ code, row }: OnActionClickParams<ReportResult>) {
  switch (code) {
    case 'delete': {
      confirm({
        icon: 'warning',
        content: `确认删除报表「${row.name}」吗？`,
      }).then(async () => {
        gridApi.setLoading(true);
        try {
          await deleteReportApi([row.id]);
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
    case 'design': {
      router.push(`/report/designer/${row.id}`);
      break;
    }
  }
}

const gridOptions: VxeTableGridOptions<ReportResult> = {
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
        return await getReportListApi({
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
const formData = ref<ReportResult | null>(null);

const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: '报表名称',
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '描述',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: false,
        options: [
          { label: '默认', value: 'default' },
          { label: '暗色', value: 'dark' },
          { label: '清新', value: 'light' },
          { label: '海洋', value: 'ocean' },
          { label: '森林', value: 'forest' },
        ],
      },
      fieldName: 'theme',
      label: '主题',
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        min: 0,
        max: 3600,
      },
      fieldName: 'refresh_interval',
      label: '刷新间隔(秒)',
      help: '0 表示不自动刷新',
    },
    {
      component: 'Switch',
      fieldName: 'is_public',
      label: '是否公开',
    },
  ],
});

const modalTitle = computed(() => {
  return formData.value?.id ? '编辑报表' : '新建报表';
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-5/12',
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues<
        CreateReportParams | UpdateReportParams
      >();
      try {
        await (formData.value?.id
          ? updateReportApi(formData.value.id, data as UpdateReportParams)
          : createReportApi(data as CreateReportParams));
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
      const data = modalApi.getData<ReportResult>();
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
          新建报表
        </VbenButton>
      </template>
      <template #status="{ row }">
        <a-tag :color="row.status === 1 ? 'green' : row.status === 2 ? 'orange' : 'default'">
          {{ row.status === 1 ? '已发布' : row.status === 2 ? '已归档' : '草稿' }}
        </a-tag>
      </template>
    </Grid>
    <Modal :title="modalTitle">
      <Form />
    </Modal>
  </Page>
</template>
