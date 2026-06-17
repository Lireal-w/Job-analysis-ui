import type { PaginationResult } from '#/types';
import { requestClient } from '#/api/request';

export interface QualityRuleResult {
  id: number;
  name: string;
  description: string | null;
  rule_type: string;
  target_table: string | null;
  target_field: string | null;
  rule_config: Record<string, any> | null;
  severity: string;
  enabled: boolean;
  status: number;
  created_by: number | null;
  created_time: string;
  updated_time: string | null;
}

export interface QualityCheckResult {
  id: number;
  rule_id: number;
  run_id: string;
  status: string;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  total_checked: number;
  total_passed: number;
  total_failed: number;
  score: number | null;
  error_message: string | null;
  created_time: string;
}

export interface CreateQualityRuleParams {
  name: string;
  description?: string;
  rule_type: string;
  target_table?: string;
  target_field?: string;
  rule_config?: Record<string, any>;
  severity?: string;
  enabled?: boolean;
}

export type UpdateQualityRuleParams = Partial<CreateQualityRuleParams>;

export interface QualityRuleParams {
  name?: string;
  rule_type?: string;
  severity?: string;
  enabled?: boolean;
  page?: number;
  size?: number;
}

export async function getAllQualityRuleApi() {
  return requestClient.get<QualityRuleResult[]>('/api/v1/sys/data-quality/rules/all');
}

export async function getQualityRuleListApi(params?: QualityRuleParams) {
  return requestClient.get<PaginationResult<QualityRuleResult>>('/api/v1/sys/data-quality/rules', { params });
}

export async function getQualityRuleApi(pk: number) {
  return requestClient.get<QualityRuleResult>(`/api/v1/sys/data-quality/rules/${pk}`);
}

export async function createQualityRuleApi(data: CreateQualityRuleParams) {
  return requestClient.post('/api/v1/sys/data-quality/rules', data);
}

export async function updateQualityRuleApi(pk: number, data: UpdateQualityRuleParams) {
  return requestClient.put(`/api/v1/sys/data-quality/rules/${pk}`, data);
}

export async function deleteQualityRuleApi(pks: number[]) {
  return requestClient.delete('/api/v1/sys/data-quality/rules', { data: { pks } });
}

export async function runQualityCheckApi(pk: number) {
  return requestClient.post(`/api/v1/sys/data-quality/rules/${pk}/check`);
}

export async function getQualityChecksApi(pk: number) {
  return requestClient.get<QualityCheckResult[]>(`/api/v1/sys/data-quality/rules/${pk}/checks`);
}

export async function getQualityCheckDetailApi(checkId: number) {
  return requestClient.get<QualityCheckResult>(`/api/v1/sys/data-quality/checks/${checkId}`);
}
