<script setup lang="ts">
import type { ChatConversation, ChatMessage } from '#/api/chat';

import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';

import { Page, VbenButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'antdv-next';
import { io, Socket } from 'socket.io-client';
import { useAccessStore } from '@vben/stores';

import {
  createConversationApi,
  getConversationsApi,
  getMessagesApi,
} from '#/api/chat';
import {
  activateAiConfigApi,
  AiAssistantClient,
  createAiConfigApi,
  getActiveAiConfigApi,
  getAiConfigListApi,
} from '#/api/ai';

// ══════════════════════════════════════════
//  AI 助手专用
// ══════════════════════════════════════════

interface ChatEntry {
  role: 'user' | 'assistant';
  content: string;
  toolName?: string;
  isTool?: boolean;
  isError?: boolean;
  timestamp: number;
}

// ══════════════════════════════════════════
//  状态
// ══════════════════════════════════════════

const wsUrl = import.meta.env.VITE_GLOB_API_URL || 'http://localhost:8000';
const accessStore = useAccessStore();

const conversations = ref<ChatConversation[]>([]);
const currentConv = ref<ChatConversation | null>(null);
const messages = ref<ChatMessage[]>([]);
const inputText = ref('');
const loading = ref(false);
const messageEndRef = ref<HTMLDivElement | null>(null);

const showCreateModal = ref(false);
const createConvType = ref<'private' | 'group'>('group');
const createName = ref('');
const createMembers = ref('');

// ══════════════════════════════════════════
//  AI 助手状态
// ══════════════════════════════════════════

const aiMode = ref(false);
const aiMessages = ref<ChatEntry[]>([]);
const aiLoading = ref(false);
const aiClient = ref<AiAssistantClient | null>(null);
const aiConnected = ref(false);

// ══════════════════════════════════════════
//  WebSocket (聊天)
// ══════════════════════════════════════════

const chatSocket = ref<Socket | null>(null);

function connectChatSocket() {
  if (chatSocket.value?.connected) return;

  const mainSocket = io(wsUrl, {
    path: '/ws/socket.io',
    transports: ['websocket'],
    forceNew: true,
    autoConnect: true,
    auth: {
      session_uuid: accessStore.accessSessionUuid,
      token: accessStore.accessToken,
    },
  });

  const ws = mainSocket.io.socket('/ws/chat');
  chatSocket.value = ws;

  ws.on('connect', () => {
    if (currentConv.value) {
      ws.emit('chat:join', { conv_id: currentConv.value.conv_id });
    }
  });

  ws.on('chat:message', (data: ChatMessage) => {
    if (data.conv_id === currentConv.value?.conv_id) {
      messages.value.push(data);
      scrollToBottom();
    }
    const conv = conversations.value.find((c) => c.conv_id === data.conv_id);
    if (conv) {
      conv.last_message = data.content;
      conv.last_activity = data.created_at;
    }
  });
}

// ══════════════════════════════════════════
//  AI 助手 WebSocket
// ══════════════════════════════════════════

function initAiClient() {
  if (aiClient.value) return;

  const client = new AiAssistantClient();
  client.connect();
  client.onMessage((data) => {
    switch (data.type) {
      case 'message': {
        const last = aiMessages.value[aiMessages.value.length - 1];
        if (last?.role === 'assistant' && !last.isTool && !last.isError) {
          last.content += data.content || '';
        } else {
          aiMessages.value.push({
            role: 'assistant',
            content: data.content || '',
            timestamp: Date.now(),
          });
        }
        scrollToBottom();
        break;
      }
      case 'done': {
        aiLoading.value = false;
        scrollToBottom();
        break;
      }
      case 'error': {
        aiMessages.value.push({
          role: 'assistant',
          content: `❌ ${data.content || '请求失败'}`,
          isError: true,
          timestamp: Date.now(),
        });
        aiLoading.value = false;
        scrollToBottom();
        break;
      }
    }
  });

  aiClient.value = client;
  aiConnected.value = true;
}

// ══════════════════════════════════════════
//  数据加载
// ══════════════════════════════════════════

async function loadConversations() {
  try {
    const res = await getConversationsApi();
    conversations.value = res || [];
  } catch (e) {
    console.error('加载会话列表失败:', e);
  }
}

async function loadMessages(convId: string) {
  try {
    const res = await getMessagesApi(convId);
    messages.value = res?.items || [];
    await nextTick();
    scrollToBottom();
  } catch (e) {
    messages.value = [];
  }
}

// ══════════════════════════════════════════
//  会话切换
// ══════════════════════════════════════════

function selectConversation(conv: ChatConversation) {
  if (aiMode.value) {
    aiMode.value = false;
  }
  if (currentConv.value) {
    chatSocket.value?.emit('chat:leave', { conv_id: currentConv.value.conv_id });
  }
  currentConv.value = conv;
  chatSocket.value?.emit('chat:join', { conv_id: conv.conv_id });
  loadMessages(conv.conv_id);
}

function openAiChat() {
  aiMode.value = true;
  currentConv.value = null;
  if (!aiClient.value) {
    initAiClient();
  }
}

function scrollToBottom() {
  nextTick(() => {
    messageEndRef.value?.scrollIntoView({ behavior: 'smooth' });
  });
}

// ══════════════════════════════════════════
//  发送消息（聊天）
// ══════════════════════════════════════════

function sendMessage() {
  const content = inputText.value.trim();
  if (!content || !chatSocket.value?.connected || !currentConv.value) return;

  chatSocket.value.emit('chat:send', {
    conv_id: currentConv.value.conv_id,
    content,
  });
  inputText.value = '';
}

// ══════════════════════════════════════════
//  发送消息（AI）
// ══════════════════════════════════════════

function sendAiMessage() {
  const text = inputText.value.trim();
  if (!text || aiLoading.value) return;

  inputText.value = '';
  aiMessages.value.push({ role: 'user', content: text, timestamp: Date.now() });
  scrollToBottom();
  aiLoading.value = true;
  aiClient.value?.sendMessage(text);
}

function clearAiSession() {
  aiClient.value?.clearSession();
  aiMessages.value = [];
}

// ══════════════════════════════════════════
//  创建会话
// ══════════════════════════════════════════

async function handleCreateConversation() {
  if (!createName.value && createConvType.value === 'group') {
    message.warning('请输入群聊名称');
    return;
  }
  if (!createMembers.value.trim()) {
    message.warning('请输入成员用户 ID');
    return;
  }

  try {
    const memberIds = createMembers.value
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    const conv = await createConversationApi({
      conv_type: createConvType.value,
      name: createName.value || undefined,
      member_ids: memberIds,
    });
    if (conv) {
      conversations.value.unshift(conv);
      showCreateModal.value = false;
      createName.value = '';
      createMembers.value = '';
      selectConversation(conv);
      message.success('会话已创建');
    }
  } catch (e: any) {
    message.error(e?.message || '创建失败');
  }
}

// ══════════════════════════════════════════
//  AI 配置管理
// ══════════════════════════════════════════

const showConfigModal = ref(false);
const configList = ref<Array<{ id: number; name: string; is_active: boolean }>>([]);
const configName = ref('');
const configProvider = ref('deepseek');
const configApiBase = ref('https://api.deepseek.com');
const configApiKey = ref('');
const configModel = ref('deepseek-chat');

async function loadConfigList() {
  try {
    const list = await getAiConfigListApi();
    configList.value = list.map((c: any) => ({
      id: c.id, name: c.name, is_active: c.is_active,
    }));
  } catch { configList.value = []; }
}

async function saveConfig() {
  if (!configApiKey.value && configList.value.length === 0) {
    message.warning('请输入 API Key');
    return;
  }
  try {
    const created = await createAiConfigApi({
      name: configName.value || configProvider.value,
      provider: configProvider.value,
      api_base: configApiBase.value,
      api_key: configApiKey.value,
      model: configModel.value,
      max_tokens: 8192,
      temperature: 0.7,
    });
    await activateAiConfigApi(created.id);
    message.success('AI 配置已保存并激活');
    showConfigModal.value = false;
    await loadConfigList();
  } catch (e: any) {
    message.error(e?.message || '保存失败');
  }
}

// ══════════════════════════════════════════
//  工具函数
// ══════════════════════════════════════════

function convName(conv: ChatConversation): string {
  if (conv.name) return conv.name;
  return conv.type === 'group' ? '群聊' : `用户 ${conv.member_ids.find((id) => id !== 1) || conv.member_ids[0]}`;
}

function formatTime(ts: string | null): string {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

// ══════════════════════════════════════════
//  快捷键
// ══════════════════════════════════════════

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    aiMode.value ? sendAiMessage() : sendMessage();
  }
}

// ══════════════════════════════════════════
//  生命周期
// ══════════════════════════════════════════

onMounted(async () => {
  connectChatSocket();
  await loadConversations();
});

onUnmounted(() => {
  chatSocket.value?.disconnect();
  aiClient.value?.disconnect();
});
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full overflow-hidden rounded-lg border border-[var(--border)]">
      <!-- ═══ 左栏：会话列表 ═══ -->
      <div class="flex w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-card)]">
        <div class="flex items-center justify-between border-b border-[var(--border)] px-3 py-2.5">
          <span class="text-sm font-semibold">{{ $t('page.menu.chat') }}</span>
          <VbenButton size="small" @click="showCreateModal = true">+</VbenButton>
        </div>
        <div class="flex-1 overflow-y-auto">
          <!-- AI 助手入口 -->
          <div
            class="flex cursor-pointer items-center gap-2.5 border-b border-[var(--border)] px-3 py-2.5 transition-colors hover:bg-[var(--bg-muted)]"
            :class="{ 'bg-[var(--bg-muted)]': aiMode }"
            @click="openAiChat"
          >
            <span class="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-purple-500 text-xs font-bold text-white">AI</span>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-medium">AI 助手</div>
              <div class="truncate text-xs text-[var(--text-tertiary)]">智能对话与任务管理</div>
            </div>
          </div>
          <!-- 其他会话 -->
          <div
            v-for="conv in conversations"
            :key="conv.conv_id"
            class="flex cursor-pointer items-center gap-2.5 px-3 py-2.5 transition-colors hover:bg-[var(--bg-muted)]"
            :class="{ 'bg-[var(--bg-muted)]': !aiMode && currentConv?.conv_id === conv.conv_id }"
            @click="selectConversation(conv)"
          >
            <span class="flex size-9 items-center justify-center rounded-lg bg-[var(--bg-muted)] text-base">
              {{ conv.type === 'group' ? '👥' : '👤' }}
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-1">
                <span class="truncate text-sm font-medium">{{ convName(conv) }}</span>
                <span class="shrink-0 text-[10px] text-[var(--text-tertiary)]">{{ formatTime(conv.last_activity) }}</span>
              </div>
              <div class="truncate text-xs text-[var(--text-tertiary)]">{{ conv.last_message || '暂无消息' }}</div>
            </div>
          </div>
          <div v-if="conversations.length === 0 && !aiMode" class="py-8 text-center text-xs text-[var(--text-tertiary)]">暂无会话</div>
        </div>
      </div>

      <!-- ═══ 右栏：聊天区域 ═══ -->
      <div class="flex flex-1 flex-col">
        <!-- 头部 -->
        <div class="flex items-center border-b border-[var(--border)] px-4 py-2.5">
          <template v-if="aiMode">
            <span class="mr-2 flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-purple-500 text-xs font-bold text-white">AI</span>
            <span class="font-medium">AI 助手</span>
            <button class="ml-auto text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]" @click="showConfigModal = true">配置</button>
          </template>
          <template v-else-if="currentConv">
            <span class="mr-2 text-lg">{{ conv.type === 'group' ? '👥' : '👤' }}</span>
            <span class="font-medium">{{ convName(currentConv) }}</span>
            <span class="ml-2 text-xs text-[var(--text-tertiary)]">
              {{ conv.type === 'group' ? `${conv.member_ids.length} 人` : '私聊' }}
            </span>
          </template>
          <span v-else class="text-[var(--text-tertiary)]">选择一个会话</span>
        </div>

        <!-- 消息列表 -->
        <div ref="messageEndRef" class="flex-1 space-y-3 overflow-y-auto p-4">
          <!-- AI 模式 -->
          <template v-if="aiMode">
            <div v-if="aiMessages.length === 0" class="flex flex-col items-center justify-center py-12 text-[var(--text-tertiary)]">
              <span class="mb-2 flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-purple-500 text-sm font-bold text-white">AI</span>
              <p class="text-sm">你好！我是 AI 助手</p>
              <p class="mt-1 text-xs">可以帮你创建采集任务、查询数据、分析问题</p>
            </div>
            <div v-for="(msg, i) in aiMessages" :key="i" class="flex items-start gap-2.5" :class="msg.role === 'user' ? 'flex-row-reverse' : ''">
              <span class="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                :class="msg.role === 'user' ? 'bg-[hsl(var(--primary))] text-white' : 'bg-purple-500/20 text-purple-500'">
                {{ msg.role === 'user' ? 'U' : 'AI' }}
              </span>
              <div class="max-w-[75%] rounded-lg px-3 py-2 text-sm leading-relaxed"
                :class="msg.role === 'user' ? 'bg-[hsl(var(--primary))/0.12] rounded-tr-sm' : 'bg-[var(--bg-muted)] rounded-tl-sm'">
                {{ msg.content }}
              </div>
            </div>
          </template>
          <!-- 聊天模式 -->
          <template v-else>
            <div v-if="messages.length === 0" class="py-12 text-center text-xs text-[var(--text-tertiary)]">暂无消息</div>
            <div v-for="msg in messages" :key="msg.message_id" class="flex items-start gap-2.5">
              <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--bg-muted)] text-[10px] font-bold">
                {{ msg.sender_name?.charAt(0) || '?' }}
              </span>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ msg.sender_name }}</span>
                  <span class="text-[10px] text-[var(--text-tertiary)]">{{ formatTime(msg.created_at) }}</span>
                </div>
                <div class="mt-0.5 whitespace-pre-wrap break-words text-sm leading-relaxed">{{ msg.content }}</div>
              </div>
            </div>
          </template>
        </div>

        <!-- ═══ 输入框 ═══ -->
        <div class="border-t border-[var(--border)] p-3">
          <div class="flex gap-2">
            <a-textarea
              v-model:value="inputText"
              :rows="2"
              :placeholder="aiMode ? '输入你的问题，Enter 发送' : '输入消息，Enter 发送'"
              class="flex-1"
              @keydown="handleKeydown"
            />
            <VbenButton
              :disabled="!inputText.trim() || (!aiMode && !chatSocket?.connected)"
              @click="aiMode ? sendAiMessage() : sendMessage()"
            >
              发送
            </VbenButton>
          </div>
          <div class="mt-1 text-[10px] text-[var(--text-tertiary)]">
            {{ aiMode ? 'AI 模式' : chatSocket?.connected ? '已连接' : '未连接' }} · Enter 发送 · Shift+Enter 换行
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ 创建会话弹窗 ═══ -->
    <a-modal v-model:open="showCreateModal" title="创建会话" @ok="handleCreateConversation">
      <div class="space-y-3">
        <div>
          <label class="mb-1 block text-xs text-[var(--text-tertiary)]">会话类型</label>
          <a-radio-group v-model:value="createConvType">
            <a-radio value="group">群聊</a-radio>
            <a-radio value="private">私聊</a-radio>
          </a-radio-group>
        </div>
        <div>
          <label class="mb-1 block text-xs text-[var(--text-tertiary)]">名称</label>
          <a-input v-model:value="createName" :placeholder="createConvType === 'group' ? '群聊名称' : '私聊名称(可选)'" />
        </div>
        <div>
          <label class="mb-1 block text-xs text-[var(--text-tertiary)]">成员用户 ID</label>
          <a-input v-model:value="createMembers" placeholder="多个 ID 用逗号分隔，如: 2,3,5" />
        </div>
      </div>
    </a-modal>

    <!-- ═══ AI 配置弹窗 ═══ -->
    <a-modal v-model:open="showConfigModal" title="AI 模型配置" @ok="saveConfig">
      <div class="space-y-3">
        <div v-if="configList.length > 0">
          <div class="mb-1 text-xs text-[var(--text-tertiary)]">已有配置</div>
          <div v-for="cfg in configList" :key="cfg.id" class="flex items-center justify-between rounded bg-[var(--bg-muted)] px-2 py-1 text-sm">
            <span>{{ cfg.name }}</span>
            <a-tag v-if="cfg.is_active" color="green">已激活</a-tag>
          </div>
        </div>
        <a-input v-model:value="configName" placeholder="配置名称" />
        <a-select v-model:value="configProvider" placeholder="选择提供商">
          <a-select-option value="deepseek">DeepSeek</a-select-option>
          <a-select-option value="openai">OpenAI</a-select-option>
          <a-select-option value="custom">自定义</a-select-option>
        </a-select>
        <a-input v-model:value="configApiBase" placeholder="API 地址" />
        <a-input v-model:value="configModel" placeholder="模型名称" />
        <a-input-password v-model:value="configApiKey" placeholder="API Key" />
      </div>
    </a-modal>
  </Page>
</template>
