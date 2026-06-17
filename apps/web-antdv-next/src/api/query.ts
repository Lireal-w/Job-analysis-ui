import type { PaginationResult } from '#/types';
import { requestClient } from '#/api/request';

export interface ExecuteQueryParams {
  dataset_id?: number;
  query_sql: string;
  query_config?: Record<string, any>;
  query_type?: string;
  limit?: number;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  total: number;
  duration: number;
  status: string;
  error_message: string | null;
}

export interface QueryHistoryResult {
  id: number;
  name: string | null;
  dataset_id: number | null;
  query_type: string;
  query_sql: string;
  result_count: number;
  duration: number | null;
  status: string;
  error_message: string | null;
  created_by: number | null;
  created_time: string;
}

export interface SavedQueryResult {
  id: number;
  name: string;
  description: string | null;
  dataset_id: number | null;
  query_type: string;
  query_sql: string;
  query_config: Record<string, any> | null;
  tags: string | null;
  is_public: boolean;
  created_by: number | null;
  created_time: string;
  updated_time: string | null;
}

export interface CreateSavedQueryParams {
  name: string;
  description?: string;
  dataset_id?: number;
  query_type?: string;
  query_sql: string;
  query_config?: Record<string, any>;
  tags?: string;
  is_public?: boolean;
}

export type UpdateSavedQueryParams = Partial<CreateSavedQueryParams>;

export interface SavedQueryParams {
  name?: string;
  dataset_id?: number;
  page?: number;
  size?: number;
}

export async function executeQueryApi(data: ExecuteQueryParams) {
  return requestClient.post<QueryResult>('/api/v1/sys/query/execute', data);
}

export async function getQueryHistoryApi(params?: { page?: number; size?: number }) {
  return requestClient.get<PaginationResult<QueryHistoryResult>>('/api/v1/sys/query/history', { params });
}

export async function getQueryHistoryDetailApi(pk: number) {
  return requestClient.get<QueryHistoryResult>(`/api/v1/sys/query/history/${pk}`);
}

export async function getSavedQueryListApi(params?: SavedQueryParams) {
  return requestClient.get<PaginationResult<SavedQueryResult>>('/api/v1/sys/query/saved', { params });
}

export async function getSavedQueryApi(pk: number) {
  return requestClient.get<SavedQueryResult>(`/api/v1/sys/query/saved/${pk}`);
}

export async function createSavedQueryApi(data: CreateSavedQueryParams) {
  return requestClient.post('/api/v1/sys/query/saved', data);
}

export async function updateSavedQueryApi(pk: number, data: UpdateSavedQueryParams) {
  return requestClient.put(`/api/v1/sys/query/saved/${pk}`, data);
}

export async function deleteSavedQueryApi(pks: number[]) {
  return requestClient.delete('/api/v1/sys/query/saved', { data: { pks } });
}
