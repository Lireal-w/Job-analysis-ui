<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { CreateCrawlTaskParams, CrawlTaskResult } from '#/api';

import { computed, h, onMounted, ref } from 'vue';

import {
  confirm,
  Page,
  useVbenDrawer,
  useVbenModal,
  VbenButton,
} from '@vben/common-ui';
import { MaterialSymbolsAdd } from '@vben/icons';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createCrawlTaskApi,
  deleteCrawlTaskApi,
  getCrawlTaskApi,
  getCrawlTaskListApi,
  getCrawlTaskLogsApi,
  getAllDatasourceApi,
  startCrawlTaskApi,
  stopCrawlTaskApi,
  triggerCrawlTaskApi,
  updateCrawlTaskApi,
} from '#/api';

import {
  CRAWL_MODE_OPTIONS,
  querySchema,
  SCHEDULE_TYPE_OPTIONS,
  STATUS_OPTIONS,
  TARGET_STORAGE_OPTIONS,
  useColumns,
  useCreateSchema,
} from './data';

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

// ==================== 创建/编辑弹窗 ====================

const formData = ref<CrawlTaskResult | null>(null);
const datasourceList = ref<Array<{ label: string; value: number }>>([]);

async function loadDatasourceOptions() {
  try {
    const data = await getAllDatasourceApi();
    datasourceList.value = data.map((d: any) => ({
      label: `${d.name} (${d.db_type})`,
      value: d.id,
    }));
  } catch (error) {
    console.error('Failed to load datasources:', error);
  }
}

const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  showDefaultActions: false,
  schema: useCreateSchema(),
});

const modalTitle = computed(() => {
  return formData.value?.id ? '编辑采集任务' : '创建采集任务';
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-5/6 max-w-4xl',
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues<CreateCrawlTaskParams>();
      try {
        // Parse JSON fields
        if (typeof data.source_config === 'string') {
          try { data.source_config = JSON.parse(data.source_config); } catch { delete data.source_config; }
        }
        if (typeof data.target_config === 'string') {
          try { data.target_config = JSON.parse(data.target_config); } catch { delete data.target_config; }
        }
        // Handle tags string -> comma separated
        if (typeof data.tags === 'string' && data.tags) {
          data.tags = data.tags;
        }

        if (formData.value?.id) {
          await updateCrawlTaskApi(formData.value.id, data);
          message.success($t('ui.actionMessage.updateSuccess', [data.name]));
        } else {
          await createCrawlTaskApi(data);
          message.success($t('ui.actionMessage.createSuccess', [data.name]));
        }
        await modalApi.close();
        await formApi.resetForm();
        formData.value = null;
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
      loadDatasourceOptions().then(() => {
        formApi.updateSchema([
          {
            fieldName: 'source_datasource_id',
            componentProps: {
              options: datasourceList.value,
            },
          },
        ]);
      });
      const data = modalApi.getData<CrawlTaskResult>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        // Set defaults for edit
        const formValues: Record<string, any> = { ...data };
        if (data.source_config && typeof data.source_config === 'object') {
          formValues.source_config = JSON.stringify(data.source_config, null, 2);
        }
        if (data.target_config && typeof data.target_config === 'object') {
          formValues.target_config = JSON.stringify(data.target_config, null, 2);
        }
        formApi.setValues(formValues);
      } else {
        formData.value = null;
      }
    }
  },
});

// ==================== 查看详情抽屉 ====================

const currentRecord = ref<CrawlTaskResult | null>(null);
const taskLogs = ref<any[]>([]);
const logsLoading = ref(false);

const detailItems = computed(() => {
  const d = currentRecord.value;
  if (!d) return [];
  return [
    { key: 'id', label: '任务 ID', content: d.id, span: 2 },
    { key: 'name', label: '任务名称', content: d.name },
    {
      key: 'crawl_mode',
      label: '采集模式',
      content: CRAWL_MODE_OPTIONS.find((o) => o.value === d.crawl_mode)?.label || d.crawl_mode,
    },
    {
      key: 'status',
      label: '状态',
    },
    {
      key: 'schedule_type',
      label: '调度方式',
      content:
        d.schedule_type === 'crontab'
          ? `Crontab (${d.cron_expr || ''})`
          : d.schedule_type === 'interval'
            ? `间隔 ${d.interval_seconds || ''}秒`
            : '手动',
    },
    {
      key: 'target_storage',
      label: '目标存储',
      content: TARGET_STORAGE_OPTIONS.find((o) => o.value === d.target_storage)?.label || d.target_storage,
    },
    { key: 'total_run_count', label: '执行次数', content: d.total_run_count },
    { key: 'total_records', label: '采集总数', content: d.total_records },
    { key: 'last_run_time', label: '上次运行', content: d.last_run_time || '-' },
    {
      key: 'last_duration',
      label: '上次耗时(秒)',
      content: d.last_duration != null ? String(d.last_duration) : '-',
    },
    {
      key: 'last_status',
      label: '上次状态',
    },
    { key: 'description', label: '描述', content: d.description || '-', span: 2 },
    { key: 'tags', label: '标签', content: d.tags || '-', span: 2 },
    {
      key: 'concurrency',
      label: '并发数',
      content: d.concurrency ?? '-',
    },
    {
      key: 'batch_size',
      label: '批量大小',
      content: d.batch_size ?? '-',
    },
    {
      key: 'priority',
      label: '优先级',
      content: d.priority ?? '-',
    },
    {
      key: 'created_time',
      label: $t('common.table.created_time'),
      content: d.created_time,
    },
  ];
});

const logColumns = computed(() => [
  { title: '运行 ID', dataIndex: 'run_id', width: 180, ellipsis: true },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    customRender: ({ text }: { text: string }) => {
      const color = text === 'completed' ? 'success' : text === 'running' ? 'processing' : 'error';
      const label = text === 'completed' ? '成功' : text === 'running' ? '运行中' : '失败';
      return h('a-tag', { color }, label);
    },
  },
  { title: '采集数', dataIndex: 'total_scraped', width: 70 },
  { title: '成功', dataIndex: 'total_succeeded', width: 70 },
  { title: '失败', dataIndex: 'total_failed', width: 70 },
  {
    title: '耗时(秒)',
    dataIndex: 'duration',
    width: 90,
    customRender: ({ record }: { record: any }) => record.duration ?? '-',
  },
  { title: '开始时间', dataIndex: 'start_time', width: 168 },
]);

const [Drawer, drawerApi] = useVbenDrawer({
  destroyOnClose: true,
  footer: false,
  class: 'w-2/5',
});

async function openDetailDrawer(row: CrawlTaskResult) {
  try {
    const detail = await getCrawlTaskApi(row.id);
    currentRecord.value = detail;
  } catch {
    currentRecord.value = row;
  }
  drawerApi.open();

  logsLoading.value = true;
  try {
    taskLogs.value = await getCrawlTaskLogsApi(row.id, 5);
  } catch (error) {
    console.error('Failed to load task logs:', error);
    taskLogs.value = [];
  } finally {
    logsLoading.value = false;
  }
}

// ==================== 按钮操作 ====================

async function onActionClick({ code, row }: OnActionClickParams<CrawlTaskResult>) {
  switch (code) {
    case 'view': {
      openDetailDrawer(row);
      break;
    }
    case 'edit': {
      modalApi.setData(row).open();
      break;
    }
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
    case 'trigger': {
      confirm({
        icon: 'success',
        content: `确认手动触发任务「${row.name}」吗？`,
      }).then(async () => {
        gridApi.setLoading(true);
        try {
          await triggerCrawlTaskApi(row.id);
          message.success(`任务「${row.name}」已触发`);
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

onMounted(() => {
  loadDatasourceOptions();
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <VbenButton @click="() => modalApi.setData(null).open()">
          <MaterialSymbolsAdd class="size-5" />
          创建任务
        </VbenButton>
      </template>
    </Grid>

    <!-- 创建/编辑弹窗 -->
    <Modal :title="modalTitle">
      <Form />
    </Modal>

    <!-- 详情抽屉 -->
    <Drawer title="任务详情">
      <template v-if="currentRecord">
        <a-descriptions
          :styles="{ label: { color: '#6b7280' } }"
          class="ml-1"
          :column="2"
          :items="detailItems"
        >
          <template #contentRender="{ item }">
            <template v-if="item.key === 'status'">
              <a-tag
                :color="STATUS_OPTIONS.find((o) => o.value === currentRecord?.status)?.color || 'default'"
              >
                {{ STATUS_OPTIONS.find((o) => o.value === currentRecord?.status)?.label || currentRecord?.status || '未知' }}
              </a-tag>
            </template>
            <template v-else-if="item.key === 'last_status'">
              <a-tag
                v-if="currentRecord?.last_status === 'completed'"
                color="success"
              >
                成功
              </a-tag>
              <a-tag
                v-else-if="currentRecord?.last_status === 'failed'"
                color="error"
              >
                失败
              </a-tag>
              <span v-else>-</span>
            </template>
          </template>
        </a-descriptions>

        <!-- 最近运行日志 -->
        <h4 class="mb-2 mt-4 text-sm font-medium text-gray-600">
          最近运行记录
        </h4>
        <a-table
          :data-source="taskLogs"
          :loading="logsLoading"
          :pagination="false"
          size="small"
          row-key="id"
          :columns="logColumns"
        />
      </template>
    </Drawer>
  </Page>
</template>
