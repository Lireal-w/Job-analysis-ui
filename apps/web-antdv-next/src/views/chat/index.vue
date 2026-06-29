<script setup lang="ts">
import type { ChatConversation, ChatMessage } from '#/api/chat';

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import { Page, VbenButton } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Modal } from 'antdv-next';
import { io, Socket } from 'socket.io-client';
import { useAccessStore } from '@vben/stores';

import {
  createConversationApi,
  getConversationsApi,
  getMessagesApi,
} from '#/api/chat';

// ── 状态 ──

const wsUrl = import.meta.env.VITE_GLOB_API_URL || 'http://localhost:8000';
const accessStore = useAccessStore();

const conversations = ref<ChatConversation[]>([]);
const currentConv = ref<ChatConversation | null>(null);
const messages = ref<ChatMessage[]>([]);
const inputText = ref('');
const loading = ref(false);
const sending = ref(false);
const showCreateModal = ref(false);
const createConvType = ref<'private' | 'group'>('group');
const createName = ref('');
const createMembers = ref('');
const messageEndRef = ref<HTMLDivElement | null>(null);

// WebSocket
const chatSocket = ref<Socket | null>(null);

// ── WebSocket 连接 ──

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
    // 重新加入当前会话房间
    if (currentConv.value) {
      ws.emit('chat:join', { conv_id: currentConv.value.conv_id });
    }
  });

  ws.on('chat:message', (data: ChatMessage) => {
    if (data.conv_id === currentConv.value?.conv_id) {
      messages.value.push(data);
      scrollToBottom();
    }
    // 更新会话列表中的最近消息
    const conv = conversations.value.find((c) => c.conv_id === data.conv_id);
    if (conv) {
      conv.last_message = data.content;
      conv.last_activity = data.created_at;
    }
  });
}

// ── 加载数据 ──

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
    console.error('加载消息失败:', e);
    messages.value = [];
  }
}

// ── 切换会话 ──

function selectConversation(conv: ChatConversation) {
  if (currentConv.value) {
    chatSocket.value?.emit('chat:leave', { conv_id: currentConv.value.conv_id });
  }
  currentConv.value = conv;
  chatSocket.value?.emit('chat:join', { conv_id: conv.conv_id });
  loadMessages(conv.conv_id);
}

function scrollToBottom() {
  nextTick(() => {
    messageEndRef.value?.scrollIntoView({ behavior: 'smooth' });
  });
}

// ── 发送消息 ──

function sendMessage() {
  const content = inputText.value.trim();
  if (!content || !currentConv.value || !chatSocket.value?.connected) return;

  sending.value = true;
  chatSocket.value.emit('chat:send', {
    conv_id: currentConv.value.conv_id,
    content,
  });
  inputText.value = '';
  sending.value = false;
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

// ── 创建会话 ──

async function handleCreateConversation() {
  if (!createName.value && createConvType.value === 'group') {
    message.warning('请输入群聊名称');
    return;
  }
  if (!createMembers.value.trim()) {
    message.warning('请输入成员用户 ID');
    return;
  }

  loading.value = true;
  try {
    const memberIds = createMembers.value
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));

    const data: any = { conv_type: createConvType.value, member_ids: memberIds };
    if (createName.value) data.name = createName.value;

    const conv = await createConversationApi(data);
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
  } finally {
    loading.value = false;
  }
}

function convName(conv: ChatConversation): string {
  if (conv.name) return conv.name;
  if (conv.type === 'group') return '群聊';
  return `用户 ${conv.member_ids.find((id) => id !== 1) || conv.member_ids[0]}`;
}

function convIcon(conv: ChatConversation): string {
  return conv.type === 'group' ? '👥' : '👤';
}

function formatTime(ts: string | null): string {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

// ── 生命周期 ──

onMounted(async () => {
  connectChatSocket();
  await loadConversations();
});

onUnmounted(() => {
  chatSocket.value?.disconnect();
});
</script>

<template>
  <Page auto-content-height>
    <div class="flex h-full gap-0 overflow-hidden rounded-lg border border-[var(--border)]">
      <!-- 左：会话列表 -->
      <div class="flex w-72 flex-col border-r border-[var(--border)] bg-[var(--bg-card)]">
        <div class="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <span class="font-semibold">消息</span>
          <VbenButton size="small" @click="showCreateModal = true">+</VbenButton>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div
            v-for="conv in conversations"
            :key="conv.conv_id"
            class="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--bg-muted)]"
            :class="{ 'bg-[var(--bg-muted)]': currentConv?.conv_id === conv.conv_id }"
            @click="selectConversation(conv)"
          >
            <span class="flex size-10 items-center justify-center rounded-full bg-[var(--bg-muted)] text-lg">
              {{ convIcon(conv) }}
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between">
                <span class="truncate text-sm font-medium">{{ convName(conv) }}</span>
                <span class="ml-2 shrink-0 text-xs text-[var(--text-tertiary)]">
                  {{ formatTime(conv.last_activity) }}
                </span>
              </div>
              <div class="truncate text-xs text-[var(--text-tertiary)]">
                {{ conv.last_message || '暂无消息' }}
              </div>
            </div>
          </div>
          <div v-if="conversations.length === 0" class="py-8 text-center text-xs text-[var(--text-tertiary)]">
            暂无会话
          </div>
        </div>
      </div>

      <!-- 右：聊天区域 -->
      <div class="flex flex-1 flex-col">
        <!-- 聊天头部 -->
        <div v-if="currentConv" class="flex items-center border-b border-[var(--border)] px-4 py-3">
          <span class="mr-2 text-lg">{{ convIcon(currentConv) }}</span>
          <span class="font-medium">{{ convName(currentConv) }}</span>
          <span class="ml-2 text-xs text-[var(--text-tertiary)]">
            {{ currentConv.type === 'group' ? `${currentConv.member_ids.length} 人` : '私聊' }}
          </span>
        </div>
        <div v-else class="flex items-center border-b border-[var(--border)] px-4 py-3">
          <span class="text-[var(--text-tertiary)]">选择一个会话开始聊天</span>
        </div>

        <!-- 消息列表 -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="messages.length === 0" class="py-8 text-center text-xs text-[var(--text-tertiary)]">
            暂无消息
          </div>
          <div v-for="msg in messages" :key="msg.message_id" class="mb-3">
            <div class="flex items-start gap-2">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg-muted)] text-xs">
                {{ msg.sender_name?.charAt(0) || '?' }}
              </span>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ msg.sender_name }}</span>
                  <span class="text-xs text-[var(--text-tertiary)]">{{ formatTime(msg.created_at) }}</span>
                </div>
                <div class="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {{ msg.content }}
                </div>
              </div>
            </div>
          </div>
          <div ref="messageEndRef" />
        </div>

        <!-- 输入框 -->
        <div v-if="currentConv" class="border-t border-[var(--border)] p-3">
          <div class="flex gap-2">
            <a-textarea
              v-model:value="inputText"
              :rows="2"
              placeholder="输入消息，Enter 发送，Shift+Enter 换行"
              :disabled="!chatSocket?.connected"
              @keydown="handleKeydown"
            />
            <VbenButton :disabled="!inputText.trim() || !chatSocket?.connected" @click="sendMessage">
              发送
            </VbenButton>
          </div>
          <div class="mt-1 text-xs text-[var(--text-tertiary)]">
            {{ chatSocket?.connected ? '● 已连接' : '○ 未连接' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 创建会话弹窗 -->
    <Modal
      :open="showCreateModal"
      title="创建会话"
      @cancel="showCreateModal = false"
      @ok="handleCreateConversation"
    >
      <div class="space-y-3">
        <div>
          <label class="mb-1 block text-sm">会话类型</label>
          <a-radio-group v-model:value="createConvType">
            <a-radio value="group">群聊</a-radio>
            <a-radio value="private">私聊</a-radio>
          </a-radio-group>
        </div>
        <div>
          <label class="mb-1 block text-sm">名称</label>
          <a-input
            v-model:value="createName"
            :placeholder="createConvType === 'group' ? '群聊名称' : '私聊名称(可选)'"
          />
        </div>
        <div>
          <label class="mb-1 block text-sm">成员用户 ID</label>
          <a-input
            v-model:value="createMembers"
            placeholder="多个 ID 用逗号分隔，如: 2,3,5"
          />
        </div>
      </div>
    </Modal>
  </Page>
</template>
