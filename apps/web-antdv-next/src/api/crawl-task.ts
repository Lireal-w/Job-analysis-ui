import type { PaginationResult } from '#/types';

import { requestClient } from '#/api/request';

export interface CrawlTaskResult {
  id: number;
  name: string;
  description: null | string;
  source_datasource_id: number;
  source_config: Record<string, any>;
  target_storage: string;
  target_datasource_id: null | number;
  target_config: null | Record<string, any>;
  crawl_mode: string;
  incremental_key: null | string;
  incremental_start: null | string;
  schedule_type: string;
  cron_expr: null | string;
  interval_seconds: null | number;
  concurrency: number;
  batch_size: number;
  rate_limit: number;
  retry_enabled: boolean;
  max_retries: number;
  retry_delay: number;
  retry_backoff: boolean;
  status: string;
  priority: number;
  enabled: boolean;
  total_run_count: number;
  total_records: number;
  last_run_time: null | string;
  last_duration: null | number;
  last_status: null | string;
  tags: null | string;
  created_by: null | number;
  created_time: string;
  updated_time: null | string;
}

export interface CreateCrawlTaskParams {
  name: string;
  description?: string;
  source_datasource_id: number;
  source_config?: Record<string, any>;
  target_storage: string;
  target_datasource_id?: number;
  target_config?: Record<string, any>;
  crawl_mode?: string;
  incremental_key?: string;
  incremental_start?: string;
  schedule_type?: string;
  cron_expr?: string;
  interval_seconds?: number;
  concurrency?: number;
  batch_size?: number;
  rate_limit?: number;
  retry_enabled?: boolean;
  max_retries?: number;
  retry_delay?: number;
  retry_backoff?: boolean;
  priority?: number;
  tags?: string;
}

export interface CrawlTaskLogResult {
  id: number;
  task_id: number;
  run_id: string;
  status: string;
  start_time: string;
  end_time: null | string;
  duration: null | number;
  total_found: number;
  total_scraped: number;
  total_succeeded: number;
  total_failed: number;
  total_skipped: number;
  avg_response_time: null | number;
  throughput: null | number;
  memory_usage: null | number;
  cpu_usage: null | number;
  error_message: null | string;
  created_time: string;
}

export interface CrawlTaskParams {
  name?: string;
  status?: string;
  crawl_mode?: string;
  schedule_type?: string;
  source_datasource_id?: number;
  page?: number;
  size?: number;
}

export interface CrawlTaskDashboard {
  total_tasks: number;
  active_tasks: number;
  completed_tasks: number;
  failed_tasks: number;
  total_records: number;
}

export async function getCrawlTaskDashboardApi() {
  return requestClient.get<CrawlTaskDashboard>(
    '/api/v1/sys/crawl-tasks/dashboard',
  );
}

export async function getAllCrawlTaskApi() {
  return requestClient.get<CrawlTaskResult[]>('/api/v1/sys/crawl-tasks/all');
}

export async function getCrawlTaskListApi(params?: CrawlTaskParams) {
  return requestClient.get<PaginationResult<CrawlTaskResult>>(
    '/api/v1/sys/crawl-tasks',
    { params },
  );
}

export async function getCrawlTaskApi(pk: number) {
  return requestClient.get<CrawlTaskResult>(`/api/v1/sys/crawl-tasks/${pk}`);
}

export async function createCrawlTaskApi(data: CreateCrawlTaskParams) {
  return requestClient.post('/api/v1/sys/crawl-tasks', data);
}

export async function updateCrawlTaskApi(
  pk: number,
  data: CreateCrawlTaskParams,
) {
  return requestClient.put(`/api/v1/sys/crawl-tasks/${pk}`, data);
}

export async function updateCrawlTaskStatusApi(pk: number, status: string) {
  return requestClient.put(`/api/v1/sys/crawl-tasks/${pk}/status`, { status });
}

export async function deleteCrawlTaskApi(pks: number[]) {
  return requestClient.delete('/api/v1/sys/crawl-tasks', { data: { pks } });
}

export async function startCrawlTaskApi(pk: number) {
  return requestClient.post(`/api/v1/sys/crawl-tasks/${pk}/start`);
}

export async function stopCrawlTaskApi(pk: number) {
  return requestClient.post(`/api/v1/sys/crawl-tasks/${pk}/stop`);
}

export async function triggerCrawlTaskApi(pk: number) {
  return requestClient.post(`/api/v1/sys/crawl-tasks/${pk}/trigger`);
}

export async function getCrawlTaskLogsApi(pk: number, limit?: number) {
  return requestClient.get<CrawlTaskLogResult[]>(
    `/api/v1/sys/crawl-tasks/${pk}/logs`,
    { params: { limit } },
  );
}

export async function getCrawlTaskLogDetailApi(logId: number) {
  return requestClient.get<CrawlTaskLogResult>(
    `/api/v1/sys/crawl-tasks/logs/${logId}`,
  );
}
