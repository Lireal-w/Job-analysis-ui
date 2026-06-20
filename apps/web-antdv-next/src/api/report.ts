import type { PaginationResult } from '#/types';
import { requestClient } from '#/api/request';

export interface ReportResult {
  id: number;
  name: string;
  description: string | null;
  layout: Record<string, any>[] | null;
  theme: string;
  refresh_interval: number | null;
  is_public: boolean;
  status: number;
  created_by: number | null;
  created_time: string;
  updated_time: string | null;
}

export interface ReportWidgetResult {
  id: number;
  report_id: number;
  widget_type: string;
  title: string | null;
  query_id: number | null;
  query_sql: string | null;
  config: Record<string, any> | null;
  position: Record<string, any> | null;
  sort: number;
  created_time: string;
  updated_time: string | null;
}

export interface CreateReportParams {
  name: string;
  description?: string;
  layout?: Record<string, any>[];
  theme?: string;
  refresh_interval?: number;
  is_public?: boolean;
}

export type UpdateReportParams = Partial<CreateReportParams>;

export interface CreateReportWidgetParams {
  widget_type: string;
  title?: string;
  report_id: number;
  query_id?: number;
  query_sql?: string;
  config?: Record<string, any>;
  position?: Record<string, any>;
  sort?: number;
}

export type UpdateReportWidgetParams = Partial<CreateReportWidgetParams>;

export interface ReportParams {
  name?: string;
  status?: number;
  is_public?: boolean;
  page?: number;
  size?: number;
}

export async function getAllReportApi() {
  return requestClient.get<ReportResult[]>('/api/v1/sys/reports/all');
}

export async function getReportListApi(params?: ReportParams) {
  return requestClient.get<PaginationResult<ReportResult>>('/api/v1/sys/reports', { params });
}

export async function getReportApi(pk: number) {
  return requestClient.get<ReportResult>(`/api/v1/sys/reports/${pk}`);
}

export async function createReportApi(data: CreateReportParams) {
  return requestClient.post('/api/v1/sys/reports', data);
}

export async function updateReportApi(pk: number, data: UpdateReportParams) {
  return requestClient.put(`/api/v1/sys/reports/${pk}`, data);
}

export async function deleteReportApi(pks: number[]) {
  return requestClient.delete('/api/v1/sys/reports', { data: { pks } });
}

export async function previewReportApi(pk: number) {
  return requestClient.get<any>(`/api/v1/sys/reports/${pk}/preview`);
}

export async function getReportWidgetsApi(pk: number) {
  return requestClient.get<ReportWidgetResult[]>(`/api/v1/sys/reports/${pk}/widgets`);
}

export async function createReportWidgetApi(pk: number, data: CreateReportWidgetParams) {
  return requestClient.post(`/api/v1/sys/reports/${pk}/widgets`, {
    ...data,
    report_id: pk,
  });
}

export async function updateReportWidgetApi(widgetId: number, data: UpdateReportWidgetParams) {
  return requestClient.put(`/api/v1/sys/reports/widgets/${widgetId}`, data);
}

export async function deleteReportWidgetApi(widgetId: number) {
  return requestClient.delete(`/api/v1/sys/reports/widgets/${widgetId}`);
}
