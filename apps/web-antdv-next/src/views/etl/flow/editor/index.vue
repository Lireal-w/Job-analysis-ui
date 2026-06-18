<script setup lang="ts">
import type { DataFlowResult } from '#/api';

import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page, VbenButton, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Graph } from '@antv/x6';
import { useVbenForm } from '#/adapter/form';
import {
  getDataFlowApi,
  runDataFlowApi,
  updateDataFlowApi,
} from '#/api';

import { message } from 'antdv-next';

import { ETL_NODE_TYPES, registerEtlNode, serializeGraph } from './node-defs';

registerEtlNode();

const route = useRoute();
const router = useRouter();
const flowId = computed(() => Number(route.params.id));
const loading = ref(false);
const saving = ref(false);
const flowInfo = ref<DataFlowResult | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const graphRef = shallowRef<Graph | null>(null);
const selectedNode = ref<any>(null);
const previousPosition = ref<{ x: number; y: number } | null>(null);

// 属性编辑表单
const [ConfigForm, configFormApi] = useVbenForm({
  wrapperClass: 'grid-cols-1',
  showDefaultActions: false,
  schema: [],
});

// 属性编辑弹窗
const nodeTypesMap = new Map(
  ETL_NODE_TYPES.map((t) => [`${t.type}-${t.label}`, t]),
);

function getEtlTypeKey(node: any): string {
  const data = node.getData() || {};
  return `${data.etlType || 'transform'}-${node.attr('label/text') || ''}`;
}

const [ConfigModal, configModalApi] = useVbenModal({
  class: 'w-[480px]',
  title: '节点配置',
  destroyOnClose: true,
  onOpenChange(open) {
    if (!open) {
      selectedNode.value = null;
    }
  },
  async onConfirm() {
    const { valid } = await configFormApi.validate();
    if (valid) {
      const values = await configFormApi.getValues();
      const node = selectedNode.value;
      if (node) {
        const data = node.getData() || {};
        node.setData({ ...data, config: { ...(data.config || {}), ...values } });
        message.success('节点配置已更新');
      }
      await configModalApi.close();
    }
  },
});

function openNodeConfig(node: any) {
  selectedNode.value = node;
  const data = node.getData() || {};
  const def = nodeTypesMap.get(getEtlTypeKey(node));
  const fields = def?.configFields || [];

  configFormApi.setSchema(
    fields.map((f) => ({
      component: f.type === 'textarea' ? 'Textarea' : f.type === 'switch' ? 'Switch' : f.type === 'select' ? 'Select' : 'Input',
      fieldName: f.key,
      label: f.label,
      rules: f.required ? 'required' : undefined,
      componentProps: f.options
        ? {
            options: f.options.map((o) => ({ label: o.label, value: o.value })),
          }
        : undefined,
    })),
  );

  const currentConfig = data.config || {};
  configFormApi.setValues(currentConfig);
  configModalApi.open();
}

// 初始化 X6 画布
function initGraph() {
  if (!containerRef.value) return;

  const graph = new Graph({
    container: containerRef.value,
    width: containerRef.value.clientWidth,
    height: containerRef.value.clientHeight,
    grid: {
      size: 10,
      visible: true,
      type: 'doubleMesh',
      args: [
        { color: '#e8e8e8', thickness: 1 },
        { color: '#d9d9d9', thickness: 1, factor: 5 },
      ],
    },
    panning: {
      enabled: true,
      eventTypes: ['rightMouseDown'],
    },
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      maxScale: 3,
      minScale: 0.3,
    },
    connecting: {
      router: 'manhattan',
      connector: { name: 'rounded' },
      anchor: 'center',
      sourceAnchor: 'bottom',
      targetAnchor: 'top',
      allowBlank: false,
      allowMulti: false,
      snap: true,
      createEdge() {
        return graph.createEdge({
          attrs: {
            line: {
              stroke: '#1677ff',
              strokeWidth: 2,
              targetMarker: { name: 'classic', size: 8 },
              strokeDasharray: '',
            },
          },
        });
      },
    },
    highlighting: {
      magnetAvailable: {
        name: 'stroke',
        args: { padding: 4, attrs: { strokeWidth: 3, stroke: '#1677ff' } },
      },
    },
  });

  // 双击节点打开配置
  graph.on('node:dblclick', ({ node }) => {
    openNodeConfig(node);
  });

  // 点击空白取消选中
  graph.on('blank:click', () => {
    selectedNode.value = null;
  });

  // 自动 resize
  const resizeObserver = new ResizeObserver(() => {
    if (containerRef.value) {
      graph.resize(containerRef.value.clientWidth, containerRef.value.clientHeight);
    }
  });
  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }

  graphRef.value = graph;

  // 加载流程数据
  loadFlow(graph);
}

// 加载流程
async function loadFlow(graph: Graph) {
  if (!flowId.value) return;

  loading.value = true;
  try {
    const data = await getDataFlowApi(flowId.value);
    flowInfo.value = data;

    if (data.nodes?.length || data.edges?.length) {
      deserializeToGraph(graph, data);
    } else {
      graph.addNode({
        shape: 'etl-node',
        x: 260,
        y: 200,
        data: { etlType: 'source', icon: '🗄️', config: {} },
        attrs: {
          label: { text: '数据源' },
          typeLabel: { text: '数据源' },
        },
      });
      graph.addNode({
        shape: 'etl-node',
        x: 260,
        y: 380,
        data: { etlType: 'target', icon: '💾', config: {} },
        attrs: {
          label: { text: '数据库输出' },
          typeLabel: { text: '数据目标' },
        },
      });
    }
  } catch (error) {
    console.error('Failed to load flow:', error);
    message.error('加载流程数据失败');
  } finally {
    loading.value = false;
  }
}

function deserializeToGraph(
  graph: Graph,
  data: { nodes?: Record<string, any>[]; edges?: Record<string, any>[] },
) {
  (data.nodes || []).forEach((nodeData: Record<string, any>) => {
    const def = ETL_NODE_TYPES.find(
      (t) => t.type === nodeData.type && t.label === nodeData.label,
    );
    graph.addNode({
      shape: 'etl-node',
      id: nodeData.id,
      x: nodeData.x || 120,
      y: nodeData.y || 120,
      data: { etlType: nodeData.type, icon: nodeData.icon, config: nodeData.config || {} },
      attrs: {
        label: { text: nodeData.label },
        typeLabel: { text: def?.description || '' },
        headerBg: { fill: def?.color || '#1677ff' },
      },
    });
  });

  (data.edges || []).forEach((edgeData: Record<string, any>) => {
    graph.addEdge({
      id: edgeData.id,
      source: edgeData.source,
      target: edgeData.target,
      attrs: {
        line: {
          stroke: '#1677ff',
          strokeWidth: 2,
          targetMarker: { name: 'classic', size: 8 },
        },
      },
    });
  });
}

// 从侧栏拖拽到画布
function onDragStart(event: DragEvent, nodeType: (typeof ETL_NODE_TYPES)[0]) {
  if (!event.dataTransfer) return;

  const data = JSON.stringify({
    shape: 'etl-node',
    etlType: nodeType.type,
    label: nodeType.label,
    icon: nodeType.icon,
    color: nodeType.color,
    description: nodeType.description,
  });
  event.dataTransfer.setData('application/x6-node', data);
  event.dataTransfer.effectAllowed = 'copy';
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  if (!graphRef.value || !event.dataTransfer || !containerRef.value) return;

  const raw = event.dataTransfer.getData('application/x6-node');
  if (!raw) return;

  const nodeData = JSON.parse(raw);
  const rect = containerRef.value.getBoundingClientRect();
  const x = event.clientX - rect.left - 100;
  const y = event.clientY - rect.top - 40;

  graphRef.value.addNode({
    shape: nodeData.shape,
    x: Math.max(0, x),
    y: Math.max(0, y),
    data: { etlType: nodeData.etlType, icon: nodeData.icon, config: {} },
    attrs: {
      label: { text: nodeData.label },
      typeLabel: { text: nodeData.description },
      headerBg: { fill: nodeData.color },
    },
  });
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy';
  }
}

// 保存流程
async function saveFlow() {
  if (!graphRef.value || !flowId.value) return;

  saving.value = true;
  try {
    const { nodes, edges } = serializeGraph(graphRef.value);
    await updateDataFlowApi(flowId.value, { nodes, edges } as any);
    message.success('流程保存成功');
  } catch (error) {
    console.error('Failed to save flow:', error);
    message.error('保存失败');
  } finally {
    saving.value = false;
  }
}

// 自动布局
function autoLayout() {
  if (!graphRef.value) return;
  const graph = graphRef.value;
  const nodes = graph.getNodes();
  if (nodes.length === 0) return;

  // 分层布局：source 在上，transform 中间，target 在下
  const layers: Record<string, any[]> = { source: [], transform: [], target: [] };
  nodes.forEach((node) => {
    const data = node.getData() || {};
    const type: string = data.etlType || 'transform';
    if (!layers[type]) layers[type] = [];
    layers[type].push(node);
  });

  const startX = 120;
  const startY = 60;
  const spacingX = 260;
  const spacingY = 160;
  let layerIndex = 0;

  ['source', 'transform', 'target'].forEach((type) => {
    const layerNodes = layers[type];
    if (layerNodes.length === 0) return;

    const totalWidth = (layerNodes.length - 1) * spacingX;
    const offsetX = Math.max(0, (800 - totalWidth) / 2);

    layerNodes.forEach((node, i) => {
      node.position(offsetX + i * spacingX, startY + layerIndex * spacingY);
    });
    layerIndex++;
  });
}

// 运行流程
async function runFlow() {
  if (!flowId.value) return;
  try {
    await runDataFlowApi(flowId.value);
    message.success(`流程「${flowInfo.value?.name}」已启动运行`);
  } catch (error) {
    console.error('Failed to run flow:', error);
    message.error('启动运行失败');
  }
}

// 返回列表
function goBack() {
  router.push('/etl/flow');
}

onMounted(() => {
  setTimeout(initGraph, 100);
});

onBeforeUnmount(() => {
  graphRef.value?.dispose();
});
</script>

<template>
  <Page>
    <div class="flex h-full flex-col">
      <!-- 顶部工具栏 -->
      <div class="flex items-center justify-between border-b border-border px-4 py-2">
        <div class="flex items-center gap-3">
          <VbenButton variant="ghost" size="small" @click="goBack">
            ← 返回
          </VbenButton>
          <span class="text-sm font-medium text-foreground">
            {{ flowInfo?.name || '加载中...' }}
          </span>
          <span
            v-if="flowInfo?.status"
            class="rounded bg-warning/10 px-2 py-0.5 text-xs text-warning"
          >
            {{ flowInfo.status === 'draft' ? '草稿' : flowInfo.status === 'published' ? '已发布' : '已归档' }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <VbenButton size="small" variant="outline" @click="autoLayout">
            自动布局
          </VbenButton>
          <VbenButton size="small" variant="outline" @click="runFlow">
            运行
          </VbenButton>
          <VbenButton size="small" :loading="saving" @click="saveFlow">
            保存
          </VbenButton>
        </div>
      </div>

      <!-- 编辑器主体 -->
      <div class="flex flex-1 overflow-hidden">
        <!-- 左侧节点面板 -->
        <div class="w-56 shrink-0 overflow-y-auto border-r border-border bg-card p-3">
          <h3 class="mb-1 text-xs font-semibold uppercase text-muted-foreground">
            数据源
          </h3>
          <div
            v-for="node in ETL_NODE_TYPES.filter((n) => n.type === 'source')"
            :key="node.label"
            class="mb-2 cursor-grab rounded-lg border border-border bg-background p-3 text-center text-xs transition-colors hover:border-primary active:cursor-grabbing"
            draggable="true"
            @dragstart="onDragStart($event, node)"
          >
            <span class="text-lg">{{ node.icon }}</span>
            <div class="mt-1 font-medium text-foreground">{{ node.label }}</div>
            <div class="text-[10px] text-muted-foreground">{{ node.description }}</div>
          </div>

          <h3 class="mb-1 mt-4 text-xs font-semibold uppercase text-muted-foreground">
            转换
          </h3>
          <div
            v-for="node in ETL_NODE_TYPES.filter((n) => n.type === 'transform')"
            :key="node.label"
            class="mb-2 cursor-grab rounded-lg border border-border bg-background p-3 text-center text-xs transition-colors hover:border-primary active:cursor-grabbing"
            draggable="true"
            @dragstart="onDragStart($event, node)"
          >
            <span class="text-lg">{{ node.icon }}</span>
            <div class="mt-1 font-medium text-foreground">{{ node.label }}</div>
            <div class="text-[10px] text-muted-foreground">{{ node.description }}</div>
          </div>

          <h3 class="mb-1 mt-4 text-xs font-semibold uppercase text-muted-foreground">
            数据目标
          </h3>
          <div
            v-for="node in ETL_NODE_TYPES.filter((n) => n.type === 'target')"
            :key="node.label"
            class="mb-2 cursor-grab rounded-lg border border-border bg-background p-3 text-center text-xs transition-colors hover:border-primary active:cursor-grabbing"
            draggable="true"
            @dragstart="onDragStart($event, node)"
          >
            <span class="text-lg">{{ node.icon }}</span>
            <div class="mt-1 font-medium text-foreground">{{ node.label }}</div>
            <div class="text-[10px] text-muted-foreground">{{ node.description }}</div>
          </div>
        </div>

        <!-- 画布区域 -->
        <div
          ref="containerRef"
          class="flex-1 bg-background"
          @drop="onDrop"
          @dragover="onDragOver"
        >
          <div v-if="loading" class="flex size-full items-center justify-center text-muted-foreground">
            加载中...
          </div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="border-t border-border px-4 py-1.5 text-xs text-muted-foreground">
        拖拽左侧节点到画布 — 双击节点编辑配置 — 右键拖拽平移画布 — 滚轮缩放
      </div>
    </div>

    <!-- 节点配置弹窗 -->
    <ConfigModal>
      <ConfigForm />
    </ConfigModal>
  </Page>
</template>

<style lang="scss">
.x6-widget-transform {
  border: 2px solid #1677ff;
  border-radius: 4px;
}
.x6-widget-selection-box {
  border: 1px dashed #1677ff;
}
</style>
