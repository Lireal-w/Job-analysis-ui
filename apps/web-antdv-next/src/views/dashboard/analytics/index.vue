<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';

import { ref, onMounted } from 'vue';

import {
  AnalysisChartCard,
  AnalysisChartsTabs,
  AnalysisOverview,
} from '@vben/common-ui';
import {
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';

import { getAllCrawlTaskApi } from '#/api';
import { getServerMonitorApi } from '#/api/monitor';

import AnalyticsTrends from './analytics-trends.vue';
import AnalyticsVisitsData from './analytics-visits-data.vue';
import AnalyticsVisitsSales from './analytics-visits-sales.vue';
import AnalyticsVisitsSource from './analytics-visits-source.vue';
import AnalyticsVisits from './analytics-visits.vue';

const overviewItems = ref<AnalysisOverviewItem[]>([
  {
    icon: SvgCardIcon,
    title: '采集任务',
    totalTitle: '总任务数',
    totalValue: 0,
    value: 0,
  },
  {
    icon: SvgCakeIcon,
    title: '运行中任务',
    totalTitle: '活跃 Worker',
    totalValue: 0,
    value: 0,
  },
  {
    icon: SvgDownloadIcon,
    title: '在线 Worker',
    totalTitle: '总 Worker',
    totalValue: 0,
    value: 0,
  },
  {
    icon: SvgBellIcon,
    title: '告警数',
    totalTitle: '未处理告警',
    totalValue: 0,
    value: 0,
  },
]);

const loading = ref(true);

const chartTabs: TabOption[] = [
  {
    label: '流量趋势',
    value: 'trends',
  },
  {
    label: '月访问量',
    value: 'visits',
  },
];

const currentTab = ref('trends');

async function loadDashboardData() {
  loading.value = true;
  try {
    const [crawlRes, monitorRes] = await Promise.allSettled([
      getAllCrawlTaskApi(),
      getServerMonitorApi(),
    ]);

    // 采集任务数据 -> 概览卡片
    if (crawlRes.status === 'fulfilled' && crawlRes.value) {
      const tasks = crawlRes.value as any[];
      const activeTasks = tasks.filter(
        (t: any) => t.status === 1 || t.status === 'running',
      );
      overviewItems.value[0] = {
        ...overviewItems.value[0],
        totalValue: tasks.length,
        value: activeTasks.length,
      };
    }

    // 服务器监控数据
    if (monitorRes.status === 'fulfilled' && monitorRes.value) {
      // worker/online 信息
    }
  } catch (error) {
    console.error('加载仪表盘数据失败:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadDashboardData();
});
</script>

<template>
  <div class="p-5">
    <AnalysisOverview :items="overviewItems" :loading="loading" />
    <div class="mt-5">
      <AnalysisChartsTabs
        v-model:current-tab="currentTab"
        :loading="loading"
        :tab-options="chartTabs"
      >
        <template #trends>
          <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <div class="md:col-span-2 xl:col-span-2">
              <AnalysisChartCard>
                <AnalyticsTrends />
              </AnalysisChartCard>
            </div>
            <div class="md:col-span-1 xl:col-span-1">
              <AnalysisChartCard>
                <AnalyticsVisits />
              </AnalysisChartCard>
            </div>
          </div>
          <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <AnalysisChartCard>
              <AnalyticsVisitsSource />
            </AnalysisChartCard>
            <AnalysisChartCard>
              <AnalyticsVisitsSales />
            </AnalysisChartCard>
          </div>
        </template>
        <template #visits>
          <div class="grid grid-cols-1 gap-5">
            <AnalysisChartCard>
              <AnalyticsVisitsData />
            </AnalysisChartCard>
          </div>
        </template>
      </AnalysisChartsTabs>
    </div>
  </div>
</template>
