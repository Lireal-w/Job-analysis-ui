import { io, Socket } from 'socket.io-client';

import { requestClient } from '#/api/request';

// ==================== AI 配置 REST API ====================

/** 创建 AI 配置参数 */
export interface CreateAiConfigParams {
  name: string;
  provider?: string;
  api_base?: string;
  api_key: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
  system_prompt?: string | null;
  enabled?: boolean;
  remark?: string | null;
}

/** AI 配置响应 */
export interface AiConfigResult {
  id: number;
  name: string;
  provider: string;
  api_base: string;
  model: string;
  max_tokens: number;
  temperature: number;
  system_prompt: string | null;
  enabled: boolean;
  is_active: boolean;
  remark: string | null;
  created_by: number;
  created_time: string;
  updated_time: string | null;
}

/** 获取 AI 配置列表 */
export async function getAiConfigListApi(params?: { name?: string; provider?: string }) {
  return requestClient.get<AiConfigResult[]>('/api/v1/ai-config', { params });
}

/** 获取当前激活的 AI 配置 */
export async function getActiveAiConfigApi() {
  return requestClient.get<AiConfigResult>('/api/v1/ai-config/active');
}

/** 创建 AI 配置 */
export async function createAiConfigApi(data: CreateAiConfigParams) {
  return requestClient.post<AiConfigResult>('/api/v1/ai-config', data);
}

/** 获取 AI 配置详情 */
export async function getAiConfigDetailApi(pk: number) {
  return requestClient.get<AiConfigResult>(`/api/v1/ai-config/${pk}`);
}

/** 更新 AI 配置 */
export async function updateAiConfigApi(pk: number, data: Partial<CreateAiConfigParams>) {
  return requestClient.put<AiConfigResult>(`/api/v1/ai-config/${pk}`, data);
}

/** 激活 AI 配置 */
export async function activateAiConfigApi(pk: number) {
  return requestClient.put(`/api/v1/ai-config/${pk}/activate`);
}

/** 删除 AI 配置 */
export async function deleteAiConfigApi(pks: number[]) {
  return requestClient.delete('/api/v1/ai-config', { data: { pks } });
}

// ==================== AI 助手 WebSocket 客户端 ====================

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiToolCall {
  tool_name: string;
  tool_args: Record<string, any>;
}

export interface AiChatResponse {
  type: 'message' | 'tool_call' | 'tool_result' | 'done' | 'error';
  content?: string;
  tool_name?: string;
  tool_args?: Record<string, any>;
  tokens_used?: number;
  session_id?: string;
}

export type AiMessageCallback = (data: AiChatResponse) => void;

class AiAssistantClient {
  private mainSocket: Socket | null = null;
  private assistantSocket: Socket | null = null;
  private sessionId: string;
  private messageCallback: AiMessageCallback | null = null;

  constructor() {
    this.sessionId = this.generateUUID();
  }

  /** 建立 WebSocket 连接 */
  connect(): void {
    if (this.assistantSocket?.connected) return;

    const WS_URL = import.meta.env.VITE_GLOB_API_URL || 'http://localhost:8000';

    this.mainSocket = io(WS_URL, {
      path: '/ws/socket.io',
      transports: ['websocket'],
      forceNew: true,
      autoConnect: true,
    });

    this.assistantSocket = this.mainSocket.io.socket('/ws/assistant');

    this.assistantSocket.on('connect', () => {
      console.log('[AI] WebSocket 已连接');
    });

    this.assistantSocket.on('chat_response', (data: AiChatResponse) => {
      this.messageCallback?.(data);
    });

    this.assistantSocket.on('disconnect', (reason: string) => {
      console.log('[AI] WebSocket 已断开:', reason);
    });

    this.assistantSocket.on('connect_error', (error: Error) => {
      console.error('[AI] WebSocket 连接错误:', error);
    });
  }

  /** 注册消息回调 */
  onMessage(callback: AiMessageCallback): void {
    this.messageCallback = callback;
  }

  /** 发送对话消息 */
  sendMessage(content: string, stream = true): void {
    if (!this.assistantSocket?.connected) {
      this.messageCallback?.({
        type: 'error',
        content: 'WebSocket 未连接，请等待连接成功后再试',
      });
      return;
    }
    this.assistantSocket.emit('chat', {
      session_id: this.sessionId,
      content,
      stream,
    });
  }

  /** 清除会话 */
  clearSession(): void {
    this.assistantSocket?.emit('clear_session', {
      session_id: this.sessionId,
    });
    this.sessionId = this.generateUUID();
  }

  /** 断开连接 */
  disconnect(): void {
    this.assistantSocket?.disconnect();
    this.mainSocket?.disconnect();
    this.assistantSocket = null;
    this.mainSocket = null;
  }

  /** 获取当前 session ID */
  getSessionId(): string {
    return this.sessionId;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
}

export { AiAssistantClient };

