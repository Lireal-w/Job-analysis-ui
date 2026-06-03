
/** 岗位大屏数据分析 - 静态数据 */

/** 岗位数量趋势数据 */
export const jobTrendData = [
  { month: '2025-07', count: 12500, avgSalary: 13500 },
  { month: '2025-08', count: 13200, avgSalary: 13800 },
  { month: '2025-09', count: 14800, avgSalary: 13600 },
  { month: '2025-10', count: 13900, avgSalary: 14200 },
  { month: '2025-11', count: 15600, avgSalary: 14500 },
  { month: '2025-12', count: 16200, avgSalary: 14800 },
  { month: '2026-01', count: 11800, avgSalary: 15000 },
  { month: '2026-02', count: 13500, avgSalary: 15200 },
  { month: '2026-03', count: 18900, avgSalary: 14800 },
  { month: '2026-04', count: 21000, avgSalary: 15500 },
  { month: '2026-05', count: 22500, avgSalary: 15800 },
  { month: '2026-06', count: 23800, avgSalary: 16200 },
];

/** 行业岗位分布数据 */
export const industryData = [
  { industry: '互联网/IT', value: 35200, percent: 28.5 },
  { industry: '金融', value: 18600, percent: 15.1 },
  { industry: '制造业', value: 15200, percent: 12.3 },
  { industry: '教育', value: 12800, percent: 10.4 },
  { industry: '医疗健康', value: 10500, percent: 8.5 },
  { industry: '房地产', value: 8900, percent: 7.2 },
  { industry: '电商/零售', value: 7800, percent: 6.3 },
  { industry: '物流运输', value: 5600, percent: 4.5 },
  { industry: '文化传媒', value: 4200, percent: 3.4 },
  { industry: '其他', value: 4200, percent: 3.8 },
];

/** 岗位学历要求分布 */
export const educationData = [
  { education: '不限', value: 18500 },
  { education: '大专', value: 28200 },
  { education: '本科', value: 52000 },
  { education: '硕士', value: 18600 },
  { education: '博士', value: 3200 },
];

/** 热门岗位 TOP10 */
export const hotJobData = [
  { name: 'Java开发工程师', count: 8600, salary: '15K-30K' },
  { name: '前端开发工程师', count: 7200, salary: '12K-25K' },
  { name: '产品经理', count: 6500, salary: '15K-35K' },
  { name: 'Python开发工程师', count: 5800, salary: '15K-30K' },
  { name: '数据分析师', count: 5200, salary: '12K-25K' },
  { name: 'UI设计师', count: 4800, salary: '10K-20K' },
  { name: '运营经理', count: 4500, salary: '12K-25K' },
  { name: '测试工程师', count: 4200, salary: '10K-20K' },
  { name: '算法工程师', count: 3800, salary: '25K-50K' },
  { name: 'DevOps工程师', count: 3500, salary: '18K-35K' },
];

/** 城市岗位数量分布 */
export const cityData = [
  { city: '上海', count: 28500, avgSalary: 16800 },
  { city: '北京', count: 26200, avgSalary: 17500 },
  { city: '深圳', count: 21800, avgSalary: 16200 },
  { city: '广州', count: 16500, avgSalary: 13500 },
  { city: '杭州', count: 15200, avgSalary: 15800 },
  { city: '成都', count: 12600, avgSalary: 12500 },
  { city: '武汉', count: 9800, avgSalary: 11800 },
  { city: '南京', count: 8900, avgSalary: 13200 },
  { city: '苏州', count: 7600, avgSalary: 12800 },
  { city: '西安', count: 6500, avgSalary: 11000 },
  { city: '长沙', count: 5800, avgSalary: 10500 },
  { city: '重庆', count: 5200, avgSalary: 10800 },
];

/** 工作经验要求分布 */
export const experienceData = [
  { experience: '不限', value: 22000 },
  { experience: '1-3年', value: 35000 },
  { experience: '3-5年', value: 32000 },
  { experience: '5-10年', value: 25000 },
  { experience: '10年以上', value: 5800 },
];

/** 薪资区间分布 */
export const salaryRangeData = [
  { range: '3K以下', value: 5200 },
  { range: '3K-5K', value: 12800 },
  { range: '5K-8K', value: 22500 },
  { range: '8K-12K', value: 28600 },
  { range: '12K-18K', value: 25200 },
  { range: '18K-25K', value: 18500 },
  { range: '25K-40K', value: 12800 },
  { range: '40K以上', value: 5600 },
];

/** 岗位类型分布 */
export const jobTypeData = [
  { type: '全职', value: 89000 },
  { type: '兼职', value: 12500 },
  { type: '实习', value: 18000 },
  { type: '远程', value: 8500 },
];

/** 概览统计 */
export const overviewStats = {
  totalJobs: 128000,
  todayNew: 2350,
  avgSalary: 15200,
  totalCompanies: 6800,
};
