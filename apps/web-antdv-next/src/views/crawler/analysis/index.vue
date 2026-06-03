
<script lang="ts" setup>
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { computed, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { mockAnalysisData, mockOverviewData, querySchema, useColumns } from './data';

const overview = ref(mockOverviewData);

const successRate = computed(() => {
  const total = overview.value.totalTasks;
  if (total === 0) return '0%';
  return ((overview.value.successTasks / total) * 100).toFixed(1) + '%';
});

const failRate = computed(() => {
  const total = overview.value.totalTasks;
  if (total === 0) return '0%';
  return ((overview.value.failTasks / total) * 100).toFixed(1) + '%';
});

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
        let data = [...mockAnalysisData];
        if (formValues?.crawler_name) {
          data = data.filter((item) =>
            item.crawler_name.includes(formValues.crawler_name),
          );
        }
        if (formValues?.status !== undefined && formValues?.status !== null) {
          data = data.filter((item) => item.status === formValues.status);
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

const [Drawer, drawerApi] = useVbenDrawer({
  destroyOnClose: true,
  footer: false,
  class: 'w-2/5',
});

const currentRecord = ref<any>(null);

function onActionClick({ code, row }: OnActionClickParams) {
  if (code === 'details') {
    currentRecord.value = row;
    drawerApi.open();
  }
}

const detailItems = computed(() => {
  const d = currentRecord.value;
  if (!d) return [];
  return [
    { key: 'crawler_name', label: '爬虫名称', content: d.crawler_name },
    { key: 'task_id', label: '任务 ID', content: d.task_id, span: 2 },
    { key: 'status', label: '状态' },
    {
      key: 'start_time',
      label: '开始时间',
      content: d.start_time,
    },
    {
      key: 'end_time',
      label: '结束时间',
      content: d.end_time,
    },
    {
      key: 'cost_time',
      label: '耗时(秒)',
      content: d.cost_time,
    },
    {
      key: 'data_count',
      label: '采集数',
      content: d.data_count,
    },
    {
      key: 'error_count',
      label: '错误数',
      content: d.error_count,
    },
    {
      key: 'avg_speed',
      label: '平均速度(条/秒)',
      content: d.avg_speed,
    },
    {
      key: 'data_size',
      label: '数据量',
      content: d.data_size,
    },
    {
      key: 'created_time',
      label: $t('common.table.created_time'),
      content: d.created_time,
      span: 2,
    },
  ];
});
</script>

<template>
  <Page auto-content-height>
    <!-- 统计概览 -->
    <div class="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      <a-card>
        <a-statistic
          title="总任务数"
          :value="overview.totalTasks"
          :value-style="{ color: '#1890ff' }"
        >
          <template #prefix>
            <span class="icon-[ant-design--schedule-outlined] mr-1" />
          </template>
        </a-statistic>
      </a-card>
      <a-card>
        <a-statistic
          title="成功率"
          :value="successRate"
          :value-style="{ color: '#52c41a' }"
        >
          <template #prefix>
            <span class="icon-[ant-design--check-circle-outlined] mr-1" />
          </template>
        </a-statistic>
      </a-card>
      <a-card>
        <a-statistic
          title="失败率"
          :value="failRate"
          :value-style="{ color: '#ff4d4f' }"
        >
          <template #prefix>
            <span class="icon-[ant-design--close-circle-outlined] mr-1" />
          </template>
        </a-statistic>
      </a-card>
      <a-card>
        <a-statistic
          title="今日采集量"
          :value="overview.todayDataCount"
          :value-style="{ color: '#722ed1' }"
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
    <Drawer title="执行记录详情">
      <a-descriptions
        :styles="{ label: { color: '#6b7280' } }"
        class="ml-1"
        :column="2"
        :items="detailItems"
      >
        <template #contentRender="{ item }">
          <template v-if="item.key === 'status'">
            <a-tag
              v-if="currentRecord?.status === 1"
              color="success"
            >
              成功
            </a-tag>
            <a-tag v-else color="error">失败</a-tag>
          </template>
        </template>
      </a-descriptions>
    </Drawer>
  </Page>
</template>
