import type { PaginationResult } from '#/types';

import { requestClient } from './request';

/** 任务类型 */
export enum TaskType {
  /** 每日 */
  DAILY = 0,
  /** 周期 */
  PERIODIC = 1,
  /** 定时 */
  SCHEDULED = 2,
}

/** 任务状态 */
export enum TaskStatus {
  /** 待办 */
  PENDING = 0,
  /** 进行中 */
  IN_PROGRESS = 1,
  /** 已完成 */
  COMPLETED = 2,
  /** 已取消 */
  CANCELLED = 3,
}

/** 任务优先级 */
export enum TaskPriority {
  /** 低 */
  LOW = 0,
  /** 中 */
  MEDIUM = 1,
  /** 高 */
  HIGH = 2,
  /** 紧急 */
  URGENT = 3,
}

/** 任务来源 */
export enum TaskSource {
  /** 上级分配 */
  ASSIGNED = 0,
  /** 自己定制 */
  SELF = 1,
  /** AI生成 */
  AI = 2,
}

/** 目标状态 */
export enum GoalStatus {
  /** 待开始 */
  PENDING = 0,
  /** 进行中 */
  IN_PROGRESS = 1,
  /** 已完成 */
  COMPLETED = 2,
}

/** 任务查询参数 */
export interface TodoParams {
  task_type?: number;
  status?: number;
  priority?: number;
  source?: number;
  title?: string;
  page?: number;
  size?: number;
}

/** 创建任务参数 */
export interface CreateTodoParams {
  title: string;
  description?: string;
  task_type?: number;
  priority?: number;
  source?: number;
  assigned_to?: number;
  parent_id?: number;
  due_date?: string;
  start_date?: string;
  tags?: string[];
  sort_order?: number;
  remark?: string;
  cron_expr?: string;
  period_days?: number;
}

/** 更新任务参数 */
export interface UpdateTodoParams extends CreateTodoParams {}

/** 更新任务进度参数 */
export interface UpdateTodoProgressParams {
  progress: number;
}

/** 任务详情 */
export interface TodoResult {
  id: number;
  title: string;
  description?: string;
  task_type: number;
  priority: number;
  source: number;
  status: number;
  progress: number;
  assigned_to?: number;
  assigned_by?: number;
  parent_id?: number;
  due_date?: string;
  start_date?: string;
  tags?: string[];
  sort_order: number;
  remark?: string;
  cron_expr?: string;
  period_days?: number;
  completed_at?: string;
  created_by: number;
  updated_by?: number;
  created_time: string;
  updated_time?: string;
}

/** 创建目标参数 */
export interface CreateGoalParams {
  task_id: number;
  title: string;
  description?: string;
  stage_order?: number;
}

/** 更新目标参数 */
export interface UpdateGoalParams extends CreateGoalParams {}

/** 更新目标状态参数 */
export interface UpdateGoalStatusParams {
  status: number;
}

/** 目标详情 */
export interface GoalResult {
  id: number;
  task_id: number;
  title: string;
  description?: string;
  stage_order: number;
  status: number;
  completed_at?: string;
  ai_generated: boolean;
  created_by: number;
  created_time: string;
  updated_time?: string;
}

/** 任务详情(含目标) */
export interface TodoWithGoalsResult extends TodoResult {
  goals?: GoalResult[];
}

/**
 * 分页获取任务列表
 */
export async function getTodoListApi(params?: TodoParams) {
  return requestClient.get<PaginationResult<TodoResult>>('/api/v1/todos', {
    params,
  });
}

/**
 * 获取今日待完成任务
 */
export async function getTodayTodosApi() {
  return requestClient.get<TodoResult[]>('/api/v1/todos/today');
}

/**
 * 获取任务详情
 */
export async function getTodoApi(pk: number) {
  return requestClient.get<TodoResult>(`/api/v1/todos/${pk}`);
}

/**
 * 获取任务详情(含目标)
 */
export async function getTodoWithGoalsApi(pk: number) {
  return requestClient.get<TodoWithGoalsResult>(`/api/v1/todos/${pk}/with-goals`);
}

/**
 * 创建任务
 */
export async function createTodoApi(data: CreateTodoParams) {
  return requestClient.post<TodoResult>('/api/v1/todos', data);
}

/**
 * 更新任务
 */
export async function updateTodoApi(pk: number, data: UpdateTodoParams) {
  return requestClient.put(`/api/v1/todos/${pk}`, data);
}

/**
 * 更新任务状态
 */
export async function updateTodoStatusApi(pk: number, status: number) {
  return requestClient.put(`/api/v1/todos/${pk}/status`, null, {
    params: { status },
  });
}

/**
 * 更新任务进度
 */
export async function updateTodoProgressApi(
  pk: number,
  data: UpdateTodoProgressParams,
) {
  return requestClient.put(`/api/v1/todos/${pk}/progress`, data);
}

/**
 * 删除任务
 */
export async function deleteTodoApi(pk: number) {
  return requestClient.delete(`/api/v1/todos/${pk}`);
}

/**
 * 获取任务的所有目标
 */
export async function getGoalsByTaskApi(task_id: number) {
  return requestClient.get<GoalResult[]>(
    `/api/v1/todo-goals/by-task/${task_id}`,
  );
}

/**
 * 获取目标详情
 */
export async function getGoalApi(pk: number) {
  return requestClient.get<GoalResult>(`/api/v1/todo-goals/${pk}`);
}

/**
 * 创建目标
 */
export async function createGoalApi(data: CreateGoalParams) {
  return requestClient.post<GoalResult>('/api/v1/todo-goals', data);
}

/**
 * 更新目标
 */
export async function updateGoalApi(pk: number, data: UpdateGoalParams) {
  return requestClient.put(`/api/v1/todo-goals/${pk}`, data);
}

/**
 * 更新目标状态
 */
export async function updateGoalStatusApi(
  pk: number,
  data: UpdateGoalStatusParams,
) {
  return requestClient.put(`/api/v1/todo-goals/${pk}/status`, data);
}

/**
 * 删除目标
 */
export async function deleteGoalApi(pk: number) {
  return requestClient.delete(`/api/v1/todo-goals/${pk}`);
}

/**
 * AI自动生成阶段性目标
 */
export async function aiGenerateGoalsApi(task_id: number) {
  return requestClient.post<GoalResult[]>(
    `/api/v1/todo-goals/ai-generate/${task_id}`,
  );
}
