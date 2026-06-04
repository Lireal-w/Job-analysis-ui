
/** 岗位大屏数据分析 - 动态数据 */

import type { StatItem } from '#/api';

import {
  getCityApi,
  getEducationApi,
  getExperienceApi,
  getHotJobsApi,
  getIndustryApi,
  getJobTypeApi,
  getOverviewApi,
  getSalaryRangeApi,
  getTrendApi,
} from '#/api';

/** 获取概览统计 */
export async function fetchOverviewStats() {
  const data = await getOverviewApi();
  return {
    totalJobs: data.totalJobs ?? 0,
    todayNew: data.todayNew ?? 0,
    avgSalary: data.avgSalary ?? 0,
    totalCompanies: data.totalCompanies ?? 0,
  };
}

/** 获取岗位数量趋势数据 */
export async function fetchJobTrendData() {
  const data = await getTrendApi();
  return (data ?? []).map((item) => ({
    month: item.month,
    count: item.count ?? 0,
    avgSalary: item.avgSalary ?? 0,
  }));
}

/** 获取行业岗位分布数据 */
export async function fetchIndustryData() {
  const data = await getIndustryApi();
  return (data ?? []).map((item) => ({
    industry: item.industry,
    value: item.value ?? 0,
    percent: item.percent ?? 0,
  }));
}

/** 获取学历要求分布 */
export async function fetchEducationData() {
  const data = await getEducationApi();
  return normalizeStatData(data, 'education');
}

/** 获取热门岗位 TOP10 */
export async function fetchHotJobData() {
  const data = await getHotJobsApi();
  return (data ?? []).map((item) => ({
    name: item.name,
    count: item.count ?? 0,
    salary: item.salary ?? '',
  }));
}

/** 获取城市岗位数量分布 */
export async function fetchCityData() {
  const data = await getCityApi();
  return (data ?? []).map((item) => ({
    city: item.city,
    count: item.count ?? 0,
    avgSalary: item.avgSalary ?? 0,
  }));
}

/** 获取工作经验要求分布 */
export async function fetchExperienceData() {
  const data = await getExperienceApi();
  return normalizeStatData(data, 'experience');
}

/** 获取薪资区间分布 */
export async function fetchSalaryRangeData() {
  const data = await getSalaryRangeApi();
  return normalizeStatData(data, 'range');
}

/** 获取岗位类型分布 */
export async function fetchJobTypeData() {
  const data = await getJobTypeApi();
  return normalizeStatData(data, 'type');
}

/**
 * 统一归一化统计接口数据
 * 接口返回 [{name/type: "...", value: 0}]，需要映射到图表所需的字段名
 */
function normalizeStatData(
  data: StatItem[] | undefined,
  labelKey: string,
): any[] {
  return (data ?? []).map((item) => ({
    [labelKey]: item.name || item.type || '',
    value: item.value ?? 0,
  }));
}
