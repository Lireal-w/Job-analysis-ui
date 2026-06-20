import type { PaginationResult } from '#/types';
import { requestClient } from '#/api/request';

export interface AuditLogResult {
  id: number;
  event_type: string;
  action: string;
  resource_type: string | null;
  resource_id: number | null;
  resource_name: string | null;
  user_id: number | null;
  username: string | null;
  ip: string | null;
  user_agent: string | null;
  request_method: string | null;
  request_path: string | null;
  response_code: number | null;
  status: number;
  created_time: string;
}

export interface AuditLogParams {
  event_type?: string;
  username?: string;
  ip?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  size?: number;
}

export async function getAuditLogListApi(params?: AuditLogParams) {
  return requestClient.get<PaginationResult<AuditLogResult>>('/api/v1/log/audit-logs', { params });
}
export async function getAuditLogDetailApi(pk: number) {
  return requestClient.get<AuditLogResult>(`/api/v1/log/audit-logs/${pk}`);
}
export async function deleteAuditLogApi(pks: number[]) {
  return requestClient.delete('/api/v1/log/audit-logs', {
    params: { pks },
    paramsSerializer: 'repeat',
  });
}
export async function clearAuditLogApi() {
  return requestClient.delete('/api/v1/log/audit-logs/all');
}
