import type { PaginationResult } from '#/types';

import { requestClient } from '#/api/request';

export interface DatasourceResult {
  id: number;
  name: string;
  db_type: string;
  host: string;
  port: number;
  database_name: null | string;
  username: null | string;
  password: null | string;
  extra_params: null | string;
  description: null | string;
  status: number;
  created_time: string;
  updated_time: null | string;
}

export interface CreateDatasourceParams {
  name: string;
  db_type: string;
  host?: string;
  port?: number;
  database_name?: string;
  username?: string;
  password?: string;
  extra_params?: string;
  description?: string;
}

export type UpdateDatasourceParams = Partial<CreateDatasourceParams>;

export interface DatasourceTestParams {
  db_type: string;
  host: string;
  port: number;
  database_name?: string;
  username?: string;
  password?: string;
  extra_params?: string;
}

export interface DatasourceParams {
  name?: string;
  db_type?: string;
  page?: number;
  size?: number;
}

export async function getAllDatasourceApi() {
  return requestClient.get<DatasourceResult[]>('/api/v1/sys/datasource/all');
}

export async function getDatasourceListApi(params?: DatasourceParams) {
  return requestClient.get<PaginationResult<DatasourceResult>>(
    '/api/v1/sys/datasource',
    { params },
  );
}

export async function getDatasourceApi(pk: number) {
  return requestClient.get<DatasourceResult>(`/api/v1/sys/datasource/${pk}`);
}

export async function testDatasourceConnectionApi(data: DatasourceTestParams) {
  return requestClient.post<{ message: string; success: boolean }>(
    '/api/v1/sys/datasource/test-connection',
    data,
  );
}

export async function createDatasourceApi(data: CreateDatasourceParams) {
  return requestClient.post('/api/v1/sys/datasource', data);
}

export async function updateDatasourceApi(
  pk: number,
  data: UpdateDatasourceParams,
) {
  return requestClient.put(`/api/v1/sys/datasource/${pk}`, data);
}

export async function updateDatasourceStatusApi(pk: number, status: number) {
  return requestClient.put(`/api/v1/sys/datasource/${pk}/status`, undefined, {
    params: { status },
  });
}

export async function deleteDatasourceApi(pks: number[]) {
  return requestClient.delete('/api/v1/sys/datasource', { data: { pks } });
}
