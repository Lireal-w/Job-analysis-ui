
<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { CrawlTaskResult } from '#/api';

import { computed, onMounted, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getAllCrawlTaskApi,
  getCrawlTaskDashboardApi,
  getCrawlTaskLogsApi,
} from '#/api';

import { querySchema, useColumns } from './data';

// 仪表盘统计
const dashboardLoading = ref(true);
const dashboard = ref({
  totalTasks: 0,
  activeTasks: 0,
  completedTasks: 0,
  failedTasks: 0,
  totalRecords: 0,
});

const successRate = computed(() => {
  const total = dashboard.value.totalTasks;
  if (total === 0) return '0%';
  return (
    ((dashboard.value.completedTasks / total) * 100).toFixed(1) + '%'
  );
});

const activePercent = computed(() => {
  const total = dashboard.value.totalTasks;
  if (total === 0) return '0%';
  return (
    ((dashboard.value.activeTasks / total) * 100).toFixed(1) + '%'
  );
});

async function loadDashboard() {
  dashboardLoading.value = true;
  try {
    const data = await getCrawlTaskDashboardApi();
    // API 返回 snake_case，映射为 camelCase
    dashboard.value = {
      totalTasks: data.total_tasks ?? 0,
      activeTasks: data.active_tasks ?? 0,
      completedTasks: data.completed_tasks ?? 0,
      failedTasks: data.failed_tasks ?? 0,
      totalRecords: data.total_records ?? 0,
    };
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  } finally {
    dashboardLoading.value = false;
  }
}

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
        let data = await getAllCrawlTaskApi();
        if (formValues?.name) {
          data = data.filter((item) =>
            item.name.includes(formValues.name),
          );
        }
        if (formValues?.crawl_mode) {
          data = data.filter(
            (item) => item.crawl_mode === formValues.crawl_mode,
          );
        }
        if (formValues?.status) {
          data = data.filter(
            (item) => item.status === formValues.status,
          );
        }
        return data;
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

function onRefresh() {
  gridApi.query();
  loadDashboard();
}

const [Drawer, drawerApi] = useVbenDrawer({
  destroyOnClose: true,
  footer: false,
  class: 'w-2/5',
});

const currentRecord = ref<CrawlTaskResult | null>(null);
const taskLogs = ref<any[]>([]);
const logsLoading = ref(false);

async function onActionClick({
  code,
  row,
}: OnActionClickParams<CrawlTaskResult>) {
  if (code === 'details') {
    currentRecord.value = row;
    drawerApi.open();

    // 加载该任务的运行日志
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
}

const detailItems = computed(() => {
  const d = currentRecord.value;
  if (!d) return [];
  return [
    { key: 'name', label: '任务名称', content: d.name },
    { key: 'id', label: '任务 ID', content: d.id, span: 2 },
    { key: 'crawl_mode', label: '采集模式' },
    { key: 'status', label: '状态' },
    {
      key: 'schedule_type',
      label: '调度方式',
      content:
        d.schedule_type === 'crontab'
          ? d.cron_expr || 'Crontab'
          : d.schedule_type === 'interval'
            ? `间隔 ${d.interval_seconds || ''}秒`
            : '手动',
    },
    { key: 'target_storage', label: '目标存储', content: d.target_storage },
    { key: 'total_run_count', label: '执行次数', content: d.total_run_count },
    { key: 'total_records', label: '采集总数', content: d.total_records },
    { key: 'last_run_time', label: '上次运行', content: d.last_run_time || '-' },
    {
      key: 'last_duration',
      label: '上次耗时(秒)',
      content: d.last_duration != null ? String(d.last_duration) : '-',
    },
    {
      key: 'created_time',
      label: $t('common.table.created_time'),
      content: d.created_time,
      span: 2,
    },
  ];
});

onMounted(() => {
  loadDashboard();
});
</script>

<template>
  <Page auto-content-height>
    <!-- 统计概览 -->
    <div class="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      <a-card>
        <a-statistic
          title="总任务数"
          :value="dashboard.totalTasks"
          :value-style="{ color: '#1890ff' }"
          :loading="dashboardLoading"
        >
          <template #prefix>
            <span class="icon-[ant-design--schedule-outlined] mr-1" />
          </template>
        </a-statistic>
      </a-card>
      <a-card>
        <a-statistic
          title="进行中"
          :value="dashboard.activeTasks"
          :value-style="{ color: '#1890ff' }"
          :loading="dashboardLoading"
          :suffix="`/ ${dashboard.totalTasks}`"
        >
          <template #prefix>
            <span class="icon-[ant-design--loading-outlined] mr-1" />
          </template>
        </a-statistic>
      </a-card>
      <a-card>
        <a-statistic
          title="成功率"
          :value="successRate"
          :value-style="{ color: '#52c41a' }"
          :loading="dashboardLoading"
        >
          <template #prefix>
            <span class="icon-[ant-design--check-circle-outlined] mr-1" />
          </template>
        </a-statistic>
      </a-card>
      <a-card>
        <a-statistic
          title="总采集量"
          :value="dashboard.totalRecords"
          :value-style="{ color: '#722ed1' }"
          :loading="dashboardLoading"
        >
          <template #prefix>
            <span class="icon-[ant-design--database-outlined] mr-1" />
          </template>
        </a-statistic>
      </a-card>
    </div>

    <!-- 数据表格 -->
    <Grid />

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
                v-if="currentRecord?.status === 'running'"
                color="processing"
              >
                运行中
              </a-tag>
              <a-tag
                v-else-if="currentRecord?.status === 'completed'"
                color="success"
              >
                已完成
              </a-tag>
              <a-tag
                v-else-if="currentRecord?.status === 'failed'"
                color="error"
              >
                异常
              </a-tag>
              <a-tag v-else color="default">{{
                currentRecord?.status || '未知'
              }}</a-tag>
            </template>
            <template v-else-if="item.key === 'crawl_mode'">
              {{
                currentRecord?.crawl_mode === 'incremental'
                  ? '增量采集'
                  : '全量采集'
              }}
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
        >
          <a-table-column
            title="运行 ID"
            data-index="run_id"
            :width="180"
            ellipsis
          />
          <a-table-column title="状态" data-index="status" :width="80">
            <template #default="{ text }">
              <a-tag
                :color="
                  text === 'completed'
                    ? 'success'
                    : text === 'running'
                      ? 'processing'
                      : 'error'
                "
              >
                {{ text === 'completed' ? '成功' : text === 'running' ? '运行中' : '失败' }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            title="采集数"
            data-index="total_scraped"
            :width="70"
          />
          <a-table-column
            title="成功"
            data-index="total_succeeded"
            :width="70"
          />
          <a-table-column title="失败" data-index="total_failed" :width="70" />
          <a-table-column title="耗时(秒)" :width="90">
            <template #default="{ record }">
              {{ record.duration ?? '-' }}
            </template>
          </a-table-column>
          <a-table-column title="开始时间" data-index="start_time" :width="168" />
        </a-table>
      </template>
    </Drawer>
  </Page>
</template>
