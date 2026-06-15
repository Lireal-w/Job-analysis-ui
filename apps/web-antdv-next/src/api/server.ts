import type { PaginationResult } from '#/types';

/** 连接协议 */
export enum ServerProtocol {
  SSH = 'ssh',
  RDP = 'rdp',
  VNC = 'vnc',
  TELNET = 'telnet',
  SFTP = 'sftp',
  HTTP = 'http',
  HTTPS = 'https',
}

export const SERVER_PROTOCOL_OPTIONS = [
  { label: 'SSH', value: 'ssh', color: 'blue', port: 22 },
  { label: 'RDP', value: 'rdp', color: 'purple', port: 3389 },
  { label: 'VNC', value: 'vnc', color: 'orange', port: 5900 },
  { label: 'Telnet', value: 'telnet', color: 'cyan', port: 23 },
  { label: 'SFTP', value: 'sftp', color: 'green', port: 22 },
  { label: 'HTTP', value: 'http', color: 'default', port: 80 },
  { label: 'HTTPS', value: 'https', color: 'default', port: 443 },
];

export interface ServerParams {
  name?: string;
  protocol?: string;
  ip?: string;
  page?: number;
  size?: number;
}

export interface ServerResult {
  id: number;
  name: string;
  protocol: string;
  ip: string;
  port: number;
  username: string;
  password?: string;
  status: number;
  remark?: string;
  created_time: string;
  updated_time?: string;
}

export interface CreateServerParams {
  name: string;
  protocol: string;
  ip: string;
  port: number;
  username: string;
  password?: string;
  remark?: string;
}

export interface UpdateServerParams extends CreateServerParams {}

/** 模拟静态数据 */
let mockIdCounter = 8;
const mockServers: ServerResult[] = [
  {
    id: 1,
    name: '生产环境 Web 服务器',
    protocol: 'ssh',
    ip: '192.168.1.100',
    port: 22,
    username: 'root',
    status: 1,
    remark: '主站生产环境',
    created_time: '2025-01-15 10:00:00',
    updated_time: '2025-06-10 14:30:00',
  },
  {
    id: 2,
    name: '测试环境数据库',
    protocol: 'ssh',
    ip: '192.168.1.200',
    port: 22,
    username: 'admin',
    status: 1,
    remark: 'MySQL 数据库服务器',
    created_time: '2025-02-20 09:00:00',
    updated_time: '2025-06-12 11:00:00',
  },
  {
    id: 3,
    name: 'Windows 远程桌面',
    protocol: 'rdp',
    ip: '10.0.0.50',
    port: 3389,
    username: 'administrator',
    status: 0,
    remark: '运维跳板机',
    created_time: '2025-03-05 16:00:00',
    updated_time: '2025-06-01 08:00:00',
  },
  {
    id: 4,
    name: '开发环境 VNC',
    protocol: 'vnc',
    ip: '192.168.1.150',
    port: 5900,
    username: 'devuser',
    status: 1,
    remark: '开发用图形界面服务器',
    created_time: '2025-04-10 13:00:00',
  },
  {
    id: 5,
    name: '监控系统',
    protocol: 'https',
    ip: '192.168.1.250',
    port: 443,
    username: 'monitor',
    status: 1,
    remark: 'Zabbix 监控面板',
    created_time: '2025-05-01 08:30:00',
    updated_time: '2025-06-13 09:00:00',
  },
  {
    id: 6,
    name: '文件传输服务',
    protocol: 'sftp',
    ip: '192.168.2.10',
    port: 22,
    username: 'ftpuser',
    status: 0,
    remark: '内部文件服务器',
    created_time: '2025-05-20 10:00:00',
  },
  {
    id: 7,
    name: '备用网关',
    protocol: 'ssh',
    ip: '192.168.3.1',
    port: 2222,
    username: 'root',
    status: 1,
    remark: 'VPN 备用入口',
    created_time: '2025-06-01 15:00:00',
    updated_time: '2025-06-14 12:00:00',
  },
];

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 分页获取服务器列表
 */
export async function getServerListApi(params?: ServerParams) {
  await delay();
  let filtered = [...mockServers];
  if (params?.name) {
    filtered = filtered.filter((s) => s.name.includes(params.name!));
  }
  if (params?.protocol) {
    filtered = filtered.filter((s) => s.protocol === params.protocol);
  }
  if (params?.ip) {
    filtered = filtered.filter((s) => s.ip.includes(params.ip!));
  }
  const page = params?.page || 1;
  const size = params?.size || 20;
  const start = (page - 1) * size;
  const items = filtered.slice(start, start + size);
  return {
    items,
    page,
    size,
    total: filtered.length,
    total_pages: Math.ceil(filtered.length / size),
    links: { first: '', last: '', self: '' },
  } as PaginationResult<ServerResult>;
}

/**
 * 获取服务器详情
 */
export async function getServerApi(pk: number) {
  await delay();
  const server = mockServers.find((s) => s.id === pk);
  if (!server) throw new Error('服务器不存在');
  return server;
}

/**
 * 创建服务器
 */
export async function createServerApi(data: CreateServerParams) {
  await delay();
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const newServer: ServerResult = {
    id: ++mockIdCounter,
    ...data,
    status: 1,
    created_time: now,
  };
  mockServers.push(newServer);
  return newServer;
}

/**
 * 更新服务器
 */
export async function updateServerApi(pk: number, data: UpdateServerParams) {
  await delay();
  const idx = mockServers.findIndex((s) => s.id === pk);
  if (idx === -1) throw new Error('服务器不存在');
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  mockServers[idx] = { ...mockServers[idx], ...data, updated_time: now };
  return mockServers[idx];
}

/**
 * 删除服务器
 */
export async function deleteServerApi(pk: number) {
  await delay();
  const idx = mockServers.findIndex((s) => s.id === pk);
  if (idx !== -1) mockServers.splice(idx, 1);
}

/**
 * 测试连接
 */
export async function testServerConnectionApi(data: {
  protocol: string;
  ip: string;
  port: number;
  username: string;
  password?: string;
}) {
  await delay(1500);
  // 模拟测试：IP 为 192.168.1.250 时模拟失败
  if (data.ip === '192.168.1.250') {
    return { success: false, message: '连接超时，目标主机无响应' };
  }
  return { success: true, message: '连接成功！' };
}
