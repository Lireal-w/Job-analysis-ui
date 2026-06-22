import { requestClient } from '#/api/request';

/**
 * 文件上传返回的结果
 */
export interface FileUploadResult {
  url: string;
}

/**
 * 上传文件到服务器
 * @param file 要上传的文件
 * @param timeout 超时时间(毫秒)，默认 120 秒
 * @returns 包含文件访问URL的结果
 */
export async function uploadFileApi(file: File, timeout = 120_000) {
  return requestClient.upload<FileUploadResult>(
    '/api/v1/sys/files/upload',
    { file },
    { timeout },
  );
}
