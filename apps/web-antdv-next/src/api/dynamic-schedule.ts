import { requestClient } from '#/api/request';

/** 动态调度结果 */
export interface DynamicScheduleResult {
  name: string;
  task: string;
  type: number;
  interval_every: number | null;
  interval_period: string | null;
  crontab: string | null;
  args: any;
  kwargs: any;
  options: Record<string, any> | null;
  enabled: boolean;
  total_run_count: number;
  last_run_at: string | null;
}

/** 创建动态调度参数 */
export interface CreateDynamicScheduleParams {
  name: string;
  task: string;
  type: number;
  interval_every?: number | null;
  interval_period?: string | null;
  crontab?: string | null;
  args?: any;
  kwargs?: any;
  options?: Record<string, any> | null;
  enabled?: boolean;
}

/** 更新动态调度参数 */
export interface UpdateDynamicScheduleParams {
  task?: string;
  type?: number;
  interval_every?: number | null;
  interval_period?: string | null;
  crontab?: string | null;
  args?: any;
  kwargs?: any;
  options?: Record<string, any> | null;
  enabled?: boolean;
}

/**
 * 获取所有动态调度
 * @param prefix 名称前缀筛选
 */
export async function getAllDynamicScheduleApi(prefix?: string) {
  return requestClient.get<DynamicScheduleResult[]>(
    '/api/v1/dynamic-schedules/all',
    { params: prefix ? { prefix } : {} },
  );
}

/**
 * 获取动态调度详情（按名称）
 * @param name 调度名称（字符串主键）
 */
export async function getDynamicScheduleApi(name: string) {
  return requestClient.get<DynamicScheduleResult>(
    `/api/v1/dynamic-schedules/${name}`,
  );
}

/**
 * 创建动态调度
 */
export async function createDynamicScheduleApi(
  data: CreateDynamicScheduleParams,
) {
  return requestClient.post('/api/v1/dynamic-schedules', data);
}

/**
 * 更新动态调度（按名称）
 * @param name 调度名称（字符串主键）
 */
export async function updateDynamicScheduleApi(
  name: string,
  data: UpdateDynamicScheduleParams,
) {
  return requestClient.put(`/api/v1/dynamic-schedules/${name}`, data);
}

/**
 * 删除动态调度（按名称）
 * @param name 调度名称（字符串主键）
 */
export async function deleteDynamicScheduleApi(name: string) {
  return requestClient.delete(`/api/v1/dynamic-schedules/${name}`);
}

/**
 * 启用/禁用动态调度
 * @param name 调度名称
 * @param enabled true=启用 false=禁用
 */
export async function toggleDynamicScheduleApi(
  name: string,
  enabled: boolean,
) {
  return requestClient.put(
    `/api/v1/dynamic-schedules/${name}/toggle?enabled=${enabled}`,
  );
}
