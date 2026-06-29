<script setup lang="ts">
import type { OnActionClickParams, VxeTableGridOptions } from '#/adapter/vxe-table';

import { computed, ref } from 'vue';

import { confirm, Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { MaterialSymbolsAdd } from '@vben/icons';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createDynamicScheduleApi,
  deleteDynamicScheduleApi,
  getAllDynamicScheduleApi,
  toggleDynamicScheduleApi,
  updateDynamicScheduleApi,
} from '#/api/dynamic-schedule';

import { useColumns } from './data';

const columns = useColumns(onActionClick);

const gridOptions: VxeTableGridOptions = {
  rowConfig: {
    keyField: 'name',
  },
  height: 'auto',
  exportConfig: {},
  printConfig: {},
  toolbarConfig: {
    export: true,
    print: true,
    refresh: true,
    custom: true,
    zoom: true,
  },
  columns,
  // 无分页，getAll 返回扁平数组
  proxyConfig: {
    ajax: {
      query: async () => {
        const res = await getAllDynamicScheduleApi();
        const items = Array.isArray(res) ? res : [];
        return { items, total: items.length };
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

function onRefresh() {
  gridApi.query();
}

const toggleLoadingMap = ref<Record<string, boolean>>({});

/** 启用/禁用切换 */
async function onToggleEnabled(row: any) {
  const name = row.name;
  toggleLoadingMap.value[name] = true;
  try {
    await toggleDynamicScheduleApi(name, !row.enabled);
    message.success(`任务「${name}」已${row.enabled ? '禁用' : '启用'}`);
    onRefresh();
  } catch (error) {
    console.error(error);
    message.error('操作失败');
  } finally {
    toggleLoadingMap.value[name] = false;
  }
}

function onActionClick({ code, row }: OnActionClickParams<any>) {
  switch (code) {
    case 'delete': {
      confirm({
        icon: 'warning',
        content: `确认删除动态定时器「${row.name}」吗？`,
      }).then(async () => {
        try {
          await deleteDynamicScheduleApi(row.name);
          message.success($t('ui.actionMessage.deleteSuccess'));
          onRefresh();
        } catch (error) {
          console.error(error);
        }
      });
      break;
    }
    case 'edit': {
      editFormData.value = row;
      editModalApi.setData(row).open();
      break;
    }
  }
}

/** 创建/编辑 Modal */
const [EditForm, editFormApi] = useVbenForm({
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  showDefaultActions: false,
  schema: createSchema(false),
});

const editFormData = ref<any>();
const isEdit = computed(() => !!editFormData.value?.name);

const modalTitle = computed(() => {
  return isEdit.value
    ? $t('ui.actionTitle.edit', ['动态调度'])
    : $t('ui.actionTitle.create', ['动态调度']);
});

const [EditModal, editModalApi] = useVbenModal({
  class: 'w-5/12',
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await editFormApi.validate();
    if (valid) {
      editModalApi.lock();
      const raw = await editFormApi.getValues<any>();
      try {
        // 构建 options 对象（queue / exchange / routing_key）
        const options: Record<string, any> = {};
        if (raw.queue) options.queue = raw.queue;
        if (raw.exchange) options.exchange = raw.exchange;
        if (raw.routing_key) options.routing_key = raw.routing_key;

        if (isEdit.value) {
          const name = editFormData.value.name;
          const data: any = {};
          if (raw.type !== undefined) data.type = raw.type;
          if (raw.task) data.task = raw.task;
          if (raw.args !== undefined) data.args = raw.args;
          if (raw.kwargs !== undefined) data.kwargs = raw.kwargs;
          if (Object.keys(options).length > 0) data.options = options;
          if (raw.enabled !== undefined) data.enabled = raw.enabled;
          if (raw.type === 0) {
            data.interval_every = raw.interval_every;
            data.interval_period = raw.interval_period;
          } else {
            data.crontab = raw.crontab;
          }
          await updateDynamicScheduleApi(name, data);
        } else {
          const data: any = {
            name: raw.name,
            task: raw.task,
            type: raw.type,
            enabled: raw.enabled ?? true,
          };
          if (raw.args) data.args = raw.args;
          if (raw.kwargs) data.kwargs = raw.kwargs;
          if (Object.keys(options).length > 0) data.options = options;
          if (raw.type === 0) {
            data.interval_every = raw.interval_every;
            data.interval_period = raw.interval_period;
          } else {
            data.crontab = raw.crontab;
          }
          await createDynamicScheduleApi(data);
        }
        message.success($t('ui.actionMessage.operationSuccess'));
        await editModalApi.close();
        onRefresh();
      } catch (error) {
        console.error(error);
      } finally {
        editModalApi.unlock();
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = editModalApi.getData<any>();
      editFormApi.resetForm();
      if (data) {
        editFormData.value = data;
        // 编辑模式：name 不可编辑
        editFormApi.updateSchema([
          { fieldName: 'name', componentProps: { disabled: true }, rules: '' },
        ]);
        // 从 backend 响应中提取扁平字段
        editFormApi.setValues({
          ...data,
          // args / kwargs 可能以 JSON array/object 形式返回，转为字符串
          args:
            Array.isArray(data.args) || typeof data.args === 'object'
              ? JSON.stringify(data.args)
              : data.args || undefined,
          kwargs:
            data.kwargs && typeof data.kwargs === 'object' && !Array.isArray(data.kwargs)
              ? JSON.stringify(data.kwargs)
              : data.kwargs || undefined,
          // 从 options 中提取 flat 字段
          queue: data.options?.queue || undefined,
          exchange: data.options?.exchange || undefined,
          routing_key: data.options?.routing_key || undefined,
        });
      } else {
        editFormData.value = null;
        // 新建模式：name 可编辑
        editFormApi.updateSchema([
          { fieldName: 'name', componentProps: { disabled: false }, rules: 'required' },
        ]);
      }
    }
  },
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <VbenButton @click="() => editModalApi.setData(null).open()">
          <MaterialSymbolsAdd class="size-5" />
          新增动态调度
        </VbenButton>
      </template>

      <!-- 调度信息自定义插槽 -->
      <template #schedule="{ row }">
        <template v-if="row.type === 0">
          <span>每 {{ row.interval_every || '-' }} {{ row.interval_period || '' }}</span>
        </template>
        <template v-else>
          <code class="text-cyan text-xs">{{ row.crontab || '-' }}</code>
        </template>
      </template>

      <!-- 状态切换 -->
      <template #enabled="{ row }">
        <a-switch
          :checked="row.enabled"
          size="small"
          :loading="!!toggleLoadingMap[row.name]"
          @change="onToggleEnabled(row)"
        />
      </template>
    </Grid>

    <EditModal :title="modalTitle">
      <EditForm />
    </EditModal>
  </Page>
</template>
