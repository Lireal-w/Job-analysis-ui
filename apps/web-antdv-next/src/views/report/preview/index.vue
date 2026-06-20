<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

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
    width: `${colWidth * cols}%`,
    left: `${colWidth * (pos.x || 0)}%`,
    top: `${(pos.y || 0) * 180 + 8}px`,
    minHeight: `${rows * 120}px`,
  };
}

function labelForType(type: string): string {
  return WIDGET_LABELS[type] || '图表';
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
          <p v-if="report?.description" class="mt-1 text-sm text-gray-500">
            {{ report.description }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <a-button @click="router.push(`/report/designer/${reportId}`)">
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
      <div v-else class="relative min-h-[600px] p-4">
        <div
          v-for="(widget, index) in widgets"
          :key="widget.id || index"
          class="absolute rounded-lg border p-4"
          :style="getWidgetStyle(widget)"
        >
          <div class="mb-3 flex items-center justify-between">
            <h4 class="text-sm font-medium">{{ widget.title || labelForType(widget.widget_type) }}</h4>
            <span
              class="rounded px-2 py-0.5 text-xs text-white"
              :style="{ backgroundColor: chartColors[widget.widget_type] || '#999' }"
            >
              {{ labelForType(widget.widget_type) }}
            </span>
          </div>

          <div class="flex h-full items-center justify-center text-gray-400">
            <!-- 统计数值 -->
            <template v-if="widget.widget_type === 'stat'">
              <div class="text-center">
                <div
                  class="text-3xl font-bold"
                  :style="{ color: chartColors[widget.widget_type] }"
                >
                  --
                </div>
                <div class="mt-1 text-xs text-gray-500">
                  {{ widget.title }}
                </div>
              </div>
            </template>

            <!-- 数据表格 -->
            <template v-else-if="widget.widget_type === 'table'">
              <div class="w-full text-center text-sm text-gray-400">
                数据表格（运行查询后显示）
              </div>
            </template>

            <!-- 图表 -->
            <template v-else>
              <div class="flex flex-col items-center gap-2">
                <div
                  class="h-20 w-32 rounded opacity-30"
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
