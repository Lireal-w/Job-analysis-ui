<script setup lang="ts">
import type { AiConfigResult, CreateAiConfigParams } from '#/api/ai';
import type { VbenFormSchema } from '#/adapter/form';

import { ref, onMounted } from 'vue';

import { VbenButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Modal } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  getAiConfigListApi,
  createAiConfigApi,
  updateAiConfigApi,
  deleteAiConfigApi,
  activateAiConfigApi,
} from '#/api/ai';

/** 内置 AI 服务商 */
interface AiProvider {
  provider: string;
  name: string;
  api_base: string;
  models: string[];
  default_model: string;
}

const DEFAULT_PROVIDERS: AiProvider[] = [
  { provider: 'openai', name: 'OpenAI', api_base: 'https://api.openai.com/v1', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'], default_model: 'gpt-4o-mini' },
  { provider: 'deepseek', name: 'DeepSeek', api_base: 'https://api.deepseek.com', models: ['deepseek-chat', 'deepseek-reasoner'], default_model: 'deepseek-chat' },
  { provider: 'anthropic', name: 'Anthropic Claude', api_base: 'https://api.anthropic.com/v1', models: ['claude-sonnet-4-20250514', 'claude-haiku-3-5-sonnet'], default_model: 'claude-sonnet-4-20250514' },
  { provider: 'gemini', name: 'Google Gemini', api_base: 'https://generativelanguage.googleapis.com/v1beta', models: ['gemini-2.0-flash'], default_model: 'gemini-2.0-flash' },
  { provider: 'moonshot', name: 'Moonshot / 月之暗面', api_base: 'https://api.moonshot.cn/v1', models: ['moonshot-v1-8k', 'moonshot-v1-32k'], default_model: 'moonshot-v1-8k' },
  { provider: 'qwen', name: '通义千问 (阿里云)', api_base: 'https://dashscope.aliyuncs.com/compatible-mode/v1', models: ['qwen-plus', 'qwen-turbo', 'qwen-max'], default_model: 'qwen-plus' },
  { provider: 'zhipu', name: '智谱清言', api_base: 'https://open.bigmodel.cn/api/paas/v4', models: ['glm-4-plus', 'glm-4-air', 'glm-4-flash'], default_model: 'glm-4-plus' },
  { provider: 'custom', name: '自定义 (兼容 OpenAI)', api_base: '', models: [], default_model: '' },
];

// 服务商选项
const providerOptions = DEFAULT_PROVIDERS.map((p) => ({
  label: p.name,
  value: p.provider,
}));

const loading = ref(false);
const saving = ref(false);
const configs = ref<AiConfigResult[]>([]);
const editing = ref(false);
const editId = ref<number | null>(null);

function getFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      fieldName: 'provider',
      label: 'AI 服务商',
      rules: 'required',
      componentProps: {
        allowClear: false,
        options: providerOptions,
        placeholder: '选择 AI 服务商',
      },
      onChange: ({ formApi: api, values }: any) => {
        const p = DEFAULT_PROVIDERS.find((pr) => pr.provider === values.provider);
        if (p) {
          api.setValues({ api_base: p.api_base, model: p.default_model });
        }
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '配置名称',
      rules: 'required',
      help: '例如: 我的 OpenAI 配置',
    },
    {
      component: 'InputPassword',
      fieldName: 'api_key',
      label: 'API Key',
      rules: editing.value ? '' : 'required',
      help: editing.value ? '留空则不修改' : 'API 密钥，安全加密存储',
    },
    {
      component: 'Input',
      fieldName: 'api_base',
      label: 'API 地址',
      help: '选择服务商后自动填充，自定义时需手动填写',
    },
    {
      component: 'Input',
      fieldName: 'model',
      label: '模型名称',
      help: '选择服务商后自动填充默认模型',
    },
    {
      component: 'InputNumber',
      fieldName: 'max_tokens',
      label: '最大 Token',
      defaultValue: 4096,
      componentProps: { min: 1, max: 128000, class: 'w-full' },
    },
    {
      component: 'InputNumber',
      fieldName: 'temperature',
      label: '温度 (Temperature)',
      defaultValue: 0.7,
      componentProps: { min: 0, max: 2, step: 0.1, class: 'w-full' },
    },
    {
      component: 'Switch',
      fieldName: 'is_active',
      label: '创建后直接激活',
      defaultValue: false,
    },
    {
      component: 'Textarea',
      fieldName: 'system_prompt',
      label: '系统提示词',
      help: '自定义 AI 助手的角色和行为，留空使用默认提示词',
    },
  ];
}

const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  schema: getFormSchema(),
});

async function loadConfigs() {
  loading.value = true;
  try {
    const res: any = await getAiConfigListApi();
    configs.value = res?.items || [];
  } catch (e) {
    console.error('加载 AI 配置失败:', e);
  } finally {
    loading.value = false;
  }
}

function getProviderLabel(provider: string): string {
  return DEFAULT_PROVIDERS.find((p) => p.provider === provider)?.name || provider;
}

function handleNew() {
  editing.value = true;
  editId.value = null;
  formApi.resetForm();
  formApi.setValues({ max_tokens: 4096, temperature: 0.7 });
}

function handleEdit(config: AiConfigResult) {
  editing.value = true;
  editId.value = config.id;
  formApi.resetForm();
  formApi.setValues({
    provider: config.provider,
    name: config.name,
    api_base: config.api_base,
    model: config.model,
    max_tokens: config.max_tokens,
    temperature: config.temperature,
    system_prompt: config.system_prompt,
    is_active: false,
  });
}

async function handleSave() {
  const { valid } = await formApi.validate();
  if (!valid) return;

  saving.value = true;
  try {
    const values = await formApi.getValues<any>();

    if (editId.value) {
      const data: Record<string, any> = { ...values };
      delete data.is_active;
      if (!data.api_key) delete data.api_key;
      await updateAiConfigApi(editId.value, data as Partial<CreateAiConfigParams>);
      message.success($t('ui.actionMessage.operationSuccess'));
    } else {
      const data = { ...values, enabled: true };
      delete data.is_active;
      const result = await createAiConfigApi(data as CreateAiConfigParams);
      if (values.is_active && result) {
        await activateAiConfigApi((result as any).id);
      }
      message.success('AI 配置创建成功');
    }
    handleCancel();
    await loadConfigs();
  } catch (e: any) {
    message.error(e?.message || '操作失败');
  } finally {
    saving.value = false;
  }
}

function handleCancel() {
  editing.value = false;
  editId.value = null;
}

async function handleDelete(config: AiConfigResult) {
  Modal.confirm({
    title: '确认删除',
    content: `确定删除 AI 配置「${config.name}」吗？`,
    async onOk() {
      try {
        await deleteAiConfigApi([config.id]);
        message.success($t('ui.actionMessage.deleteSuccess'));
        await loadConfigs();
      } catch (e: any) {
        message.error(e?.message || '删除失败');
      }
    },
  });
}

async function handleActivate(config: AiConfigResult) {
  try {
    await activateAiConfigApi(config.id);
    message.success(`已激活「${config.name}」`);
    await loadConfigs();
  } catch (e: any) {
    message.error('激活失败');
  }
}

onMounted(() => {
  loadConfigs();
});
</script>

<template>
  <div class="w-full">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-base font-semibold">AI 模型配置</h3>
      <VbenButton v-if="!editing" @click="handleNew">
        + 新增配置
      </VbenButton>
    </div>

    <!-- 编辑/新建表单 -->
    <div
      v-if="editing"
      class="mb-6 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4"
    >
      <h4 class="mb-4 text-sm font-medium">
        {{ editId ? '编辑 AI 配置' : '新增 AI 配置' }}
      </h4>
      <Form />
      <div class="mt-4 flex gap-2">
        <VbenButton :loading="saving" @click="handleSave">
          {{ editId ? $t('common.save') : '创建' }}
        </VbenButton>
        <VbenButton class="ml-2" @click="handleCancel">
          {{ $t('common.cancel') }}
        </VbenButton>
      </div>
    </div>

    <!-- 配置列表 -->
    <div v-if="!editing">
      <div v-if="loading" class="py-8 text-center text-[var(--text-tertiary)]">
        加载中...
      </div>
      <div
        v-else-if="configs.length === 0"
        class="py-8 text-center text-[var(--text-tertiary)]"
      >
        暂无 AI 配置，点击上方按钮新增
      </div>
      <div v-else class="space-y-2">
        <div
          v-for="config in configs"
          :key="config.id"
          class="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-medium">{{ config.name }}</span>
              <span
                class="rounded bg-[var(--bg-muted)] px-2 py-0.5 text-xs text-[var(--text-tertiary)]"
              >
                {{ getProviderLabel(config.provider) }}
              </span>
              <span v-if="config.is_active" class="text-xs text-green-500">● 激活</span>
            </div>
            <div class="mt-1 text-xs text-[var(--text-tertiary)]">
              模型: {{ config.model }} | {{ config.api_base }}
            </div>
          </div>
          <div class="flex items-center gap-1">
            <a-button
              v-if="!config.is_active"
              size="small"
              type="link"
              @click="handleActivate(config)"
            >
              激活
            </a-button>
            <a-button size="small" type="link" @click="handleEdit(config)">
              编辑
            </a-button>
            <a-button size="small" type="link" danger @click="handleDelete(config)">
              删除
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
