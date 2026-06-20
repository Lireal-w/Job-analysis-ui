import type { PaginationResult } from '#/types';
import { requestClient } from '#/api/request';

export interface AlertRuleResult {
  id: number;
  name: string;
  description: string | null;
  metric_type: string;
  condition: string;
  threshold: number;
  duration_seconds: number;
  severity: string;
  notify_channels: string[] | null;
  enabled: boolean;
  created_time: string;
  updated_time: string | null;
}

export interface AlertHistoryResult {
  id: number;
  rule_id: number;
  rule_name: string | null;
  metric_value: number | null;
  threshold: number | null;
  severity: string;
  status: string;
  message: string | null;
  fired_time: string;
  resolved_time: string | null;
  created_time: string;
}

export interface CreateAlertRuleParams {
  name: string;
  description?: string;
  metric_type: string;
  condition: string;
  threshold: number;
  duration_seconds?: number;
  severity?: string;
  notify_channels?: string[];
  enabled?: boolean;
}

export type UpdateAlertRuleParams = Partial<CreateAlertRuleParams>;

export interface AlertRuleParams {
  name?: string;
  metric_type?: string;
  severity?: string;
  enabled?: boolean;
  page?: number;
  size?: number;
}

export async function getAlertRuleListApi(params?: AlertRuleParams) {
  return requestClient.get<PaginationResult<AlertRuleResult>>('/api/v1/monitor/alerts/rules', { params });
}
export async function createAlertRuleApi(data: CreateAlertRuleParams) {
  return requestClient.post('/api/v1/monitor/alerts/rules', data);
}
export async function updateAlertRuleApi(pk: number, data: UpdateAlertRuleParams) {
  return requestClient.put(`/api/v1/monitor/alerts/rules/${pk}`, data);
}
export async function deleteAlertRuleApi(pks: number[]) {
  return requestClient.delete('/api/v1/monitor/alerts/rules', {
    params: { pks },
    paramsSerializer: 'repeat',
  });
}
export async function getAlertHistoryApi(params?: { rule_id?: number; severity?: string; status?: string; page?: number; size?: number }) {
  return requestClient.get<PaginationResult<AlertHistoryResult>>('/api/v1/monitor/alerts/history', { params });
}
export async function getAlertHistoryDetailApi(pk: number) {
  return requestClient.get<AlertHistoryResult>(`/api/v1/monitor/alerts/history/${pk}`);
}
