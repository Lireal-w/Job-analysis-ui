<script setup lang="ts">
import type { GoalResult } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  aiGenerateGoalsApi,
  createGoalApi,
  deleteGoalApi,
  getGoalsByTaskApi,
  updateGoalStatusApi,
} from '#/api';

import {
  goalFormSchema,
  goalColumns,
  renderGoalStatusTag,
} from './goal-data';

const taskId = ref<number>(0);
const taskTitle = ref<string>('');

const goalGridOptions: VxeTableGridOptions<GoalResult> = {
  rowConfig: {
    keyField: 'id',
  },
  height: 'auto',
  virtualYConfig: {
    enabled: true,
    gt: 0,
  },
  pagerConfig: {
    enabled: false,
  },
  columns: goalColumns(onActionClick),
  proxyConfig: {
    ajax: {
      query: async () => {
        return await getGoalsByTaskApi(taskId.value);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: goalGridOptions,
});

function onRefresh() {
  gridApi.query();
}

function onActionClick({ code, row }: any) {
  switch (code) {
    case 'delete': {
      deleteGoalApi(row.id).then(() => {
        message.success('目标已删除');
        onRefresh();
      });
      break;
    }
    case 'status': {
      const newStatus = row.status === 2 ? 0 : row.status + 1;
      updateGoalStatusApi(row.id, { status: newStatus }).then(() => {
        message.success('目标状态已更新');
        onRefresh();
      });
      break;
    }
  }
}

/**
 * 创建目标 Form
 */
const [GoalForm, goalFormApi] = useVbenForm({
  layout: 'vertical',
  showDefaultActions: false,
  schema: goalFormSchema,
});

const [GoalModal, goalModalApi] = useVbenModal({
  destroyOnClose: true,
  title: '创建目标',
  async onConfirm() {
    const { valid } = await goalFormApi.validate();
    if (valid) {
      goalModalApi.lock();
      const data = await goalFormApi.getValues<{
        title: string;
        description?: string;
        stage_order?: number;
      }>();
      try {
        await createGoalApi({
          task_id: taskId.value,
          ...data,
        });
        message.success('目标创建成功');
        await goalModalApi.close();
        onRefresh();
      } finally {
        goalModalApi.unlock();
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      goalFormApi.resetForm();
    }
  },
});

/**
 * AI生成目标
 */
const aiLoading = ref(false);

async function handleAiGenerate() {
  aiLoading.value = true;
  try {
    await aiGenerateGoalsApi(taskId.value);
    message.success('AI目标生成成功');
    onRefresh();
  } catch (error) {
    console.error(error);
  } finally {
    aiLoading.value = false;
  }
}

const [Drawer, drawerApi] = useVbenDrawer({
  destroyOnClose: true,
  header: false,
  footer: false,
  class: 'w-2/5',
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<{
        taskId: number;
        taskTitle: string;
      }>();
      taskId.value = data.taskId;
      taskTitle.value = data.taskTitle;
      gridApi.query();
    }
  },
});
</script>

<template>
  <Drawer :title="`目标管理 - ${taskTitle}`">
    <template #extra>
      <a-button
        :loading="aiLoading"
        type="primary"
        ghost
        @click="handleAiGenerate"
      >
        AI生成目标
      </a-button>
      <a-button type="primary" @click="() => goalModalApi.setData(null).open()">
        新增目标
      </a-button>
    </template>
    <div class="h-full">
      <Grid>
        <template #status="{ row }">
          {{ renderGoalStatusTag(row.status) }}
        </template>
      </Grid>
    </div>
    <GoalModal>
      <GoalForm />
    </GoalModal>
  </Drawer>
</template>
