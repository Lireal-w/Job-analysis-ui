import type { PaginationResult } from '#/types';

import { requestClient } from './request';

/** SSH 服务器查询参数 */
export interface SSHServerParams {
  name?: string;
  page?: number;
  size?: number;
}

/** SSH 服务器结果 */
export interface SSHServerResult {
  id: number;
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  ssh_key?: string;
  description?: string;
  status: number;
  created_time: string;
  updated_time?: string;
}

/** 创建 SSH 服务器参数 */
export interface CreateSSHServerParams {
  name: string;
  host: string;
  port?: number;
  username: string;
  password?: string;
  ssh_key?: string;
  description?: string;
}

/** 更新 SSH 服务器参数 */
export interface UpdateSSHServerParams extends CreateSSHServerParams {}

/** 测试 SSH 连接参数 */
export interface SSHTestConnectionParams {
  host: string;
  port?: number;
  username: string;
  password?: string;
  ssh_key?: string;
}

/**
 * 分页获取 SSH 服务器列表
 */
export async function getSSHServerListApi(params?: SSHServerParams) {
  return requestClient.get<PaginationResult<SSHServerResult>>(
    '/api/v1/sys/ssh',
    { params },
  );
}

/**
 * 获取所有 SSH 服务器
 */
export async function getAllSSHServerApi() {
  return requestClient.get<SSHServerResult[]>('/api/v1/sys/ssh/all');
}

/**
 * 获取 SSH 服务器详情
 */
export async function getSSHServerApi(pk: number) {
  return requestClient.get<SSHServerResult>(`/api/v1/sys/ssh/${pk}`);
}

/**
 * 创建 SSH 服务器
 */
export async function createSSHServerApi(data: CreateSSHServerParams) {
  return requestClient.post('/api/v1/sys/ssh', data);
}

/**
 * 更新 SSH 服务器
 */
export async function updateSSHServerApi(
  pk: number,
  data: UpdateSSHServerParams,
) {
  return requestClient.put(`/api/v1/sys/ssh/${pk}`, data);
}

/**
 * 删除 SSH 服务器（支持批量）
 */
export async function deleteSSHServerApi(pks: number[]) {
  return requestClient.delete('/api/v1/sys/ssh', { params: { pks } });
}

/**
 * 测试 SSH 连接
 */
export async function testSSHConnectionApi(data: SSHTestConnectionParams) {
  return requestClient.post<{ success?: boolean; message?: string }>(
    '/api/v1/sys/ssh/test-connection',
    data,
  );
}

/**
 * 更新 SSH 服务器状态
 */
export async function updateSSHServerStatusApi(pk: number, status: number) {
  return requestClient.put(`/api/v1/sys/ssh/${pk}/status`, null, {
    params: { status },
  });
}
