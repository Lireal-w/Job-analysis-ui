import type { PaginationResult } from '#/types';
import { requestClient } from '#/api/request';

export interface DataLayerResult {
  id: number;
  name: string;
  layer_type: string;
  description: string | null;
  sort: number;
  created_time: string;
  updated_time: string | null;
}

export interface DatasetResult {
  id: number;
  name: string;
  description: string | null;
  layer_id: number | null;
  schema_config: Record<string, any> | null;
  source_type: string | null;
  source_id: number | null;
  record_count: number;
  storage_size: number;
  lifecycle_days: number | null;
  status: number;
  created_by: number | null;
  created_time: string;
  updated_time: string | null;
}

export interface CreateDatasetParams {
  name: string;
  description?: string;
  layer_id?: number;
  schema_config?: Record<string, any>;
  source_type?: string;
  source_id?: number;
  lifecycle_days?: number;
}

export type UpdateDatasetParams = Partial<CreateDatasetParams>;

export interface DatasetParams {
  name?: string;
  layer_id?: number;
  status?: number;
  page?: number;
  size?: number;
}

export async function getAllDataLayerApi() {
  return requestClient.get<DataLayerResult[]>('/api/v1/sys/data-storage/layers/all');
}

export async function getDataLayerListApi() {
  return requestClient.get<DataLayerResult[]>('/api/v1/sys/data-storage/layers');
}

export async function createDataLayerApi(data: { name: string; layer_type: string; description?: string; sort?: number }) {
  return requestClient.post('/api/v1/sys/data-storage/layers', data);
}

export async function updateDataLayerApi(pk: number, data: Partial<{ name: string; layer_type: string; description: string; sort: number }>) {
  return requestClient.put(`/api/v1/sys/data-storage/layers/${pk}`, data);
}

export async function deleteDataLayerApi(pks: number[]) {
  return requestClient.delete('/api/v1/sys/data-storage/layers', { data: { pks } });
}

export async function getAllDatasetApi() {
  return requestClient.get<DatasetResult[]>('/api/v1/sys/data-storage/datasets/all');
}

export async function getDatasetListApi(params?: DatasetParams) {
  return requestClient.get<PaginationResult<DatasetResult>>('/api/v1/sys/data-storage/datasets', { params });
}

export async function getDatasetApi(pk: number) {
  return requestClient.get<DatasetResult>(`/api/v1/sys/data-storage/datasets/${pk}`);
}

export async function createDatasetApi(data: CreateDatasetParams) {
  return requestClient.post('/api/v1/sys/data-storage/datasets', data);
}

export async function updateDatasetApi(pk: number, data: UpdateDatasetParams) {
  return requestClient.put(`/api/v1/sys/data-storage/datasets/${pk}`, data);
}

export async function deleteDatasetApi(pks: number[]) {
  return requestClient.delete('/api/v1/sys/data-storage/datasets', { data: { pks } });
}
