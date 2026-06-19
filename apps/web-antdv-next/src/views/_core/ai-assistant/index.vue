<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

import { message } from 'antdv-next';

import {
  activateAiConfigApi,
  AiAssistantClient,
  createAiConfigApi,
  getActiveAiConfigApi,
  getAiConfigListApi,
} from '#/api';

interface ChatEntry {
  role: 'user' | 'assistant';
  content: string;
  toolName?: string;
  isTool?: boolean;
  isError?: boolean;
  timestamp: number;
}

// ==================== 状态 ====================

const visible = ref(false);
const messages = ref<ChatEntry[]>([]);
const inputText = ref('');
const loading = ref(false);
const showConfig = ref(false);
const connectionOk = ref(false);

// AI 配置表单
const configName = ref('');
const configProvider = ref('deepseek');
const configApiBase = ref('https://api.deepseek.com/v1');
const configApiKey = ref('');
const configModel = ref('deepseek-chat');

// 已保存的配置列表
const configList = ref<Array<{ id: number; name: string; is_active: boolean }>>([]);

const chatContainer = ref<HTMLDivElement | null>(null);

// ==================== WebSocket 客户端 ====================

let aiClient: AiAssistantClient | null = null;

function initAiClient() {
  aiClient = new AiAssistantClient();
  aiClient.connect();

  aiClient.onMessage((data) => {
    switch (data.type) {
      case 'message': {
        // 流式追加
        const last = messages.value[messages.value.length - 1];
        if (
          last?.role === 'assistant' &&
          !last.isTool &&
          !last.isError &&
          messages.value.length > 0
        ) {
          last.content += data.content || '';
        } else {
          messages.value.push({
            role: 'assistant',
            content: data.content || '',
            timestamp: Date.now(),
          });
        }
        scrollToBottom();
        break;
      }
      case 'tool_call': {
        messages.value.push({
          role: 'assistant',
          content: `🔧 正在执行: ${data.tool_name}`,
          toolName: data.tool_name,
          isTool: true,
          timestamp: Date.now(),
        });
        scrollToBottom();
        break;
      }
      case 'tool_result': {
        messages.value.push({
          role: 'assistant',
          content: data.content || '',
          toolName: data.tool_name,
          isTool: true,
          timestamp: Date.now(),
        });
        saveMessages();
        scrollToBottom();
        break;
      }
      case 'done': {
        loading.value = false;
        saveMessages();
        scrollToBottom();
        break;
      }
      case 'error': {
        messages.value.push({
          role: 'assistant',
          content: `❌ ${data.content || '请求失败'}`,
          isError: true,
          timestamp: Date.now(),
        });
        loading.value = false;
        saveMessages();
        scrollToBottom();
        break;
      }
    }
  });

  // 连接成功后检查 AI 配置是否已激活
  setTimeout(async () => {
    connectionOk.value = true;
    await loadActiveConfig();
  }, 1500);
}

// ==================== 生命周期 ====================

onMounted(() => {
  const saved = localStorage.getItem('ai-assistant-messages');
  if (saved) {
    try {
      messages.value = JSON.parse(saved);
    } catch {}
  }
});

onUnmounted(() => {
  aiClient?.disconnect();
});

// ==================== AI 配置管理 ====================

async function loadActiveConfig() {
  try {
    const active = await getActiveAiConfigApi();
    if (active) {
      configName.value = active.name;
      configProvider.value = active.provider;
      configApiBase.value = active.api_base;
      configModel.value = active.model;
      // API Key 不回显
    }
  } catch {
    // 没有激活的配置，正常
  }
}

async function loadConfigList() {
  try {
    const list = await getAiConfigListApi();
    configList.value = list.map((c) => ({
      id: c.id,
      name: c.name,
      is_active: c.is_active,
    }));
  } catch {
    configList.value = [];
  }
}

async function saveConfig() {
  if (!configApiKey.value && configList.value.length === 0) {
    message.warning('请输入 API Key');
    return;
  }

  try {
    // 创建新配置
    const created = await createAiConfigApi({
      name: configName.value || configProvider.value,
      provider: configProvider.value,
      api_base: configApiBase.value,
      api_key: configApiKey.value,
      model: configModel.value,
      max_tokens: 8192,
      temperature: 0.7,
    });

    // 激活
    await activateAiConfigApi(created.id);
    message.success('AI 配置已保存并激活');
    showConfig.value = false;
    await loadConfigList();
  } catch (error: any) {
    message.error(error?.message || '保存配置失败');
  }
}

// ==================== 消息处理 ====================

function sendMessage() {
  const text = inputText.value.trim();
  if (!text || loading.value) return;

  // 如果还没有激活配置且没连接，先尝试检查
  if (!connectionOk.value) {
    message.warning('WebSocket 正在连接中，请稍候...');
    return;
  }

  if (!aiClient) {
    initAiClient();
    // 给连接一点时间
    setTimeout(() => doSend(text), 1000);
    return;
  }

  doSend(text);
}

function doSend(text: string) {
  inputText.value = '';
  messages.value.push({
    role: 'user',
    content: text,
    timestamp: Date.now(),
  });
  saveMessages();
  scrollToBottom();

  loading.value = true;
  aiClient?.sendMessage(text);
}

function clearSession() {
  aiClient?.clearSession();
  messages.value = [];
  localStorage.removeItem('ai-assistant-messages');
}

function saveMessages() {
  localStorage.setItem(
    'ai-assistant-messages',
    JSON.stringify(messages.value.slice(-100)),
  );
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

// ==================== 配置弹窗 ====================

const showConfigModal = ref(false);

async function openConfig() {
  showConfigModal.value = true;
  await loadConfigList();
  await loadActiveConfig();
}
</script>

<template>
  <!-- 悬浮按钮 -->
  <div
    class="ai-fab"
    :class="{ 'ai-fab--active': visible }"
    @click="visible = !visible"
  >
    <span class="ai-fab__icon">AI</span>
  </div>

  <!-- 浮窗卡片 -->
  <Transition name="ai-slide">
    <div v-if="visible" class="ai-panel">
      <!-- 头部 -->
      <div class="ai-panel__header">
        <span class="ai-panel__title">AI 助手</span>
        <div class="ai-panel__actions">
          <button class="ai-panel__btn" title="AI 配置" @click="openConfig">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          </button>
          <button class="ai-panel__btn" title="清空对话" @click="clearSession">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            </svg>
          </button>
          <button class="ai-panel__btn" title="关闭" @click="visible = false">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 连接状态 -->
      <div
        v-if="!connectionOk"
        class="ai-status ai-status--connecting"
      >
        WebSocket 连接中...
      </div>

      <!-- 消息列表 -->
      <div ref="chatContainer" class="ai-chat">
        <div v-if="messages.length === 0" class="ai-chat__empty">
          <div class="ai-chat__empty-icon">AI</div>
          <p>你好！我是 AI 助手</p>
          <p class="ai-chat__empty-hint">
            可以让我帮你创建采集任务、查询数据、分析问题
          </p>
        </div>
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['ai-msg', `ai-msg--${msg.role}`, { 'ai-msg--tool': msg.isTool, 'ai-msg--error': msg.isError }]"
        >
          <div class="ai-msg__avatar">
            {{ msg.role === 'assistant' ? 'AI' : 'U' }}
          </div>
          <div class="ai-msg__content">
            <div class="ai-msg__text">{{ msg.content }}</div>
            <div v-if="loading && i === messages.length - 1 && msg.role === 'assistant' && !msg.content && !msg.isTool" class="ai-msg__typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区 -->
      <div class="ai-input">
        <textarea
          v-model="inputText"
          class="ai-input__field"
          placeholder="输入你的问题..."
          :disabled="loading"
          @keydown="handleKeydown"
        />
        <button
          class="ai-input__send"
          :disabled="!inputText.trim() || loading"
          @click="sendMessage"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>

  <!-- AI 配置弹窗 -->
  <Transition name="ai-fade">
    <div v-if="showConfigModal" class="ai-config-overlay" @click.self="showConfigModal = false">
      <div class="ai-config-modal">
        <div class="ai-config-modal__header">
          <span>AI 模型配置</span>
          <button class="ai-panel__btn" @click="showConfigModal = false">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- 已有配置列表 -->
        <div v-if="configList.length > 0" class="ai-config-modal__list">
          <div class="ai-config-modal__list-title">已有配置</div>
          <div
            v-for="cfg in configList"
            :key="cfg.id"
            class="ai-config-modal__item"
          >
            <span>{{ cfg.name }}</span>
            <a-tag v-if="cfg.is_active" color="green">已激活</a-tag>
          </div>
        </div>

        <div class="ai-config-modal__form">
          <div class="ai-config__field">
            <label>配置名称</label>
            <input v-model="configName" placeholder="例如: DeepSeek V3" />
          </div>
          <div class="ai-config__field">
            <label>提供商</label>
            <select v-model="configProvider">
              <option value="deepseek">DeepSeek</option>
              <option value="openai">OpenAI</option>
              <option value="custom">自定义</option>
            </select>
          </div>
          <div class="ai-config__field">
            <label>API 地址</label>
            <input v-model="configApiBase" placeholder="https://api.deepseek.com/v1" />
          </div>
          <div class="ai-config__field">
            <label>模型</label>
            <input v-model="configModel" placeholder="deepseek-chat" />
          </div>
          <div class="ai-config__field">
            <label>API Key</label>
            <input v-model="configApiKey" type="password" placeholder="sk-..." />
          </div>
        </div>

        <div class="ai-config-modal__footer">
          <button class="ai-config__save" @click="saveConfig">保存并激活</button>
        </div>
      </div>
    </div>
  </Transition>
</template>


<style scoped>
/* ========== 悬浮按钮 ========== */
.ai-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10000;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(271 91% 65%));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px hsla(0, 0%, 0%, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.ai-fab:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 28px hsla(0, 0%, 0%, 0.4);
}

.ai-fab--active {
  box-shadow: 0 0 0 4px hsl(var(--primary) / 0.3);
}

.ai-fab__icon {
  font-family: 'Impact', 'Arial Black', sans-serif;
  font-size: 18px;
  letter-spacing: 1px;
}

/* ========== 浮窗面板 ========== */
.ai-panel {
  position: fixed;
  bottom: 90px;
  right: 24px;
  z-index: 9999;
  width: 400px;
  height: 580px;
  max-height: calc(100vh - 140px);
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px hsla(0, 0%, 0%, 0.4);
  overflow: hidden;
}

/* ========== 头部 ========== */
.ai-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid hsl(var(--border) / 0.6);
  flex-shrink: 0;
}

.ai-panel__title {
  font-size: 15px;
  font-weight: 600;
  color: hsl(var(--foreground));
  letter-spacing: 1px;
}

.ai-panel__actions {
  display: flex;
  gap: 4px;
}

.ai-panel__btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.ai-panel__btn:hover {
  background: hsl(var(--accent));
  color: hsl(var(--foreground));
}

/* ========== 连接状态条 ========== */
.ai-status {
  padding: 6px 16px;
  font-size: 11px;
  text-align: center;
  flex-shrink: 0;
}

.ai-status--connecting {
  background: hsl(42 100% 62% / 0.15);
  color: hsl(42 100% 62%);
}

/* ========== 聊天区域 ========== */
.ai-chat {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-chat::-webkit-scrollbar {
  width: 4px;
}

.ai-chat::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 2px;
}

/* 空状态 */
.ai-chat__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: hsl(var(--muted-foreground));
  text-align: center;
  gap: 8px;
}

.ai-chat__empty-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: hsl(var(--primary) / 0.15);
  color: hsl(var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Impact', sans-serif;
  font-size: 20px;
  margin-bottom: 4px;
}

.ai-chat__empty p {
  margin: 0;
  font-size: 14px;
  color: hsl(var(--foreground) / 0.7);
}

.ai-chat__empty-hint {
  font-size: 12px !important;
  color: hsl(var(--muted-foreground)) !important;
}

/* ========== 消息气泡 ========== */
.ai-msg {
  display: flex;
  gap: 10px;
  max-width: 92%;
}

.ai-msg--user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-msg--assistant {
  align-self: flex-start;
}

.ai-msg__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}

.ai-msg--user .ai-msg__avatar {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.ai-msg--assistant .ai-msg__avatar {
  background: hsl(271 91% 65% / 0.2);
  color: hsl(271 91% 65%);
}

.ai-msg__content {
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
}

.ai-msg--user .ai-msg__content {
  background: hsl(var(--primary) / 0.15);
  color: hsl(var(--foreground));
  border-bottom-right-radius: 4px;
}

.ai-msg--assistant .ai-msg__content {
  background: hsl(var(--accent));
  color: hsl(var(--foreground));
  border-bottom-left-radius: 4px;
}

.ai-msg--tool .ai-msg__content {
  background: hsl(271 91% 65% / 0.08);
  border: 1px solid hsl(271 91% 65% / 0.2);
  font-size: 12px;
}

.ai-msg--error .ai-msg__content {
  background: hsl(0 84% 60% / 0.08);
  color: hsl(0 84% 60%);
}

/* 打字动画 */
.ai-msg__typing {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.ai-msg__typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: hsl(var(--muted-foreground));
  animation: ai-bounce 1.4s infinite ease-in-out both;
}

.ai-msg__typing span:nth-child(1) { animation-delay: -0.32s; }
.ai-msg__typing span:nth-child(2) { animation-delay: -0.16s; }

@keyframes ai-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* ========== 输入区 ========== */
.ai-input {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid hsl(var(--border) / 0.6);
  flex-shrink: 0;
}

.ai-input__field {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--input-background));
  color: hsl(var(--foreground));
  font-size: 13px;
  font-family: inherit;
  resize: none;
  outline: none;
  min-height: 36px;
  max-height: 80px;
  line-height: 1.4;
  transition: border-color 0.15s;
}

.ai-input__field:focus {
  border-color: hsl(var(--primary));
}

.ai-input__field::placeholder {
  color: hsl(var(--input-placeholder));
}

.ai-input__send {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.15s;
}

.ai-input__send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ai-input__send:not(:disabled):hover {
  opacity: 0.85;
}

/* ========== 配置弹窗遮罩 ========== */
.ai-config-overlay {
  position: fixed;
  inset: 0;
  z-index: 10001;
  background: hsla(0, 0%, 0%, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-config-modal {
  width: 420px;
  max-height: 80vh;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px hsla(0, 0%, 0%, 0.4);
  overflow: hidden;
}

.ai-config-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid hsl(var(--border) / 0.6);
  font-weight: 600;
  font-size: 15px;
  color: hsl(var(--foreground));
}

.ai-config-modal__list {
  padding: 12px 20px;
  border-bottom: 1px solid hsl(var(--border) / 0.4);
}

.ai-config-modal__list-title {
  font-size: 11px;
  color: hsl(var(--muted-foreground));
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.ai-config-modal__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
  color: hsl(var(--foreground));
}

.ai-config-modal__form {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
}

.ai-config-modal__footer {
  padding: 12px 20px;
  border-top: 1px solid hsl(var(--border) / 0.6);
  display: flex;
  justify-content: flex-end;
}

/* ========== 配置表单字段 ========== */
.ai-config__field {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ai-config__field label {
  font-size: 11px;
  color: hsl(var(--muted-foreground));
  letter-spacing: 0.5px;
}

.ai-config__field input,
.ai-config__field select {
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--input-background));
  color: hsl(var(--foreground));
  font-size: 12px;
  outline: none;
  transition: border-color 0.15s;
}

.ai-config__field input:focus,
.ai-config__field select:focus {
  border-color: hsl(var(--primary));
}

.ai-config__field select {
  cursor: pointer;
}

.ai-config__field select option {
  background: hsl(var(--card));
  color: hsl(var(--foreground));
}

.ai-config__save {
  padding: 7px 20px;
  border-radius: 6px;
  border: none;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.ai-config__save:hover {
  opacity: 0.85;
}

/* ========== 过渡动画 ========== */
.ai-slide-enter-active,
.ai-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-slide-enter-from,
.ai-slide-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

.ai-fade-enter-active,
.ai-fade-leave-active {
  transition: all 0.15s;
}

.ai-fade-enter-from,
.ai-fade-leave-to {
  opacity: 0;
}
</style>


<style scoped>
/* ========== 悬浮按钮 ========== */
.ai-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 10000;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(271 91% 65%));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px hsla(0, 0%, 0%, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.ai-fab:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 28px hsla(0, 0%, 0%, 0.4);
}

.ai-fab--active {
  box-shadow: 0 0 0 4px hsl(var(--primary) / 0.3);
}

.ai-fab__icon {
  font-family: 'Impact', 'Arial Black', sans-serif;
  font-size: 18px;
  letter-spacing: 1px;
}

/* ========== 浮窗面板 ========== */
.ai-panel {
  position: fixed;
  bottom: 90px;
  right: 24px;
  z-index: 9999;
  width: 400px;
  height: 580px;
  max-height: calc(100vh - 140px);
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px hsla(0, 0%, 0%, 0.4);
  overflow: hidden;
}

/* ========== 头部 ========== */
.ai-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid hsl(var(--border) / 0.6);
  flex-shrink: 0;
}

.ai-panel__title {
  font-size: 15px;
  font-weight: 600;
  color: hsl(var(--foreground));
  letter-spacing: 1px;
}

.ai-panel__actions {
  display: flex;
  gap: 4px;
}

.ai-panel__btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: hsl(var(--muted-foreground));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.ai-panel__btn:hover,
.ai-panel__btn--active {
  background: hsl(var(--accent));
  color: hsl(var(--foreground));
}

/* ========== 配置面板 ========== */
.ai-config {
  padding: 12px 16px;
  border-bottom: 1px solid hsl(var(--border) / 0.6);
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.ai-config__field {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ai-config__field label {
  font-size: 11px;
  color: hsl(var(--muted-foreground));
  letter-spacing: 0.5px;
}

.ai-config__field input {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--input-background));
  color: hsl(var(--foreground));
  font-size: 12px;
  outline: none;
  transition: border-color 0.15s;
}

.ai-config__field input:focus {
  border-color: hsl(var(--primary));
}

.ai-config__save {
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-end;
  transition: opacity 0.15s;
}

.ai-config__save:hover {
  opacity: 0.85;
}

/* ========== 聊天区域 ========== */
.ai-chat {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-chat::-webkit-scrollbar {
  width: 4px;
}

.ai-chat::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 2px;
}

/* 空状态 */
.ai-chat__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: hsl(var(--muted-foreground));
  text-align: center;
  gap: 8px;
}

.ai-chat__empty-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: hsl(var(--primary) / 0.15);
  color: hsl(var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Impact', sans-serif;
  font-size: 20px;
  margin-bottom: 4px;
}

.ai-chat__empty p {
  margin: 0;
  font-size: 14px;
  color: hsl(var(--foreground) / 0.7);
}

.ai-chat__empty-hint {
  font-size: 12px !important;
  color: hsl(var(--muted-foreground)) !important;
}

/* ========== 消息气泡 ========== */
.ai-msg {
  display: flex;
  gap: 10px;
  max-width: 90%;
}

.ai-msg--user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-msg--assistant {
  align-self: flex-start;
}

.ai-msg__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  flex-shrink: 0;
}

.ai-msg--user .ai-msg__avatar {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

.ai-msg--assistant .ai-msg__avatar {
  background: hsl(271 91% 65% / 0.2);
  color: hsl(271 91% 65%);
}

.ai-msg__content {
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
}

.ai-msg--user .ai-msg__content {
  background: hsl(var(--primary) / 0.15);
  color: hsl(var(--foreground));
  border-bottom-right-radius: 4px;
}

.ai-msg--assistant .ai-msg__content {
  background: hsl(var(--accent));
  color: hsl(var(--foreground));
  border-bottom-left-radius: 4px;
}

/* 打字动画 */
.ai-msg__typing {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.ai-msg__typing span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: hsl(var(--muted-foreground));
  animation: ai-bounce 1.4s infinite ease-in-out both;
}

.ai-msg__typing span:nth-child(1) { animation-delay: -0.32s; }
.ai-msg__typing span:nth-child(2) { animation-delay: -0.16s; }

@keyframes ai-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* ========== 输入区 ========== */
.ai-input {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid hsl(var(--border) / 0.6);
  flex-shrink: 0;
}

.ai-input__field {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--input-background));
  color: hsl(var(--foreground));
  font-size: 13px;
  font-family: inherit;
  resize: none;
  outline: none;
  min-height: 36px;
  max-height: 80px;
  line-height: 1.4;
  transition: border-color 0.15s;
}

.ai-input__field:focus {
  border-color: hsl(var(--primary));
}

.ai-input__field::placeholder {
  color: hsl(var(--input-placeholder));
}

.ai-input__send {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.15s;
}

.ai-input__send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ai-input__send:not(:disabled):hover {
  opacity: 0.85;
}

/* ========== 过渡动画 ========== */
.ai-slide-enter-active,
.ai-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.ai-slide-enter-from,
.ai-slide-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

.ai-fade-enter-active,
.ai-fade-leave-active {
  transition: all 0.15s;
}

.ai-fade-enter-from,
.ai-fade-leave-to {
  opacity: 0;
}
</style>
