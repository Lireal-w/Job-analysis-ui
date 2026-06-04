
import { requestClient } from './request';

/** 概览统计 */
export interface OverviewStats {
  totalJobs: number;
  todayNew: number;
  avgSalary: number;
  totalCompanies: number;
}

/** 月度趋势 */
export interface TrendItem {
  month: string;
  count: number;
  avgSalary: number;
}

/** 行业分布 */
export interface IndustryItem {
  industry: string;
  value: number;
  percent: number;
}

/** 城市分布 */
export interface CityItem {
  city: string;
  count: number;
  avgSalary: number;
}

/** 热门岗位 */
export interface HotJobItem {
  name: string;
  count: number;
  salary: string;
}

/** 通用统计项（学历/经验/薪资/岗位类型） */
export interface StatItem {
  name: string;
  type: string;
  value: number;
}

/** 获取岗位概览统计 */
export async function getOverviewApi() {
  return requestClient.get<OverviewStats>(
    '/api/v1/jobs/mongo/job-dashboard/overview',
  );
}

/** 获取岗位数量趋势（按月） */
export async function getTrendApi() {
  return requestClient.get<TrendItem[]>(
    '/api/v1/jobs/mongo/job-dashboard/trend',
  );
}

/** 获取行业岗位分布 */
export async function getIndustryApi() {
  return requestClient.get<IndustryItem[]>(
    '/api/v1/jobs/mongo/job-dashboard/industry',
  );
}

/** 获取城市岗位分布 */
export async function getCityApi() {
  return requestClient.get<CityItem[]>(
    '/api/v1/jobs/mongo/job-dashboard/city',
  );
}

/** 获取热门岗位 TOP10 */
export async function getHotJobsApi() {
  return requestClient.get<HotJobItem[]>(
    '/api/v1/jobs/mongo/job-dashboard/hot-jobs',
  );
}

/** 获取学历分布 */
export async function getEducationApi() {
  return requestClient.get<StatItem[]>(
    '/api/v1/jobs/mongo/job-dashboard/education',
  );
}

/** 获取经验要求分布 */
export async function getExperienceApi() {
  return requestClient.get<StatItem[]>(
    '/api/v1/jobs/mongo/job-dashboard/experience',
  );
}

/** 获取薪资区间分布 */
export async function getSalaryRangeApi() {
  return requestClient.get<StatItem[]>(
    '/api/v1/jobs/mongo/job-dashboard/salary-range',
  );
}

/** 获取岗位类型分布 */
export async function getJobTypeApi() {
  return requestClient.get<StatItem[]>(
    '/api/v1/jobs/mongo/job-dashboard/job-type',
  );
}
