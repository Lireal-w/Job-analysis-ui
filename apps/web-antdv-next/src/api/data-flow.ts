import type { PaginationResult } from '#/types';
import { requestClient } from '#/api/request';

export interface DataFlowResult {
  id: number;
  name: string;
  description: string | null;
  nodes: Record<string, any>[] | null;
  edges: Record<string, any>[] | null;
  status: string;
  version: number;
  enabled: boolean;
  created_by: number | null;
  created_time: string;
  updated_time: string | null;
}

export interface CreateDataFlowParams {
  name: string;
  description?: string;
  nodes?: Record<string, any>[];
  edges?: Record<string, any>[];
}

export type UpdateDataFlowParams = Partial<CreateDataFlowParams>;

export interface DataFlowRunResult {
  id: number;
  flow_id: number;
  run_id: string;
  status: string;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  total_input: number;
  total_output: number;
  total_error: number;
  error_message: string | null;
  created_time: string;
}

export interface DataFlowParams {
  name?: string;
  status?: string;
  page?: number;
  size?: number;
}

export async function getAllDataFlowApi() {
  return requestClient.get<DataFlowResult[]>('/api/v1/sys/data-flows/all');
}

export async function getDataFlowListApi(params?: DataFlowParams) {
  return requestClient.get<PaginationResult<DataFlowResult>>('/api/v1/sys/data-flows', { params });
}

export async function getDataFlowApi(pk: number) {
  return requestClient.get<DataFlowResult>(`/api/v1/sys/data-flows/${pk}`);
}

export async function createDataFlowApi(data: CreateDataFlowParams) {
  return requestClient.post('/api/v1/sys/data-flows', data);
}

export async function updateDataFlowApi(pk: number, data: UpdateDataFlowParams) {
  return requestClient.put(`/api/v1/sys/data-flows/${pk}`, data);
}

export async function deleteDataFlowApi(pks: number[]) {
  return requestClient.delete('/api/v1/sys/data-flows', {
    params: { pks },
    paramsSerializer: 'repeat',
  });
}

export async function publishDataFlowApi(pk: number) {
  return requestClient.post(`/api/v1/sys/data-flows/${pk}/publish`);
}

export async function runDataFlowApi(pk: number) {
  return requestClient.post(`/api/v1/sys/data-flows/${pk}/run`);
}

export async function getDataFlowRunsApi(pk: number) {
  return requestClient.get<DataFlowRunResult[]>(`/api/v1/sys/data-flows/${pk}/runs`);
}

export async function getDataFlowRunDetailApi(runId: number) {
  return requestClient.get<DataFlowRunResult>(`/api/v1/sys/data-flows/runs/${runId}`);
}
