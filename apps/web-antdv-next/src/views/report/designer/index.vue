<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

import ChartPreview from './chart-preview.vue';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { getDatasetListApi } from '#/api';
import type { CreateReportParams } from '#/api';
import {
  createReportApi,
  createReportWidgetApi,
  deleteReportWidgetApi,
  getReportApi,
  getReportWidgetsApi,
  updateReportApi,
  updateReportWidgetApi,
} from '#/api';

import {
  createReportSchema,
  THEME_OPTIONS,
  WIDGET_TYPES,
} from './data';

const route = useRoute();
const router = useRouter();

// Report state
const reportId = ref<number | undefined>(
  route.params.id ? Number(route.params.id) : undefined,
);
const reportName = ref('未命名报表');
const reportDescription = ref('');
const reportTheme = ref('default');
const reportRefreshInterval = ref(0);

// Designer state
const widgets = ref<any[]>([]);
const selectedWidget = ref<any>(null);
const isDragging = ref(false);
const dragType = ref('');
const loading = ref(false);
const saving = ref(false);
const datasets = ref<any[]>([]);

// Canvas state
const canvasCols = 12;
const canvasScale = ref(1);
const canvasRef = ref<HTMLElement | null>(null);

// Widget drag-to-reposition state
const draggingWidget = ref<any>(null);
const dragOffset = ref({ x: 0, y: 0 });

// Resize state
const resizingWidget = ref<any>(null);
const resizeStart = ref({ x: 0, y: 0, cols: 0, rows: 0 });

// Load report data if editing
onMounted(async () => {
  try {
    const res = await getDatasetListApi({ page: 1, size: 100 });
    datasets.value = res.items || [];
  } catch {
    datasets.value = [];
  }

  if (reportId.value) {
    await loadReport(reportId.value);
  }
});

async function loadReport(id: number) {
  loading.value = true;
  try {
    const report = await getReportApi(id);
    reportName.value = report.name;
    reportDescription.value = report.description || '';
    reportTheme.value = report.theme || 'default';
    reportRefreshInterval.value = report.refresh_interval || 0;

    const widgetList = await getReportWidgetsApi(id);
    widgets.value = (widgetList || []).sort((a, b) => a.sort - b.sort);
  } catch (error) {
    console.error('Failed to load report:', error);
    message.error('加载报表失败');
  } finally {
    loading.value = false;
  }
}

// Widget management
function handleAddWidget(type: string) {
  const widgetType = WIDGET_TYPES.find((w) => w.type === type);
  if (!widgetType) return;

  // Auto-place widget in next available position
  const maxY = widgets.value.reduce((max, w) => {
    const wy = (w.position?.y || 0) + (w.config?.rows || 2);
    return wy > max ? wy : max;
  }, 0);

  const newWidget = {
    id: `new_${Date.now()}`,
    widget_type: type,
    title: `新${widgetType.label}`,
    query_sql: '',
    config: { cols: 4, rows: 2 },
    position: { x: 0, y: maxY },
    sort: widgets.value.length,
    _isNew: true,
  };
  widgets.value.push(newWidget);
  selectedWidget.value = newWidget;
  message.success(`已添加${widgetType.label}`);
}

// ===== 画布拖拽重新定位 =====
function handleWidgetMouseDown(e: MouseEvent, widget: any) {
  if (resizingWidget.value === widget) return;
  e.preventDefault();
  e.stopPropagation();
  handleSelectWidget(widget);
  draggingWidget.value = widget;
  const rect = (e.currentTarget as HTMLElement).parentElement!.getBoundingClientRect();
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
  document.addEventListener('mousemove', handleWidgetMouseMove);
  document.addEventListener('mouseup', handleWidgetMouseUp);
}

function handleWidgetMouseMove(e: MouseEvent) {
  if (!draggingWidget.value || !canvasRef.value) return;
  const canvasRect = canvasRef.value.getBoundingClientRect();
  const colWidth = canvasRect.width / canvasCols;
  const rowHeight = 120;

  const rawX = (e.clientX - canvasRect.left - dragOffset.value.x) / colWidth;
  const rawY = (e.clientY - canvasRect.top - dragOffset.value.y) / rowHeight;

  const newX = Math.max(0, Math.min(Math.round(rawX), canvasCols - (draggingWidget.value.config?.cols || 4)));
  const newY = Math.max(0, Math.round(rawY));

  draggingWidget.value.position = {
    ...draggingWidget.value.position,
    x: newX,
    y: newY,
  };
}

function handleWidgetMouseUp() {
  draggingWidget.value = null;
  document.removeEventListener('mousemove', handleWidgetMouseMove);
  document.removeEventListener('mouseup', handleWidgetMouseUp);
}

// ===== 缩放控制 =====
function handleZoomIn() {
  canvasScale.value = Math.min(2, canvasScale.value + 0.1);
}

function handleZoomOut() {
  canvasScale.value = Math.max(0.3, canvasScale.value - 0.1);
}

function handleZoomReset() {
  canvasScale.value = 1;
}

const zoomPercent = computed(() => {
  return Math.round(canvasScale.value * 100);
});

// ===== 调整大小 =====
function handleResizeStart(e: MouseEvent, widget: any) {
  e.preventDefault();
  e.stopPropagation();
  resizingWidget.value = widget;
  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    cols: widget.config?.cols || 4,
    rows: widget.config?.rows || 2,
  };
  document.addEventListener('mousemove', handleResizeMove);
  document.addEventListener('mouseup', handleResizeEnd);
}

function handleResizeMove(e: MouseEvent) {
  if (!resizingWidget.value || !canvasRef.value) return;
  const canvasRect = canvasRef.value.getBoundingClientRect();
  const colWidth = canvasRect.width / canvasCols;
  const rowHeight = 120;

  const dx = e.clientX - resizeStart.value.x;
  const dy = e.clientY - resizeStart.value.y;

  const newCols = Math.max(1, Math.min(12, resizeStart.value.cols + Math.round(dx / colWidth)));
  const newRows = Math.max(1, Math.min(6, resizeStart.value.rows + Math.round(dy / rowHeight)));

  resizingWidget.value.config = {
    ...resizingWidget.value.config,
    cols: newCols,
    rows: newRows,
  };
}

function handleResizeEnd() {
  resizingWidget.value = null;
  document.removeEventListener('mousemove', handleResizeMove);
  document.removeEventListener('mouseup', handleResizeEnd);
}

// ===== 生成 ECharts 预览配置 =====
function getChartOption(widget: any): Record<string, any> | null {
  const type = widget.widget_type;
  const colors = ['#4e79a7', '#e15759', '#59a14f', '#f28e2b', '#76b7b2', '#b07aa1', '#ff9da7'];

  if (type === 'bar') {
    return {
      grid: { top: 20, bottom: 20, left: 30, right: 10 },
      xAxis: { type: 'category', data: ['一月', '二月', '三月', '四月'], axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', show: false },
      series: [{ type: 'bar', data: [120, 200, 150, 80], itemStyle: { color: colors[0], borderRadius: [4, 4, 0, 0] } }],
      tooltip: { trigger: 'item' },
    };
  }
  if (type === 'line') {
    return {
      grid: { top: 20, bottom: 20, left: 30, right: 10 },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四'], axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', show: false },
      series: [{ type: 'line', data: [150, 230, 180, 280], smooth: true, lineStyle: { color: colors[1], width: 2 }, areaStyle: { color: colors[1], opacity: 0.15 } }],
      tooltip: { trigger: 'item' },
    };
  }
  if (type === 'pie') {
    return {
      series: [{
        type: 'pie',
        radius: ['30%', '65%'],
        center: ['50%', '50%'],
        data: [
          { value: 1048, name: '类别A' },
          { value: 735, name: '类别B' },
          { value: 580, name: '类别C' },
        ],
        label: { show: false },
        emphasis: { scale: false },
      }],
      tooltip: { trigger: 'item' },
    };
  }
  if (type === 'scatter') {
    return {
      grid: { top: 20, bottom: 20, left: 30, right: 10 },
      xAxis: { type: 'value', show: false },
      yAxis: { type: 'value', show: false },
      series: [{
        type: 'scatter',
        data: [[10, 30], [20, 50], [30, 80], [40, 40], [50, 90], [60, 60]],
        symbolSize: 8,
        itemStyle: { color: colors[3] },
      }],
      tooltip: { trigger: 'item' },
    };
  }
  if (type === 'area') {
    return {
      grid: { top: 20, bottom: 20, left: 30, right: 10 },
      xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'], axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', show: false },
      series: [{ type: 'line', data: [30, 70, 45, 90], smooth: true, lineStyle: { color: colors[4], width: 2 }, areaStyle: { color: colors[4], opacity: 0.3 } }],
      tooltip: { trigger: 'item' },
    };
  }
  return null;
}

function handleSelectWidget(widget: any) {
  selectedWidget.value = widget;
}

function handleRemoveWidget(widget: any) {
  const idx = widgets.value.indexOf(widget);
  if (idx > -1) {
    widgets.value.splice(idx, 1);
  }
  if (selectedWidget.value === widget) {
    selectedWidget.value = null;
  }
  message.success('已删除组件');
}

function handleWidgetTypeChange(widget: any, newType: string) {
  widget.widget_type = newType;
  const wt = WIDGET_TYPES.find((w) => w.type === newType);
  if (wt) {
    widget.title = `新${wt.label}`;
  }
}

// Save report
async function handleSave() {
  if (!reportName.value.trim()) {
    message.warning('请输入报表名称');
    return;
  }

  saving.value = true;
  try {
    if (reportId.value) {
      await updateReportApi(reportId.value, {
        name: reportName.value,
        description: reportDescription.value,
        theme: reportTheme.value,
        refresh_interval: reportRefreshInterval.value,
      });
    } else {
      const result = await createReportApi({
        name: reportName.value,
        description: reportDescription.value,
        theme: reportTheme.value,
        refresh_interval: reportRefreshInterval.value,
      });
      reportId.value = result.id;
      await router.replace(`/report/designer/${result.id}`);
    }

    // Save widgets
    for (const widget of widgets.value) {
      const widgetData = {
        widget_type: widget.widget_type,
        title: widget.title,
        query_sql: widget.query_sql,
        config: widget.config || {},
        position: widget.position || {},
        sort: widget.sort || 0,
        report_id: reportId.value,
      };

      if (widget._isNew && reportId.value) {
        await createReportWidgetApi(reportId.value, widgetData);
        widget._isNew = false;
      }
    }

    message.success('报表保存成功');
  } catch (error) {
    console.error('Failed to save report:', error);
    message.error('保存报表失败');
  } finally {
    saving.value = false;
  }
}

async function handleSaveWidget() {
  if (!selectedWidget.value || !reportId.value) return;

  try {
    const widget = selectedWidget.value;
    const widgetData = {
      widget_type: widget.widget_type,
      title: widget.title,
      query_sql: widget.query_sql,
      config: widget.config || {},
      position: widget.position || {},
      sort: widget.sort || 0,
      report_id: reportId.value!,
    };

    if (widget._isNew) {
      await createReportWidgetApi(reportId.value, widgetData);
      widget._isNew = false;
    } else if (widget.id) {
      await updateReportWidgetApi(widget.id, widgetData);
    }
    message.success('组件保存成功');
  } catch (error) {
    console.error('Failed to save widget:', error);
    message.error('保存组件失败');
  }
}

async function handleDeleteWidget() {
  if (!selectedWidget.value) return;
  if (selectedWidget.value.id && !selectedWidget.value._isNew) {
    try {
      await deleteReportWidgetApi(selectedWidget.value.id);
    } catch (error) {
      console.error('Failed to delete widget:', error);
    }
  }
  handleRemoveWidget(selectedWidget.value);
}

// Preview
function handlePreview() {
  if (!reportId.value) {
    message.warning('请先保存报表');
    return;
  }
  window.open(`/report/preview/${reportId.value}`, '_blank');
}

// Grid style for widget placement
function getWidgetStyle(widget: any) {
  const config = widget.config || {};
  const pos = widget.position || {};
  const cols = config.cols || 4;
  const rows = config.rows || 2;
  const colWidth = 100 / canvasCols;

  return {
    width: `calc(${colWidth * cols}% - 8px)`,
    left: `calc(${colWidth * (pos.x || 0)}% + 4px)`,
    top: `${(pos.y || 0) * 180 + 8}px`,
    minHeight: `${rows * 120}px`,
  };
}

// Drag from sidebar
function handleDragStart(type: string) {
  isDragging.value = true;
  dragType.value = type;
}

function handleDragEnd() {
  isDragging.value = false;
  dragType.value = '';
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  if (dragType.value) {
    handleAddWidget(dragType.value);
  }
  handleDragEnd();
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
}

// Chart color mapping
function labelForType(type: string): string {
  const found = WIDGET_TYPES.find((w) => w.type === type);
  return found ? found.label : '图表';
}

const chartColors: Record<string, string> = {
  bar: '#4e79a7',
  line: '#e15759',
  pie: '#59a14f',
  scatter: '#f28e2b',
  area: '#76b7b2',
  table: '#b07aa1',
  stat: '#ff9da7',
};

// Create report modal
const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  showDefaultActions: false,
  schema: createReportSchema,
});

const [Modal, modalApi] = useVbenModal({
  class: 'w-5/12',
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues() as Record<string, any>;
      try {
        const params: CreateReportParams = {
          name: data.name || '未命名报表',
          description: data.description || undefined,
          theme: data.theme || 'default',
          refresh_interval: data.refresh_interval || 0,
          is_public: data.is_public || false,
        };
        if (reportId.value) {
          await updateReportApi(reportId.value, params);
        } else {
          const result = await createReportApi(params);
          reportId.value = result.id;
          await router.replace(`/report/designer/${result.id}`);
        }
        message.success($t('ui.actionMessage.operationSuccess'));
        await modalApi.close();
        await formApi.resetForm();
      } catch (error) {
        console.error(error);
      } finally {
        modalApi.unlock();
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      formApi.resetForm();
      formApi.setValues({
        name: reportName.value,
        description: reportDescription.value,
        theme: reportTheme.value,
        refresh_interval: reportRefreshInterval.value,
      });
    }
  },
});
</script>

<template>
  <Page auto-content-height>
    <div class="report-designer flex h-full flex-col">
      <!-- Top Toolbar -->
      <div class="designer-toolbar flex items-center gap-2 border-b px-3 py-2">
        <div class="flex items-center gap-2">
          <input
            v-model="reportName"
            class="border-0 bg-transparent text-base font-medium outline-none"
            placeholder="输入报表名称..."
          />
        </div>
        <div class="ml-auto flex items-center gap-2">
          <!-- 缩放控制 -->
          <div class="zoom-controls flex items-center gap-1 rounded-md border px-1 py-0.5">
            <a-tooltip title="缩小">
              <button
                class="zoom-btn flex h-6 w-6 items-center justify-center rounded text-sm hover:bg-gray-100"
                :disabled="canvasScale <= 0.3"
                @click="handleZoomOut"
              >−</button>
            </a-tooltip>
            <span class="zoom-label min-w-[44px] text-center text-xs font-medium tabular-nums">
              {{ zoomPercent }}%
            </span>
            <a-tooltip title="放大">
              <button
                class="zoom-btn flex h-6 w-6 items-center justify-center rounded text-sm hover:bg-gray-100"
                :disabled="canvasScale >= 2"
                @click="handleZoomIn"
              >+</button>
            </a-tooltip>
            <a-tooltip title="重置缩放">
              <button
                class="zoom-btn flex h-6 w-6 items-center justify-center rounded text-xs hover:bg-gray-100"
                @click="handleZoomReset"
              >⟲</button>
            </a-tooltip>
          </div>
          <div class="ml-2 h-5 w-px bg-gray-200" />
          <select
            v-model="reportTheme"
            class="rounded border px-2 py-1 text-sm"
          >
            <option v-for="t in THEME_OPTIONS" :key="t.value" :value="t.value">
              {{ t.label }}
            </option>
          </select>
          <a-tooltip title="保存报表">
            <VbenButton
              type="primary"
              :loading="saving"
              icon="ant-design:save-outlined"
              @click="handleSave"
            >
              保存
            </VbenButton>
          </a-tooltip>
          <a-tooltip title="设置报表属性">
            <VbenButton icon="ant-design:setting-outlined" @click="() => modalApi.setData(null).open()">
              设置
            </VbenButton>
          </a-tooltip>
          <a-tooltip title="预览报表">
            <VbenButton icon="ant-design:eye-outlined" @click="handlePreview">
              预览
            </VbenButton>
          </a-tooltip>
        </div>
      </div>

      <!-- Designer Body -->
      <div class="designer-body flex flex-1 overflow-hidden">
        <!-- Left Sidebar - Widget Types -->
        <div class="widget-palette flex w-48 flex-shrink-0 flex-col border-r p-3">
          <h3 class="mb-3 text-xs font-semibold text-gray-500">组件类型</h3>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="wt in WIDGET_TYPES"
              :key="wt.type"
              class="widget-type-item flex cursor-grab flex-col items-center rounded-lg border p-2 text-center text-xs transition-all hover:border-primary hover:text-primary"
              :class="{ 'border-primary text-primary': selectedWidget?.widget_type === wt.type }"
              draggable="true"
              @dragstart="handleDragStart(wt.type)"
              @dragend="handleDragEnd"
              @click="handleAddWidget(wt.type)"
            >
              <div
                class="mb-1 h-8 w-8 rounded"
                :style="{ backgroundColor: chartColors[wt.type] || '#999' }"
              />
              <span class="truncate">{{ wt.label }}</span>
            </div>
          </div>
        </div>

        <!-- Center - Canvas -->
        <div
          class="canvas-wrapper flex-1 overflow-auto bg-gray-50/50"
        >
          <div
            ref="canvasRef"
            class="canvas-area relative m-4 min-h-[700px] rounded-xl border border-dashed border-gray-300 bg-white shadow-sm transition-all"
            :class="{
              'dragging-over': isDragging,
              'cursor-grab': !selectedWidget,
            }"
            :style="{ transform: `scale(${canvasScale})`, transformOrigin: 'top left' }"
            @drop="handleDrop"
            @dragover="handleDragOver"
          >
            <!-- 网格背景 -->
            <svg class="canvas-grid pointer-events-none absolute inset-0 h-full w-full">
              <defs>
                <pattern id="grid-dots" x="0" y="0" width="8.33333%" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="#e5e7eb" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-dots)" />
              <!-- 列分割线 -->
              <line
                v-for="i in 11" :key="'col-'+i"
                :x1="(i / 12) * 100 + '%'" y1="0"
                :x2="(i / 12) * 100 + '%'" y2="100%"
                stroke="#f3f4f6" stroke-width="1"
              />
            </svg>

            <!-- 空状态 -->
            <div v-if="widgets.length === 0" class="flex h-full min-h-[300px] items-center justify-center">
              <div class="text-center text-sm text-gray-400">
                <div class="mb-2 text-4xl">📊</div>
                <p>从左侧拖拽组件到此处，或点击组件添加</p>
              </div>
            </div>

            <!-- 组件 -->
            <div
              v-for="(widget, index) in widgets"
              :key="widget.id || index"
              class="widget-canvas-item absolute rounded-lg border-2 p-0 transition-shadow"
              :class="{
                'border-primary shadow-lg ring-2 ring-primary/20': selectedWidget?.id === widget.id,
                'border-gray-200 hover:border-gray-400 hover:shadow-md': selectedWidget?.id !== widget.id,
                'opacity-60': draggingWidget === widget,
              }"
              :style="getWidgetStyle(widget)"
              @mousedown="handleWidgetMouseDown($event, widget)"
              @click="handleSelectWidget(widget)"
            >
              <!-- 标题栏 -->
              <div
                class="widget-header flex cursor-move items-center justify-between rounded-t-lg border-b border-gray-100 bg-gray-50/80 px-3 py-2"
                @mousedown="handleWidgetMouseDown($event, widget)"
              >
                <div class="flex items-center gap-2 overflow-hidden">
                  <span
                    class="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                    :style="{ backgroundColor: chartColors[widget.widget_type] || '#999' }"
                  />
                  <h4 class="truncate text-sm font-medium text-gray-700">{{ widget.title }}</h4>
                </div>
                <div class="flex shrink-0 gap-0.5">
                  <span
                    class="rounded bg-gray-200/70 px-1.5 py-0.5 text-[10px] text-gray-500"
                  >{{ labelForType(widget.widget_type) }}</span>
                  <button
                    class="ml-1 flex h-5 w-5 items-center justify-center rounded text-xs text-gray-400 hover:bg-red-50 hover:text-red-500"
                    @click.stop="handleRemoveWidget(widget)"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- 内容区 -->
              <div class="widget-content flex items-center justify-center px-3 pb-3 pt-2" :style="{ minHeight: '80px' }">
                <template v-if="widget.widget_type === 'stat'">
                  <div class="text-center">
                    <div class="text-2xl font-bold" :style="{ color: chartColors[widget.widget_type] }">12,847</div>
                    <div class="mt-0.5 text-xs text-gray-500">{{ widget.title || '统计值' }}</div>
                    <div class="mt-1 flex items-center justify-center gap-2 text-[10px]">
                      <span class="text-green-500">↑ 12.5%</span>
                      <span class="text-gray-400">较上月</span>
                    </div>
                  </div>
                </template>
                <template v-else-if="widget.widget_type === 'table'">
                  <div class="w-full text-xs text-gray-400">
                    <div class="mb-1 grid grid-cols-4 gap-1 rounded bg-gray-50 px-2 py-1 font-medium text-gray-500">
                      <span>列A</span><span>列B</span><span>列C</span><span>列D</span>
                    </div>
                    <div v-for="r in 3" :key="r" class="grid grid-cols-4 gap-1 border-b border-gray-50 px-2 py-1">
                      <span>数据{{ r }}A</span><span>数据{{ r }}B</span><span>数据{{ r }}C</span><span>数据{{ r }}D</span>
                    </div>
                  </div>
                </template>
                <template v-else-if="getChartOption(widget)">
                  <div class="h-full w-full" style="min-height:80px">
                    <ChartPreview
                      :key="`chart-${widget.id || index}`"
                      :height="`${Math.max(80, ((widget.config?.rows || 2) * 120) - 80)}px`"
                      :option="getChartOption(widget)"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="flex flex-col items-center gap-1">
                    <div
                      class="h-12 w-20 rounded opacity-30"
                      :style="{ backgroundColor: chartColors[widget.widget_type] || '#999' }"
                    />
                    <span class="text-xs text-gray-400">{{ labelForType(widget.widget_type) }}</span>
                  </div>
                </template>
              </div>

              <!-- 右下角调整大小手柄 -->
              <div
                class="resize-handle absolute bottom-0 right-0 z-10 h-4 w-4 cursor-se-resize"
                @mousedown.stop="handleResizeStart($event, widget)"
              >
                <svg viewBox="0 0 10 10" class="h-full w-full text-gray-400">
                  <path d="M1 9 L9 1 M4 9 L9 4 M7 9 L9 7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
                </svg>
              </div>

              <!-- 选中指示条 -->
              <div
                v-if="selectedWidget?.id === widget.id"
                class="pointer-events-none absolute -inset-[3px] rounded-lg border-2 border-primary/40"
              />
            </div>
          </div>
        </div>

        <!-- Right Sidebar - Widget Config -->
        <div class="widget-config w-72 flex-shrink-0 border-l p-3 overflow-y-auto">
          <h3 class="mb-3 text-xs font-semibold text-gray-500">组件配置</h3>
          <template v-if="selectedWidget">
            <!-- 基本信息 -->
            <div class="space-y-3">
              <div>
                <label class="mb-1 block text-xs text-gray-500">组件标题</label>
                <input
                  v-model="selectedWidget.title"
                  class="w-full rounded border px-2 py-1.5 text-sm"
                  placeholder="输入标题"
                />
              </div>
              <div>
                <label class="mb-1 block text-xs text-gray-500">组件类型</label>
                <select
                  v-model="selectedWidget.widget_type"
                  class="w-full rounded border px-2 py-1.5 text-sm"
                  @change="handleWidgetTypeChange(selectedWidget, selectedWidget.widget_type)"
                >
                  <option v-for="wt in WIDGET_TYPES" :key="wt.type" :value="wt.type">
                    {{ wt.label }}
                  </option>
                </select>
              </div>

              <!-- 位置和尺寸 -->
              <div class="border-t border-gray-100 pt-2">
                <label class="mb-2 block text-xs font-medium text-gray-500">位置 &amp; 尺寸</label>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="mb-1 block text-[10px] text-gray-400">X 位置</label>
                    <input
                      v-model.number="selectedWidget.position.x"
                      class="w-full rounded border px-2 py-1.5 text-sm"
                      type="number"
                      min="0"
                      max="11"
                    />
                  </div>
                  <div>
                    <label class="mb-1 block text-[10px] text-gray-400">Y 位置</label>
                    <input
                      v-model.number="selectedWidget.position.y"
                      class="w-full rounded border px-2 py-1.5 text-sm"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div>
                    <label class="mb-1 block text-[10px] text-gray-400">宽度 (格)</label>
                    <input
                      v-model.number="selectedWidget.config.cols"
                      class="w-full rounded border px-2 py-1.5 text-sm"
                      type="number"
                      min="1"
                      max="12"
                    />
                  </div>
                  <div>
                    <label class="mb-1 block text-[10px] text-gray-400">高度 (格)</label>
                    <input
                      v-model.number="selectedWidget.config.rows"
                      class="w-full rounded border px-2 py-1.5 text-sm"
                      type="number"
                      min="1"
                      max="6"
                    />
                  </div>
                </div>
              </div>

              <!-- 查询配置 -->
              <div class="border-t border-gray-100 pt-2">
                <label class="mb-1 block text-xs font-medium text-gray-500">数据源配置</label>
                <div class="mb-2">
                  <label class="mb-1 block text-[10px] text-gray-400">数据集</label>
                  <select
                    v-model="selectedWidget.query_id"
                    class="w-full rounded border px-2 py-1.5 text-sm"
                  >
                    <option :value="null">无</option>
                    <option v-for="ds in datasets" :key="ds.id" :value="ds.id">
                      {{ ds.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="mb-1 block text-[10px] text-gray-400">查询SQL</label>
                  <textarea
                    v-model="selectedWidget.query_sql"
                    class="w-full resize-none rounded border px-2 py-1.5 font-mono text-sm"
                    rows="3"
                    placeholder="SELECT ..."
                  />
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex gap-2 border-t border-gray-100 pt-3">
                <VbenButton type="primary" class="!h-7 !px-3 !py-0 text-xs" @click="handleSaveWidget">
                  保存组件
                </VbenButton>
                <VbenButton danger class="!h-7 !px-3 !py-0 text-xs" @click="handleDeleteWidget">
                  删除
                </VbenButton>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex h-full flex-col items-center justify-center py-12 text-center">
              <div class="mb-2 text-3xl text-gray-300">👆</div>
              <div class="text-xs text-gray-400">点击画布中的组件进行配置</div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Report Settings Modal -->
    <Modal :title="reportId ? '编辑报表' : '新建报表'">
      <Form />
    </Modal>
  </Page>
</template>

<style scoped>
/* ===== 设计器整体布局 ===== */
.report-designer {
  min-height: 100%;
  height: 100%;
}

.designer-toolbar {
  min-height: 48px;
  background: hsl(var(--background));
}

/* ===== 调色板 ===== */
.widget-palette {
  background: hsl(var(--background));
}

.widget-type-item {
  transition: all 0.15s ease;
  user-select: none;
}

.widget-type-item:active {
  transform: scale(0.95);
}

.widget-type-item[draggable="true"] {
  cursor: grab;
}

.widget-type-item[draggable="true"]:active {
  cursor: grabbing;
}

/* ===== 画布区域 ===== */
.canvas-wrapper {
  background-image:
    linear-gradient(45deg, hsl(var(--muted) / 0.3) 25%, transparent 25%),
    linear-gradient(-45deg, hsl(var(--muted) / 0.3) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, hsl(var(--muted) / 0.3) 75%),
    linear-gradient(-45deg, transparent 75%, hsl(var(--muted) / 0.3) 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0;
}

.canvas-area {
  transition: box-shadow 0.2s ease;
  width: calc(100% - 32px);
}

.canvas-area.dragging-over {
  border-color: hsl(var(--primary) / 0.5);
  background: hsl(var(--primary) / 0.03);
  box-shadow: 0 0 0 2px hsl(var(--primary) / 0.08);
}

/* ===== 组件项 ===== */
.widget-canvas-item {
  transition:
    box-shadow 0.15s ease,
    border-color 0.15s ease,
    left 0.1s ease,
    top 0.1s ease;
  background: hsl(var(--background));
  z-index: 1;
}

.widget-canvas-item:hover {
  z-index: 2;
}

.widget-canvas-item:has(.resize-handle:hover) {
  user-select: none;
}

/* ===== 组件标题栏 ===== */
.widget-header {
  user-select: none;
}

/* ===== 组件内容区 ===== */
.widget-content {
  overflow: hidden;
}

/* ===== 调整大小手柄 ===== */
.resize-handle {
  opacity: 0;
  transition: opacity 0.15s ease;
}

.widget-canvas-item:hover .resize-handle,
.widget-canvas-item:focus-within .resize-handle {
  opacity: 1;
}

.resize-handle:hover {
  color: hsl(var(--primary)) !important;
}

.resize-handle::after {
  content: '';
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

/* ===== 缩放控件 ===== */
.zoom-controls {
  background: hsl(var(--background));
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.zoom-btn:not(:disabled):hover {
  background: hsl(var(--accent));
}

/* ===== 右侧配置面板 ===== */
.widget-config {
  background: hsl(var(--background));
}

.widget-config input[type="number"] {
  -moz-appearance: textfield;
}

.widget-config input[type="number"]::-webkit-inner-spin-button,
.widget-config input[type="number"]::-webkit-outer-spin-button {
  opacity: 0.5;
}

/* ===== 滚动条美化 ===== */
.canvas-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.canvas-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.canvas-wrapper::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 4px;
}

.canvas-wrapper::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground));
}
</style>
