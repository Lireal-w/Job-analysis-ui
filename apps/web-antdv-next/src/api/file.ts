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
 * @returns 包含文件访问URL的结果
 */
export async function uploadFileApi(file: File) {
  return requestClient.upload<FileUploadResult>(
    '/api/v1/sys/files/upload',
    { file },
  );
}
