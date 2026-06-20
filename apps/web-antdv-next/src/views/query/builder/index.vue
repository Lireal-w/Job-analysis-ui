<script setup lang="ts">
import { ref, watch } from 'vue';

import {
  Page,
  useVbenModal,
  VbenButton,
} from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  executeQueryApi,
  getAllDatasetApi,
  getSavedQueryListApi,
} from '#/api';
import type { CreateSavedQueryParams, DatasetResult } from '#/api';

import { DEFAULT_SQL_TEMPLATE, saveQuerySchema } from './data';

// Query Builder state
const querySql = ref(DEFAULT_SQL_TEMPLATE);
const queryLoading = ref(false);
const queryResult = ref<{
  columns: string[];
  rows: Record<string, any>[];
  total: number;
  duration: number;
  error_message: string | null;
  status: string;
} | null>(null);
const activeTab = ref<'result' | 'history'>('result');
const selectedDataset = ref<number | undefined>(undefined);
const datasetList = ref<DatasetResult[]>([]);
const savedQueryList = ref<any[]>([]);
const sideCollapsed = ref(false);

// Fetch datasets for sidebar
async function loadDatasets() {
  try {
    const res = await getAllDatasetApi();
    datasetList.value = res;
  } catch (error) {
    console.error('Failed to load datasets:', error);
  }
}

async function loadSavedQueries() {
  try {
    const res = await getSavedQueryListApi({ page: 1, size: 50 });
    savedQueryList.value = res.items || [];
  } catch (error) {
    console.error('Failed to load saved queries:', error);
  }
}

loadDatasets();
loadSavedQueries();

// Execute query
async function handleExecute() {
  if (!querySql.value.trim()) {
    message.warning('请输入SQL查询语句');
    return;
  }

  queryLoading.value = true;
  queryResult.value = null;
  try {
    const result = await executeQueryApi({
      query_sql: querySql.value,
      dataset_id: selectedDataset.value,
      limit: 1000,
    });
    queryResult.value = result;
    activeTab.value = 'result';
    if (result.status === 'error') {
      message.error(`查询执行失败: ${result.error_message}`);
    } else {
      message.success(`查询成功，返回 ${result.total} 条记录，耗时 ${result.duration}ms`);
    }
  } catch (error: any) {
    message.error(`查询执行失败: ${error.message || '未知错误'}`);
  } finally {
    queryLoading.value = false;
  }
}

// Format SQL
function handleFormatSql() {
  try {
    const sql = querySql.value
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\s*=\s*/g, ' = ')
      .replace(/\s*([()])\s*/g, ' $1 ')
      .trim();
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'AS', 'IN', 'NOT', 'NULL', 'IS', 'LIKE', 'BETWEEN', 'EXISTS', 'UNION', 'ALL', 'DISTINCT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'TABLE', 'INDEX', 'VIEW'];
    let formatted = sql;
    for (const kw of keywords) {
      formatted = formatted.replace(new RegExp(`\\b${kw}\\b`, 'gi'), `\n${kw}`);
    }
    querySql.value = formatted.trim();
  } catch {
    // ignore formatting errors
  }
}

// Clear result
function handleClear() {
  queryResult.value = null;
}

// Select saved query
function handleSelectSavedQuery(query: any) {
  querySql.value = query.query_sql;
  selectedDataset.value = query.dataset_id || undefined;
}

// Select dataset
function handleSelectDataset(dataset: DatasetResult) {
  selectedDataset.value = dataset.id;
}

// Save Query Modal
const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  showDefaultActions: false,
  schema: saveQuerySchema,
});

const saveModalTitle = '保存查询';

const [SaveModal, saveModalApi] = useVbenModal({
  class: 'w-5/12',
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      saveModalApi.lock();
      const data = await formApi.getValues() as Record<string, any>;
      try {
        const { createSavedQueryApi } = await import('#/api');
        const params: CreateSavedQueryParams = {
          name: data.name || '未命名查询',
          description: data.description || undefined,
          query_type: data.query_type || undefined,
          query_sql: querySql.value,
          dataset_id: selectedDataset.value,
          tags: data.tags || undefined,
          is_public: data.is_public || false,
        };
        await createSavedQueryApi(params);
        message.success($t('ui.actionMessage.operationSuccess'));
        await saveModalApi.close();
        await formApi.resetForm();
        loadSavedQueries();
      } catch (error) {
        console.error(error);
      } finally {
        saveModalApi.unlock();
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      formApi.resetForm();
    }
  },
});

// Export results
function handleExport() {
  if (!queryResult.value || queryResult.value.rows.length === 0) {
    message.warning('没有可导出的数据');
    return;
  }
  const headers = queryResult.value.columns;
  const csvRows = [
    headers.join(','),
    ...queryResult.value.rows.map((row: Record<string, any>) =>
      headers.map((h) => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(','),
    ),
  ];
  const csv = csvRows.join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `query_result_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  message.success('导出成功');
}

// Build grid columns from query result
const resultColumns = ref<any[]>([]);
const resultData = ref<any[]>([]);

watch(() => queryResult.value, (val) => {
  if (val) {
    resultColumns.value = val.columns.map((col) => ({
      field: col,
      title: col,
      minWidth: 120,
      showOverflow: true,
    }));
    resultData.value = val.rows.map((row: any[], idx: number) => {
      const obj: Record<string, any> = { _row_key: idx };
      val.columns.forEach((col: string, ci: number) => {
        obj[col] = row[ci];
      });
      return obj;
    });
  } else {
    resultColumns.value = [];
    resultData.value = [];
  }
}, { immediate: true });
</script>

<template>
  <Page auto-content-height>
    <div class="query-builder flex h-full gap-3 p-3">
      <!-- Left Sidebar -->
      <div
        class="query-sidebar flex-shrink-0 overflow-hidden rounded-lg border"
        :class="[sideCollapsed ? 'w-12' : 'w-64']"
        style="transition: width 0.3s"
      >
        <div class="flex items-center justify-between border-b px-3 py-2">
          <span v-if="!sideCollapsed" class="text-sm font-medium">数据浏览器</span>
          <button
            class="ml-auto flex h-6 w-6 items-center justify-center rounded text-xs hover:bg-gray-100"
            @click="sideCollapsed = !sideCollapsed"
          >
            <span v-if="sideCollapsed">→</span>
            <span v-else>←</span>
          </button>
        </div>
        <div v-if="!sideCollapsed" class="p-2">
          <div class="mb-3">
            <h4 class="mb-1 text-xs font-semibold text-gray-500">数据集</h4>
            <div
              v-for="ds in datasetList"
              :key="ds.id"
              class="dataset-item cursor-pointer rounded px-2 py-1 text-sm"
              :class="{ 'bg-primary/10 text-primary': selectedDataset === ds.id }"
              @click="handleSelectDataset(ds)"
            >
              <span class="truncate">{{ ds.name }}</span>
            </div>
            <div v-if="datasetList.length === 0" class="px-2 py-1 text-xs text-gray-400">
              暂无数据集
            </div>
          </div>
          <div>
            <h4 class="mb-1 text-xs font-semibold text-gray-500">已保存查询</h4>
            <div
              v-for="sq in savedQueryList"
              :key="sq.id"
              class="saved-query-item cursor-pointer rounded px-2 py-1 text-sm"
              @click="handleSelectSavedQuery(sq)"
            >
              <div class="truncate font-medium">{{ sq.name }}</div>
              <div class="truncate text-xs text-gray-400">{{ sq.query_sql }}</div>
            </div>
            <div v-if="savedQueryList.length === 0" class="px-2 py-1 text-xs text-gray-400">
              暂无已保存查询
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="query-main flex flex-1 flex-col gap-3 overflow-hidden">
        <!-- Toolbar -->
        <div class="toolbar flex items-center gap-2 rounded-lg border px-3 py-2">
          <a-tooltip title="执行查询 (Ctrl+Enter)">
            <VbenButton
              type="primary"
              :loading="queryLoading"
              icon="ant-design:play-circle-outlined"
              @click="handleExecute"
            >
              执行
            </VbenButton>
          </a-tooltip>
          <a-tooltip title="格式化SQL">
            <VbenButton icon="ant-design:format-painter-outlined" @click="handleFormatSql">
              格式化
            </VbenButton>
          </a-tooltip>
          <a-tooltip title="保存查询">
            <VbenButton icon="ant-design:save-outlined" @click="() => saveModalApi.setData(null).open()">
              保存
            </VbenButton>
          </a-tooltip>
          <a-tooltip title="导出CSV">
            <VbenButton icon="ant-design:download-outlined" @click="handleExport">
              导出
            </VbenButton>
          </a-tooltip>
          <div class="ml-auto flex items-center gap-2">
            <span v-if="queryResult" class="text-xs text-gray-400">
              {{ queryResult.total }} 条记录
              <template v-if="queryResult.duration"> | {{ queryResult.duration }}ms</template>
            </span>
            <VbenButton v-if="queryResult" class="!h-7 !px-2 !py-0 text-xs" @click="handleClear">
              清除
            </VbenButton>
          </div>
        </div>

        <!-- SQL Editor -->
        <div class="sql-editor rounded-lg border">
          <div class="flex items-center justify-between border-b px-3 py-1.5">
            <span class="text-xs font-medium text-gray-500">SQL 编辑器</span>
            <span class="text-xs text-gray-400">Ctrl+Enter 执行</span>
          </div>
          <textarea
            v-model="querySql"
            class="sql-textarea w-full resize-none border-0 bg-transparent p-3 font-mono text-sm outline-none"
            :disabled="queryLoading"
            rows="8"
            placeholder="请输入SQL查询语句..."
            spellcheck="false"
            @keydown.ctrl.enter.prevent="handleExecute"
            @keydown.meta.enter.prevent="handleExecute"
          />
        </div>

        <!-- Results Area -->
        <div class="result-area flex-1 rounded-lg border">
          <div class="flex items-center gap-3 border-b px-3 py-1.5">
            <span
              class="tab-item cursor-pointer text-xs font-medium"
              :class="{ 'text-primary': activeTab === 'result' }"
              @click="activeTab = 'result'"
            >
              查询结果
            </span>
            <span
              class="tab-item cursor-pointer text-xs font-medium"
              :class="{ 'text-primary': activeTab === 'history' }"
              @click="activeTab = 'history'"
            >
              查询历史
            </span>
            <div v-if="queryResult?.error_message" class="ml-auto text-xs text-red-500">
              {{ queryResult.error_message }}
            </div>
          </div>
          <div v-if="activeTab === 'result'" class="result-table h-full">
            <div v-if="!queryResult" class="flex h-40 items-center justify-center text-sm text-gray-400">
              执行查询后结果将在此处显示
            </div>
            <div v-else-if="queryResult.rows.length === 0 && queryResult.status === 'success'" class="flex h-40 items-center justify-center text-sm text-gray-400">
              查询执行成功，但未返回任何数据
            </div>
            <div v-else class="overflow-auto" style="max-height: 400px">
              <table class="query-result-table w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th
                      v-for="col in resultColumns"
                      :key="col.field"
                      class="sticky top-0 border-b bg-muted px-3 py-2 text-left font-medium text-muted-foreground"
                    >
                      {{ col.title }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, rowIdx) in resultData"
                    :key="row._row_key"
                    class="border-b transition-colors hover:bg-accent/50"
                    :class="rowIdx % 2 === 0 ? 'bg-background' : 'bg-muted/20'"
                  >
                    <td
                      v-for="col in resultColumns"
                      :key="col.field"
                      class="px-3 py-2 text-foreground/80"
                    >
                      {{ row[col.field] != null ? row[col.field] : '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="p-3">
            <div class="text-sm text-gray-400 text-center py-8">
              查询历史功能 - 待实现
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Query Modal -->
    <SaveModal :title="saveModalTitle">
      <Form />
    </SaveModal>
  </Page>
</template>

<style scoped>
.query-builder {
  min-height: 100%;
}

.query-sidebar {
  background-color: var(--vben-card-bg);
  border-color: var(--vben-border-color);
}

.query-sidebar .dataset-item:hover,
.query-sidebar .saved-query-item:hover {
  background-color: var(--vben-hover-bg);
}

.toolbar {
  background-color: var(--vben-card-bg);
  border-color: var(--vben-border-color);
}

.sql-editor {
  background-color: var(--vben-card-bg);
  border-color: var(--vben-border-color);
}

.sql-textarea {
  color: var(--vben-text-color);
  min-height: 140px;
}

.sql-textarea:focus {
  outline: none;
  box-shadow: none;
}

.result-area {
  background-color: var(--vben-card-bg);
  border-color: var(--vben-border-color);
}

.tab-item {
  color: var(--vben-text-color);
  opacity: 0.6;
  transition: opacity 0.2s;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
}

.tab-item:hover {
  opacity: 0.9;
}

.tab-item.text-primary {
  opacity: 1;
  border-bottom-color: var(--vben-primary-color);
}

.query-result-table {
  border-color: var(--vben-border-color);
}

.query-result-table thead th {
  background-color: var(--vben-card-bg);
  z-index: 1;
}

.query-result-table tbody tr:last-child {
  border-bottom: none;
}
</style>
