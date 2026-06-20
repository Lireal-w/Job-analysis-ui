<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import ChartPreview from '../designer/chart-preview.vue';

import { message } from 'antdv-next';

import { getReportApi, getReportWidgetsApi } from '#/api';

import { WIDGET_TYPES } from '../designer/data';

const route = useRoute();
const router = useRouter();

const reportId = Number(route.params.id);
const loading = ref(true);
const report = ref<any>(null);
const widgets = ref<any[]>([]);

const WIDGET_LABELS: Record<string, string> = {};
WIDGET_TYPES.forEach((w: any) => {
  WIDGET_LABELS[w.type] = w.label;
});

const chartColors: Record<string, string> = {
  bar: '#4e79a7',
  line: '#e15759',
  pie: '#59a14f',
  scatter: '#f28e2b',
  area: '#76b7b2',
  table: '#b07aa1',
  stat: '#ff9da7',
};

onMounted(async () => {
  if (!reportId) {
    message.error('报表 ID 无效');
    router.push('/report/list');
    return;
  }
  await loadReport();
});

async function loadReport() {
  loading.value = true;
  try {
    const reportData = await getReportApi(reportId);
    report.value = reportData;

    const widgetList = await getReportWidgetsApi(reportId);
    widgets.value = (widgetList || []).sort((a: any, b: any) => a.sort - b.sort);
  } catch (error) {
    console.error('Failed to load report:', error);
    message.error('加载报表失败');
  } finally {
    loading.value = false;
  }
}

const gridCols = 12;

function getWidgetStyle(widget: any) {
  const config = widget.config || {};
  const pos = widget.position || {};
  const cols = config.cols || 4;
  const rows = config.rows || 2;
  const colWidth = 100 / gridCols;
  return {
    width: `calc(${colWidth * cols}% - 8px)`,
    left: `calc(${colWidth * (pos.x || 0)}% + 4px)`,
    top: `${(pos.y || 0) * 180 + 8}px`,
    minHeight: `${rows * 120}px`,
  };
}

function labelForType(type: string): string {
  return WIDGET_LABELS[type] || '图表';
}

// ===== 生成 ECharts 图表配置 =====
function getChartOption(widget: any): Record<string, any> | null {
  const type = widget.widget_type;
  const colors = ['#4e79a7', '#e15759', '#59a14f', '#f28e2b', '#76b7b2', '#b07aa1', '#ff9da7'];

  if (type === 'bar') {
    return {
      grid: { top: 30, bottom: 30, left: 40, right: 20 },
      xAxis: { type: 'category', data: ['一月', '二月', '三月', '四月', '五月', '六月'], axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'bar', data: [120, 200, 150, 80, 210, 130], itemStyle: { color: colors[0], borderRadius: [6, 6, 0, 0] } }],
      tooltip: { trigger: 'axis' },
    };
  }
  if (type === 'line') {
    return {
      grid: { top: 30, bottom: 30, left: 40, right: 20 },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六'], axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'line', data: [150, 230, 180, 280, 200, 300], smooth: true, lineStyle: { color: colors[1], width: 2 }, areaStyle: { color: colors[1], opacity: 0.15 }, symbol: 'circle', symbolSize: 6 }],
      tooltip: { trigger: 'axis' },
    };
  }
  if (type === 'pie') {
    return {
      series: [{
        type: 'pie',
        radius: ['35%', '65%'],
        center: ['50%', '50%'],
        data: [
          { value: 1048, name: '类别A' },
          { value: 735, name: '类别B' },
          { value: 580, name: '类别C' },
          { value: 420, name: '类别D' },
        ],
        label: { fontSize: 11 },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' },
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.2)' },
        },
      }],
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    };
  }
  if (type === 'scatter') {
    return {
      grid: { top: 30, bottom: 30, left: 40, right: 20 },
      xAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{
        type: 'scatter',
        data: [[10, 30], [20, 50], [30, 80], [40, 40], [50, 90], [60, 60], [25, 70], [45, 55], [35, 25]],
        symbolSize: 10,
        itemStyle: { color: colors[3] },
      }],
      tooltip: { trigger: 'item', formatter: '({c})' },
    };
  }
  if (type === 'area') {
    return {
      grid: { top: 30, bottom: 30, left: 40, right: 20 },
      xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'], axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{ type: 'line', data: [30, 70, 45, 90], smooth: true, lineStyle: { color: colors[4], width: 2 }, areaStyle: { color: colors[4], opacity: 0.35 }, symbol: 'circle', symbolSize: 6 }],
      tooltip: { trigger: 'axis' },
    };
  }
  return null;
}
</script>

<template>
  <Page>
    <!-- 加载中 -->
    <div v-if="loading" class="flex h-96 items-center justify-center">
      <a-spin size="large" />
    </div>

    <template v-else>
      <!-- 顶栏 -->
      <div class="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h1 class="text-lg font-medium">{{ report?.name || '报表预览' }}</h1>
          <div class="mt-1 flex items-center gap-3 text-sm text-gray-500">
            <span v-if="report?.theme">主题：{{ report.theme }}</span>
            <span v-if="report?.refresh_interval">
              自动刷新：每 {{ report.refresh_interval }} 秒
            </span>
            <span v-if="report?.description" class="max-w-md truncate">
              {{ report.description }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <a-button type="primary" @click="router.push(`/report/designer/${reportId}`)">
            编辑报表
          </a-button>
          <a-button @click="router.push('/report/list')">
            返回列表
          </a-button>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-if="widgets.length === 0"
        class="flex h-64 items-center justify-center text-gray-400"
      >
        <div class="text-center">
          <div class="mb-2 text-4xl">📊</div>
          <p>暂无组件，请先在设计器中添加</p>
        </div>
      </div>

      <!-- 组件网格 -->
      <div v-else class="relative min-h-[600px] bg-gray-50/50 p-4">
        <div
          v-for="(widget, index) in widgets"
          :key="widget.id || index"
          class="absolute rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          :style="getWidgetStyle(widget)"
        >
          <!-- 头部 -->
          <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h4 class="text-sm font-medium text-gray-700">
              {{ widget.title || labelForType(widget.widget_type) }}
            </h4>
            <span
              class="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white"
              :style="{ backgroundColor: chartColors[widget.widget_type] || '#999' }"
            >
              {{ labelForType(widget.widget_type) }}
            </span>
          </div>

          <!-- 内容区 -->
          <div class="flex items-center justify-center p-3" :style="{ minHeight: `${Math.max(100, ((widget.config?.rows || 2) * 120) - 80)}px` }">
            <!-- 统计数值 -->
            <template v-if="widget.widget_type === 'stat'">
              <div class="text-center">
                <div
                  class="text-3xl font-bold"
                  :style="{ color: chartColors[widget.widget_type] }"
                >
                  12,847
                </div>
                <div class="mt-1 text-sm text-gray-500">
                  {{ widget.title }}
                </div>
                <div class="mt-2 flex items-center justify-center gap-3 text-xs">
                  <span class="text-green-500">↑ 12.5%</span>
                  <span class="text-gray-400">较上月</span>
                </div>
              </div>
            </template>

            <!-- 数据表格 -->
            <template v-else-if="widget.widget_type === 'table'">
              <div class="w-full text-xs">
                <div class="mb-1 grid grid-cols-4 gap-1 rounded bg-gray-100 px-3 py-2 font-medium text-gray-600">
                  <span>列A</span><span>列B</span><span>列C</span><span>列D</span>
                </div>
                <div v-for="r in 4" :key="r" class="grid grid-cols-4 gap-1 border-b border-gray-50 px-3 py-2 text-gray-500">
                  <span>数据{{ r }}A</span><span>数据{{ r }}B</span><span>数据{{ r }}C</span><span>数据{{ r }}D</span>
                </div>
              </div>
            </template>

            <!-- 图表 (ECharts) -->
            <template v-else-if="getChartOption(widget)">
              <ChartPreview
                :key="`preview-chart-${widget.id || index}`"
                class="h-full w-full"
                :height="`${Math.max(100, ((widget.config?.rows || 2) * 120) - 80)}px`"
                :option="getChartOption(widget)"
              />
            </template>

            <!-- 回退显示 -->
            <template v-else>
              <div class="flex flex-col items-center gap-2 text-gray-400">
                <div
                  class="h-16 w-28 rounded opacity-25"
                  :style="{ backgroundColor: chartColors[widget.widget_type] || '#999' }"
                />
                <span class="text-xs">{{ labelForType(widget.widget_type) }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </Page>
</template>
