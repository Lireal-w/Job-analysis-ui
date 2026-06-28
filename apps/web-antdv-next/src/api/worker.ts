import type { PaginationResult } from '#/types';

import { requestClient } from './request';

/** Worker 查询参数 */
export interface WorkerParams {
  name?: string;
  status?: string;
  page?: number;
  size?: number;
}

/** Worker 结果 */
export interface WorkerResult {
  id: number;
  name: string;
  host: string;
  port: number;
  tags?: string | null;
  description?: string | null;
  max_tasks: number;
  api_key?: string | null;
  status: string;
  version?: string | null;
  cpu_usage?: number | null;
  memory_usage?: number | null;
  task_count: number;
  last_heartbeat?: string | null;
  created_time: string;
  updated_time?: string | null;
}

/** 创建 Worker 参数 */
export interface CreateWorkerParams {
  name: string;
  host: string;
  port?: number;
  tags?: string | null;
  description?: string | null;
  max_tasks?: number;
}

/** 更新 Worker 参数 */
export interface UpdateWorkerParams extends CreateWorkerParams {}

/**
 * 分页获取 Worker 列表
 */
export async function getWorkerListApi(params?: WorkerParams) {
  return requestClient.get<PaginationResult<WorkerResult>>(
    '/api/v1/sys/workers',
    { params },
  );
}

/**
 * 获取所有 Worker
 */
export async function getAllWorkerApi() {
  return requestClient.get<WorkerResult[]>('/api/v1/sys/workers/all');
}

/**
 * 获取在线 Worker
 */
export async function getOnlineWorkerApi() {
  return requestClient.get<WorkerResult[]>('/api/v1/sys/workers/online');
}

/**
 * 获取 Worker 详情
 */
export async function getWorkerApi(pk: number) {
  return requestClient.get<WorkerResult>(`/api/v1/sys/workers/${pk}`);
}

/**
 * 创建 Worker
 */
export async function createWorkerApi(data: CreateWorkerParams) {
  return requestClient.post('/api/v1/sys/workers', data);
}

/**
 * 更新 Worker
 */
export async function updateWorkerApi(pk: number, data: UpdateWorkerParams) {
  return requestClient.put(`/api/v1/sys/workers/${pk}`, data);
}

/**
 * 删除 Worker（支持批量）
 */
export async function deleteWorkerApi(pks: number[]) {
  return requestClient.delete('/api/v1/sys/workers', { params: { pks } });
}
