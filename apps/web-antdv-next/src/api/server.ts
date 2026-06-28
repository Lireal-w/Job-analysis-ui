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
 * 分页获取服务器列表
 */
export async function getSSHServerListApi(params?: SSHServerParams) {
  return requestClient.get<PaginationResult<SSHServerResult>>(
    '/api/v1/sys/servers',
    { params },
  );
}

/**
 * 获取所有服务器
 */
export async function getAllSSHServerApi() {
  return requestClient.get<SSHServerResult[]>('/api/v1/sys/servers/all');
}

/**
 * 获取服务器详情
 */
export async function getSSHServerApi(pk: number) {
  return requestClient.get<SSHServerResult>(`/api/v1/sys/servers/${pk}`);
}

/**
 * 创建服务器
 */
export async function createSSHServerApi(data: CreateSSHServerParams) {
  return requestClient.post('/api/v1/sys/servers', data);
}

/**
 * 更新服务器
 */
export async function updateSSHServerApi(
  pk: number,
  data: UpdateSSHServerParams,
) {
  return requestClient.put(`/api/v1/sys/servers/${pk}`, data);
}

/**
 * 删除服务器（支持批量）
 */
export async function deleteSSHServerApi(pks: number[]) {
  return requestClient.delete('/api/v1/sys/servers', { params: { pks } });
}

/**
 * 测试连接
 */
export async function testSSHConnectionApi(data: SSHTestConnectionParams) {
  return requestClient.post<{ success?: boolean; message?: string }>(
    '/api/v1/sys/servers/test-connection',
    data,
  );
}

/**
 * 更新服务器状态
 */
export async function updateSSHServerStatusApi(pk: number, status: number) {
  return requestClient.put(`/api/v1/sys/servers/${pk}/status`, null, {
    params: { status },
  });
}
