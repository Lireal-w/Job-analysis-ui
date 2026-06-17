import type { PaginationResult } from '#/types';
import { requestClient } from '#/api/request';

export interface ResourcePermissionResult {
  id: number;
  name: string;
  resource_type: string;
  resource_id: number | null;
  resource_name: string | null;
  permission_type: string;
  role_id: number | null;
  description: string | null;
  enabled: boolean;
  created_time: string;
  updated_time: string | null;
}

export interface DataMaskingRuleResult {
  id: number;
  name: string;
  mask_type: string;
  target_table: string | null;
  target_field: string | null;
  mask_config: Record<string, any> | null;
  enabled: boolean;
  created_time: string;
  updated_time: string | null;
}

export interface CreateResourcePermissionParams {
  name: string;
  resource_type: string;
  resource_id?: number;
  resource_name?: string;
  permission_type: string;
  role_id?: number;
  description?: string;
  enabled?: boolean;
}

export type UpdateResourcePermissionParams = Partial<CreateResourcePermissionParams>;

export interface CreateDataMaskingRuleParams {
  name: string;
  mask_type: string;
  target_table?: string;
  target_field?: string;
  mask_config?: Record<string, any>;
  enabled?: boolean;
}

export type UpdateDataMaskingRuleParams = Partial<CreateDataMaskingRuleParams>;

export interface PermissionParams {
  name?: string;
  resource_type?: string;
  role_id?: number;
  page?: number;
  size?: number;
}

// Resource Permission APIs
export async function getAllResourcePermissionApi() {
  return requestClient.get<ResourcePermissionResult[]>('/api/v1/sys/data-permission/permissions/all');
}
export async function getResourcePermissionListApi(params?: PermissionParams) {
  return requestClient.get<PaginationResult<ResourcePermissionResult>>('/api/v1/sys/data-permission/permissions', { params });
}
export async function createResourcePermissionApi(data: CreateResourcePermissionParams) {
  return requestClient.post('/api/v1/sys/data-permission/permissions', data);
}
export async function updateResourcePermissionApi(pk: number, data: UpdateResourcePermissionParams) {
  return requestClient.put(`/api/v1/sys/data-permission/permissions/${pk}`, data);
}
export async function deleteResourcePermissionApi(pks: number[]) {
  return requestClient.delete('/api/v1/sys/data-permission/permissions', { data: { pks } });
}

// Data Masking Rule APIs
export async function getDataMaskingRuleListApi(params?: { name?: string; mask_type?: string; page?: number; size?: number }) {
  return requestClient.get<PaginationResult<DataMaskingRuleResult>>('/api/v1/sys/data-permission/masking-rules', { params });
}
export async function createDataMaskingRuleApi(data: CreateDataMaskingRuleParams) {
  return requestClient.post('/api/v1/sys/data-permission/masking-rules', data);
}
export async function updateDataMaskingRuleApi(pk: number, data: UpdateDataMaskingRuleParams) {
  return requestClient.put(`/api/v1/sys/data-permission/masking-rules/${pk}`, data);
}
export async function deleteDataMaskingRuleApi(pks: number[]) {
  return requestClient.delete('/api/v1/sys/data-permission/masking-rules', { data: { pks } });
}
