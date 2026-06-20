<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

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

// Canvas grid
const canvasCols = 12;

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

  const newWidget = {
    id: `new_${Date.now()}`,
    widget_type: type,
    title: `新${widgetType.label}`,
    query_sql: '',
    config: { cols: 4, rows: 2 },
    position: { x: 0, y: 0 },
    sort: widgets.value.length,
    _isNew: true,
  };
  widgets.value.push(newWidget);
  selectedWidget.value = newWidget;
  message.success(`已添加${widgetType.label}`);
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
    width: `${colWidth * cols}%`,
    left: `${colWidth * (pos.x || 0)}%`,
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
          class="canvas-area flex-1 overflow-auto p-4"
          :class="{ 'dragging-over': isDragging }"
          @drop="handleDrop"
          @dragover="handleDragOver"
        >
          <div v-if="widgets.length === 0" class="flex h-full items-center justify-center">
            <div class="text-center text-sm text-gray-400">
              <div class="mb-2 text-4xl">📊</div>
              <p>从左侧拖拽组件到此处，或点击组件添加</p>
            </div>
          </div>
          <div
            v-for="(widget, index) in widgets"
            :key="widget.id || index"
            class="widget-canvas-item absolute cursor-pointer rounded-lg border-2 p-3 transition-all"
            :class="{
              'border-primary shadow-md': selectedWidget?.id === widget.id,
              'border-transparent hover:border-gray-300': selectedWidget?.id !== widget.id,
            }"
            :style="getWidgetStyle(widget)"
            @click="handleSelectWidget(widget)"
          >
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium truncate">{{ widget.title }}</h4>
              <div class="flex gap-1">
                <button
                  class="flex h-6 w-6 items-center justify-center rounded text-xs hover:bg-gray-100"
                  @click.stop="handleRemoveWidget(widget)"
                >
                  ×
                </button>
              </div>
            </div>
            <div class="mt-2 flex h-full items-center justify-center text-xs text-gray-400">
              <template v-if="widget.widget_type === 'stat'">
                <div class="text-center">
                  <div class="text-2xl font-bold" :style="{ color: chartColors[widget.widget_type] }">--</div>
                  <div class="mt-1 text-xs text-gray-500">{{ widget.title }}</div>
                </div>
              </template>
              <template v-else-if="widget.widget_type === 'table'">
                <div class="text-gray-400">数据表格</div>
              </template>
              <template v-else>
                <div class="flex flex-col items-center gap-1">
                  <div
                    class="h-16 w-24 rounded opacity-40"
                    :style="{ backgroundColor: chartColors[widget.widget_type] || '#999' }"
                  />
                  <span>{{ chartColors[widget.widget_type] ? labelForType(widget.widget_type) : '图表' }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Right Sidebar - Widget Config -->
        <div class="widget-config w-72 flex-shrink-0 border-l p-3 overflow-y-auto">
          <h3 class="mb-3 text-xs font-semibold text-gray-500">组件配置</h3>
          <template v-if="selectedWidget">
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
              <div>
                <label class="mb-1 block text-xs text-gray-500">查询SQL</label>
                <textarea
                  v-model="selectedWidget.query_sql"
                  class="w-full resize-none rounded border px-2 py-1.5 font-mono text-sm"
                  rows="4"
                  placeholder="SELECT ..."
                />
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="mb-1 block text-xs text-gray-500">宽度 (格)</label>
                  <input
                    v-model.number="selectedWidget.config.cols"
                    class="w-full rounded border px-2 py-1.5 text-sm"
                    type="number"
                    min="1"
                    max="12"
                  />
                </div>
                <div>
                  <label class="mb-1 block text-xs text-gray-500">高度 (格)</label>
                  <input
                    v-model.number="selectedWidget.config.rows"
                    class="w-full rounded border px-2 py-1.5 text-sm"
                    type="number"
                    min="1"
                    max="6"
                  />
                </div>
              </div>
              <div class="flex gap-2 pt-2">
                <VbenButton type="primary" class="!h-7 !px-2 !py-0 text-xs" @click="handleSaveWidget">
                  保存组件
                </VbenButton>
                <VbenButton danger class="!h-7 !px-2 !py-0 text-xs" @click="handleDeleteWidget">
                  删除组件
                </VbenButton>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="py-8 text-center text-xs text-gray-400">
              选择一个组件进行配置
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
.report-designer {
  min-height: 100%;
}

.designer-toolbar {
  background-color: var(--vben-card-bg);
  border-color: var(--vben-border-color);
}

.designer-body {
  background-color: var(--vben-bg-color);
}

.widget-palette {
  background-color: var(--vben-card-bg);
  border-color: var(--vben-border-color);
}

.widget-type-item {
  background-color: var(--vben-bg-color);
  border-color: var(--vben-border-color);
  transition: all 0.2s;
}

.widget-type-item:hover {
  border-color: var(--vben-primary-color);
  color: var(--vben-primary-color);
}

.canvas-area {
  background-color: var(--vben-bg-color);
  position: relative;
  min-height: 600px;
}

.canvas-area.dragging-over {
  background-color: var(--vben-primary-bg);
}

.widget-canvas-item {
  background-color: var(--vben-card-bg);
  border-color: var(--vben-border-color);
  transition: all 0.2s;
}

.widget-canvas-item:hover {
  border-color: var(--vben-primary-color);
}

.widget-config {
  background-color: var(--vben-card-bg);
  border-color: var(--vben-border-color);
}
</style>
