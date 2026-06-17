<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type {
  AlertHistoryResult,
  AlertRuleResult,
  CreateAlertRuleParams,
  UpdateAlertRuleParams,
} from '#/api';

import { computed, ref } from 'vue';

import {
  confirm,
  Page,
  useVbenDrawer,
  useVbenModal,
  VbenButton,
} from '@vben/common-ui';
import { MaterialSymbolsAdd } from '@vben/icons';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createAlertRuleApi,
  deleteAlertRuleApi,
  getAlertHistoryApi,
  getAlertRuleListApi,
  updateAlertRuleApi,
} from '#/api';

import {
  historyQuerySchema,
  ruleQuerySchema,
  useHistoryColumns,
  useRuleColumns,
  useRuleCreateSchema,
} from './data';

const activeTab = ref<string>('rules');

// ==================== Alert Rules Grid ====================
const ruleFormOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: ruleQuerySchema,
};

function onRuleActionClick({ code, row }: OnActionClickParams<AlertRuleResult>) {
  switch (code) {
    case 'delete': {
      confirm({
        icon: 'warning',
        content: `确认删除告警规则「${row.name}」吗？`,
      }).then(async () => {
        ruleGridApi.setLoading(true);
        try {
          await deleteAlertRuleApi([row.id]);
          message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
          onRuleRefresh();
        } catch (error) {
          console.error(error);
        } finally {
          ruleGridApi.setLoading(false);
        }
      });
      break;
    }
    case 'edit': {
      ruleFormData.value = row;
      ruleModalApi.setData(row).open();
      break;
    }
  }
}

const ruleGridOptions: VxeTableGridOptions<AlertRuleResult> = {
  rowConfig: {
    keyField: 'id',
  },
  checkboxConfig: {
    highlight: true,
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
  columns: useRuleColumns(onRuleActionClick),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getAlertRuleListApi({
          page: page.currentPage,
          size: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const [RuleGrid, ruleGridApi] = useVbenVxeGrid({
  formOptions: ruleFormOptions,
  gridOptions: ruleGridOptions,
});

function onRuleRefresh() {
  ruleGridApi.query();
}

// ==================== Alert History Grid ====================
const historyFormOptions: VbenFormProps = {
  collapsed: true,
  showCollapseButton: true,
  submitButtonOptions: {
    content: $t('common.form.query'),
  },
  schema: historyQuerySchema,
};

function onHistoryActionClick({ code, row }: OnActionClickParams<AlertHistoryResult>) {
  switch (code) {
    case 'details': {
      historyDetails.value = row;
      historyDrawerApi.open();
    }
  }
}

const historyGridOptions: VxeTableGridOptions<AlertHistoryResult> = {
  rowConfig: {
    keyField: 'id',
  },
  checkboxConfig: {
    highlight: true,
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
  columns: useHistoryColumns(onHistoryActionClick),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getAlertHistoryApi({
          page: page.currentPage,
          size: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const [HistoryGrid] = useVbenVxeGrid({
  formOptions: historyFormOptions,
  gridOptions: historyGridOptions,
});

// ==================== Rule Create/Edit Modal ====================
const ruleFormData = ref<AlertRuleResult | null>(null);

const [RuleForm, ruleFormApi] = useVbenForm({
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  showDefaultActions: false,
  schema: useRuleCreateSchema(),
});

const ruleModalTitle = computed(() => {
  return ruleFormData.value?.id ? '编辑告警规则' : '创建告警规则';
});

const [RuleModal, ruleModalApi] = useVbenModal({
  class: 'w-5/12',
  destroyOnClose: true,
  async onConfirm() {
    const { valid } = await ruleFormApi.validate();
    if (valid) {
      ruleModalApi.lock();
      const data = await ruleFormApi.getValues<
        CreateAlertRuleParams | UpdateAlertRuleParams
      >();
      try {
        await (ruleFormData.value?.id
          ? updateAlertRuleApi(
              ruleFormData.value.id,
              data as UpdateAlertRuleParams,
            )
          : createAlertRuleApi(data as CreateAlertRuleParams));
        message.success($t('ui.actionMessage.operationSuccess'));
        await ruleModalApi.close();
        await ruleFormApi.resetForm();
        onRuleRefresh();
      } catch (error) {
        console.error(error);
      } finally {
        ruleModalApi.unlock();
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = ruleModalApi.getData<AlertRuleResult>();
      ruleFormApi.resetForm();
      if (data) {
        ruleFormData.value = data;
        ruleFormApi.setValues(data);
      } else {
        ruleFormData.value = null;
      }
    }
  },
});

// ==================== History Details Drawer ====================
const [HistoryDrawer, historyDrawerApi] = useVbenDrawer({
  destroyOnClose: true,
  footer: false,
  class: 'w-2/5',
});

const historyDetails = ref<AlertHistoryResult>();

const alertHistoryDescItems = computed(() => {
  const d = historyDetails.value;
  return [
    { key: 'rule_name', label: '规则名称', content: d?.rule_name },
    { key: 'metric_value', label: '指标值', content: d?.metric_value != null ? String(d.metric_value) : '-' },
    { key: 'threshold', label: '阈值', content: d?.threshold != null ? String(d.threshold) : '-' },
    { key: 'severity', label: '严重级别', content: d?.severity },
    { key: 'status', label: '状态', content: d?.status === 'fired' ? '已触发' : '已恢复' },
    { key: 'message', label: '消息', content: d?.message, span: 2 },
    { key: 'fired_time', label: '触发时间', content: d?.fired_time },
    { key: 'resolved_time', label: '恢复时间', content: d?.resolved_time || '-' },
    { key: 'created_time', label: '创建时间', content: d?.created_time },
  ];
});
</script>

<template>
  <Page auto-content-height>
    <a-tabs v-model:activeKey="activeTab" type="card" class="alert-tabs">
      <a-tab-pane key="rules" tab="告警规则">
        <RuleGrid>
          <template #toolbar-actions>
            <VbenButton @click="() => ruleModalApi.setData(null).open()">
              <MaterialSymbolsAdd class="size-5" />
              创建规则
            </VbenButton>
          </template>
        </RuleGrid>
      </a-tab-pane>
      <a-tab-pane key="history" tab="告警历史">
        <HistoryGrid />
      </a-tab-pane>
    </a-tabs>

    <RuleModal :title="ruleModalTitle">
      <RuleForm />
    </RuleModal>

    <HistoryDrawer>
      <a-descriptions
        :styles="{ label: { color: '#6b7280' } }"
        class="ml-1"
        :column="2"
        :items="alertHistoryDescItems"
      >
        <template #contentRender="{ item }">
          <span>{{ item.content || '-' }}</span>
        </template>
      </a-descriptions>
    </HistoryDrawer>
  </Page>
</template>

<style scoped>
.alert-tabs :deep(.vben-grid) {
  padding-top: 0;
}
</style>
