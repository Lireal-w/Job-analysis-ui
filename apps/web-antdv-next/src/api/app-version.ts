import type { PaginationResult } from '#/types';

import { requestClient } from '#/api/request';

/**
 * 平台类型
 */
export enum PlatformType {
  IOS = 'ios',
  ANDROID = 'android',
}

/**
 * 发布状态
 */
export enum PublishStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/**
 * App 版本管理 - 查询结果
 */
export interface AppVersionResult {
  id: number;
  app_name: string;
  bundle_id: string;
  platform: PlatformType;
  version_name: string;
  version_code: number;
  changelog: string;
  download_url: string;
  apk_file_path: string;
  apk_file_size: number;
  apk_md5: string;
  min_version_code: number;
  force_update: boolean;
  publish_status: PublishStatus;
  download_count: number;
  remark: string;
  created_time: string;
  updated_time: string;
}

/**
 * App 版本管理 - 创建参数
 */
export interface CreateAppVersionParams {
  app_name: string;
  bundle_id: string;
  platform: PlatformType;
  version_name: string;
  version_code: number;
  changelog?: string;
  download_url?: string;
  apk_file_path?: string;
  apk_file_size?: number;
  apk_md5?: string;
  min_version_code?: number;
  force_update?: boolean;
  publish_status?: PublishStatus;
  remark?: string;
}

/**
 * App 版本管理 - 更新参数
 */
export type UpdateAppVersionParams = Partial<CreateAppVersionParams>;

/**
 * App 版本管理 - 查询参数
 */
export interface AppVersionParams {
  app_name?: string;
  platform?: PlatformType;
  publish_status?: PublishStatus;
  page?: number;
  size?: number;
}

/**
 * 分页获取版本列表
 */
export async function getAppVersionListApi(params?: AppVersionParams) {
  return requestClient.get<PaginationResult<AppVersionResult>>(
    '/api/v1/mobile/versions',
    { params },
  );
}

/**
 * 获取所有版本
 */
export async function getAllAppVersionApi() {
  return requestClient.get<AppVersionResult[]>('/api/v1/mobile/versions/all');
}

/**
 * 获取版本详情
 */
export async function getAppVersionApi(pk: number) {
  return requestClient.get<AppVersionResult>(
    `/api/v1/mobile/versions/${pk}`,
  );
}

/**
 * 获取最新版本信息
 */
export async function getLatestAppVersionApi() {
  return requestClient.get<AppVersionResult>(
    '/api/v1/mobile/versions/latest',
  );
}

/**
 * 创建版本
 */
export async function createAppVersionApi(data: CreateAppVersionParams) {
  return requestClient.post('/api/v1/mobile/versions', data);
}

/**
 * 更新版本
 */
export async function updateAppVersionApi(
  pk: number,
  data: UpdateAppVersionParams,
) {
  return requestClient.put(`/api/v1/mobile/versions/${pk}`, data);
}

/**
 * 批量删除版本
 */
export async function deleteAppVersionApi(pks: number[]) {
  return requestClient.delete('/api/v1/mobile/versions', { data: { pks } });
}

/**
 * 更新版本状态
 */
export async function updateAppVersionStatusApi(
  pk: number,
  status: PublishStatus,
) {
  return requestClient.put(`/api/v1/mobile/versions/${pk}/status`, {
    publish_status: status,
  });
}
