import { requestClient } from './request';

/** 会话数据 */
export interface ChatConversation {
  conv_id: string;
  type: 'private' | 'group';
  name: string;
  created_by: number;
  member_ids: number[];
  last_message: string | null;
  last_activity: string | null;
  created_at: string;
}

/** 消息数据 */
export interface ChatMessage {
  message_id: string;
  conv_id: string;
  sender_id: number;
  sender_name: string;
  sender_avatar: string;
  content: string;
  msg_type: string;
  created_at: string;
}

/** 创建会话参数 */
export interface CreateConversationParams {
  conv_type: 'private' | 'group';
  name?: string;
  member_ids: number[];
}

/**
 * 创建会话（私聊/群聊）
 */
export async function createConversationApi(data: CreateConversationParams) {
  return requestClient.post<ChatConversation>('/api/v1/chat/conversations', data);
}

/**
 * 获取我的会话列表
 */
export async function getConversationsApi() {
  return requestClient.get<ChatConversation[]>('/api/v1/chat/conversations');
}

/**
 * 获取会话详情
 */
export async function getConversationApi(convId: string) {
  return requestClient.get<ChatConversation>(`/api/v1/chat/conversations/${convId}`);
}

/**
 * 添加群成员
 */
export async function addMemberApi(convId: string, userId: number) {
  return requestClient.post(`/api/v1/chat/conversations/${convId}/members`, null, {
    params: { user_id: userId },
  });
}

/**
 * 移除群成员
 */
export async function removeMemberApi(convId: string, userId: number) {
  return requestClient.delete(`/api/v1/chat/conversations/${convId}/members/${userId}`);
}

/**
 * 获取消息历史
 */
export async function getMessagesApi(convId: string, page = 1, size = 50) {
  return requestClient.get<{ items: ChatMessage[]; total: number; page: number; size: number }>(
    `/api/v1/chat/conversations/${convId}/messages`,
    { params: { page, size } },
  );
}
