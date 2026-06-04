<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';
import { usePreferences } from '@vben/preferences';

import {
  fetchCityData,
  fetchEducationData,
  fetchExperienceData,
  fetchHotJobData,
  fetchIndustryData,
  fetchJobTrendData,
  fetchJobTypeData,
  fetchOverviewStats,
  fetchSalaryRangeData,
} from './data';

const { isDark } = usePreferences();

/** 响应式数据 */
const overviewStats = ref({ totalJobs: 0, todayNew: 0, avgSalary: 0, totalCompanies: 0 });
const jobTrendData = ref<any[]>([]);
const industryData = ref<any[]>([]);
const educationData = ref<any[]>([]);
const hotJobData = ref<any[]>([]);
const cityData = ref<any[]>([]);
const experienceData = ref<any[]>([]);
const salaryRangeData = ref<any[]>([]);
const jobTypeData = ref<any[]>([]);

/** 数据加载状态 */
const loading = ref(true);

/** 主题色配置 */
const themeColors = computed(() => {
  const dark = isDark.value;
  return {
    cardBg: dark ? '#1f1f1f' : '#ffffff',
    cardBorder: dark ? '#333333' : '#e5e7eb',
    titleColor: dark ? '#e5eaf0' : '#374151',
    subtitleColor: dark ? '#9ca3af' : '#6b7280',
    axisLineColor: dark ? '#444444' : '#e5e7eb',
    axisLabelColor: dark ? '#9ca3af' : '#6b7280',
    gridLineColor: dark ? '#333333' : '#f0f0f0',
    splitAreaColor: dark ? '#2a2a2a' : '#fafafa',
    strokeColor: dark ? '#333333' : '#ffffff',
    labelColor: dark ? '#9ca3af' : '#6b7280',
    dashboardBg: dark ? '#141414' : '#f5f7fa',
  };
});

/** 数字滚动动画 - 使用独立 ref 避免模板中 [object Object] 问题 */
const totalJobsValue = ref(0);
const todayNewValue = ref(0);
const avgSalaryValue = ref(0);
const totalCompaniesValue = ref(0);

/** 异步加载所有数据 */
async function loadAllData() {
  loading.value = true;
  try {
    const [
      overview,
      trend,
      industry,
      education,
      hotJobs,
      city,
      experience,
      salaryRange,
      jobType,
    ] = await Promise.all([
      fetchOverviewStats(),
      fetchJobTrendData(),
      fetchIndustryData(),
      fetchEducationData(),
      fetchHotJobData(),
      fetchCityData(),
      fetchExperienceData(),
      fetchSalaryRangeData(),
      fetchJobTypeData(),
    ]);

    overviewStats.value = overview;
    jobTrendData.value = trend;
    industryData.value = industry;
    educationData.value = education;
    hotJobData.value = hotJobs;
    cityData.value = city;
    experienceData.value = experience;
    salaryRangeData.value = salaryRange;
    jobTypeData.value = jobType;
  } catch (error) {
    console.error('加载大屏数据失败:', error);
  } finally {
    loading.value = false;
  }
}

function startNumberAnimation(
  target: number,
  displayRef: { value: number },
  duration = 1500,
) {
  const startTime = performance.now();
  const animate = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    displayRef.value = Math.round(target * eased);
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  requestAnimationFrame(animate);
}

/** 图表实例引用 */
const trendChartRef = ref<HTMLDivElement>();
const industryChartRef = ref<HTMLDivElement>();
const educationChartRef = ref<HTMLDivElement>();
const hotJobChartRef = ref<HTMLDivElement>();
const cityChartRef = ref<HTMLDivElement>();
const experienceChartRef = ref<HTMLDivElement>();
const salaryChartRef = ref<HTMLDivElement>();
const jobTypeChartRef = ref<HTMLDivElement>();

let chartInstances: any[] = [];

/** 获取通用轴样式 */
function getAxisStyle(title?: string, titleFill?: string) {
  const tc = themeColors.value;
  return {
    line: { stroke: tc.axisLineColor },
    tick: { stroke: tc.axisLineColor },
    label: { fill: tc.axisLabelColor, fontSize: 11 },
    title: title
      ? { fill: titleFill || tc.axisLabelColor, fontSize: 12 }
      : undefined,
    grid: { stroke: tc.gridLineColor, lineWidth: 0.5 },
    splitArea: tc.splitAreaColor ? { fill: tc.splitAreaColor } : undefined,
  };
}

/** 渲染所有图表 */
async function renderCharts() {
  chartInstances.forEach((chart) => chart.destroy());
  chartInstances = [];

  const { Chart } = await import('@antv/g2');
  const tc = themeColors.value;

  const commonTheme = {
    view: { viewFill: tc.cardBg },
  };

  // 岗位数量趋势 - 双轴图
  const trendChart = new Chart({
    container: trendChartRef.value!,
    autoFit: true,
    theme: commonTheme,
  });
  trendChart
    .data(jobTrendData.value)
    .interaction({ tooltip: { shared: true } });

  trendChart
    .interval()
    .encode('x', 'month')
    .encode('y', 'count')
    .encode('color', '#4e79a7')
    .axis('x', getAxisStyle())
    .axis('y', getAxisStyle('岗位数量', '#4e79a7'))
    .style('fillOpacity', 0.85)
    .tooltip({ channel: 'y', valueFormatter: (d: number) => `${d.toLocaleString()} 个` });

  trendChart
    .line()
    .encode('x', 'month')
    .encode('y', 'avgSalary')
    .encode('color', '#e15759')
    .axis('y', { position: 'right', ...getAxisStyle('平均薪资(元)', '#e15759') })
    .style('lineWidth', 2)
    .tooltip({ channel: 'y', valueFormatter: (d: number) => `¥${d.toLocaleString()}` });

  trendChart
    .point()
    .encode('x', 'month')
    .encode('y', 'avgSalary')
    .encode('color', '#e15759')
    .style('r', 3);

  trendChart.render();
  chartInstances.push(trendChart);

  // 行业岗位分布 - 环形图
  const industryChart = new Chart({
    container: industryChartRef.value!,
    autoFit: true,
    theme: commonTheme,
  });
  industryChart
    .data(industryData.value)
    .coordinate({ type: 'theta', innerRadius: 0.6 })
    .interaction({ tooltip: { shared: true } });

  industryChart
    .interval()
    .encode('y', 'value')
    .encode('color', 'industry')
    .style('stroke', tc.strokeColor, 'lineWidth', 2)
    .label({
      text: 'industry',
      position: 'outside',
      style: { fontSize: 11, fill: tc.labelColor },
    })
    .tooltip({
      channel: 'y',
      valueFormatter: (d: number) => `${d.toLocaleString()} 个`,
    });

  industryChart.render();
  chartInstances.push(industryChart);

  // 学历要求分布 - 玫瑰图
  const educationChart = new Chart({
    container: educationChartRef.value!,
    autoFit: true,
    theme: commonTheme,
  });
  educationChart
    .data(educationData.value)
    .coordinate({ type: 'theta', innerRadius: 0.2 })
    .interaction({ tooltip: { shared: true } });

  educationChart
    .interval()
    .encode('y', 'value')
    .encode('color', 'education')
    .style('stroke', tc.strokeColor, 'lineWidth', 2)
    .label({
      text: (d: any) => `${d.education}: ${d.value.toLocaleString()}`,
      position: 'outside',
      style: { fontSize: 11, fill: tc.labelColor },
    })
    .tooltip({
      channel: 'y',
      valueFormatter: (d: number) => `${d.toLocaleString()} 个`,
    });

  educationChart.render();
  chartInstances.push(educationChart);

  // 热门岗位 TOP10 - 横向柱状图
  const hotJobChart = new Chart({
    container: hotJobChartRef.value!,
    autoFit: true,
    theme: commonTheme,
  });
  hotJobChart
    .data(hotJobData.value)
    .coordinate({ transform: [{ type: 'transpose' }] })
    .interaction({ tooltip: { shared: true } });

  hotJobChart
    .interval()
    .encode('x', 'name')
    .encode('y', 'count')
    .encode('color', '#59a14f')
    .axis('x', {
      ...getAxisStyle(),
      labelAutoRotate: false,
      labelSpacing: 4,
      label: { fill: tc.axisLabelColor, fontSize: 11 },
    })
    .axis('y', getAxisStyle('岗位数量'))
    .style('fillOpacity', 0.85)
    .tooltip({
      channel: 'y',
      valueFormatter: (d: number) => `${d.toLocaleString()} 个`,
    });

  hotJobChart.render();
  chartInstances.push(hotJobChart);

  // 城市岗位分布 - 柱状图
  const cityChart = new Chart({
    container: cityChartRef.value!,
    autoFit: true,
    theme: commonTheme,
  });
  cityChart
    .data(cityData.value)
    .interaction({ tooltip: { shared: true } });

  cityChart
    .interval()
    .encode('x', 'city')
    .encode('y', 'count')
    .encode('color', '#f28e2b')
    .axis('x', {
      ...getAxisStyle(),
      label: { fill: tc.axisLabelColor, fontSize: 11 },
    })
    .axis('y', getAxisStyle('岗位数量'))
    .style('fillOpacity', 0.85)
    .tooltip({
      channel: 'y',
      valueFormatter: (d: number) => `${d.toLocaleString()} 个`,
    });

  cityChart.render();
  chartInstances.push(cityChart);

  // 工作经验要求 - 环形图
  const experienceChart = new Chart({
    container: experienceChartRef.value!,
    autoFit: true,
    theme: commonTheme,
  });
  experienceChart
    .data(experienceData.value)
    .coordinate({ type: 'theta', innerRadius: 0.6 })
    .interaction({ tooltip: { shared: true } });

  experienceChart
    .interval()
    .encode('y', 'value')
    .encode('color', 'experience')
    .style('stroke', tc.strokeColor, 'lineWidth', 2)
    .label({
      text: (d: any) => `${d.experience}\n${d.value.toLocaleString()}`,
      position: 'outside',
      style: { fontSize: 11, fill: tc.labelColor },
    })
    .tooltip({
      channel: 'y',
      valueFormatter: (d: number) => `${d.toLocaleString()} 个`,
    });

  experienceChart.render();
  chartInstances.push(experienceChart);

  // 薪资区间分布 - 面积图
  const salaryChart = new Chart({
    container: salaryChartRef.value!,
    autoFit: true,
    theme: commonTheme,
  });
  salaryChart
    .data(salaryRangeData.value)
    .interaction({ tooltip: { shared: true } });

  salaryChart
    .area()
    .encode('x', 'range')
    .encode('y', 'value')
    .encode('color', '#76b7b2')
    .style('fillOpacity', 0.3)
    .tooltip({
      channel: 'y',
      valueFormatter: (d: number) => `${d.toLocaleString()} 个`,
    });

  salaryChart
    .line()
    .encode('x', 'range')
    .encode('y', 'value')
    .encode('color', '#76b7b2')
    .style('lineWidth', 2);

  salaryChart
    .point()
    .encode('x', 'range')
    .encode('y', 'value')
    .encode('color', '#76b7b2')
    .style('r', 3);

  salaryChart.render();
  chartInstances.push(salaryChart);

  // 岗位类型分布 - 饼图
  const jobTypeChart = new Chart({
    container: jobTypeChartRef.value!,
    autoFit: true,
    theme: commonTheme,
  });
  jobTypeChart
    .data(jobTypeData.value)
    .coordinate({ type: 'theta', innerRadius: 0.5 })
    .interaction({ tooltip: { shared: true } });

  jobTypeChart
    .interval()
    .encode('y', 'value')
    .encode('color', 'type')
    .style('stroke', tc.strokeColor, 'lineWidth', 2)
    .label({
      text: (d: any) => `${d.type}\n${(d.value / jobTypeData.value.reduce((s: number, i: any) => s + i.value, 0) * 100).toFixed(1)}%`,
      position: 'outside',
      style: { fontSize: 11, fill: tc.labelColor },
    })
    .tooltip({
      channel: 'y',
      valueFormatter: (d: number) => `${d.toLocaleString()} 个`,
    });

  jobTypeChart.render();
  chartInstances.push(jobTypeChart);
}

onMounted(async () => {
  await loadAllData();
  startNumberAnimation(overviewStats.value.totalJobs, totalJobsValue);
  startNumberAnimation(overviewStats.value.todayNew, todayNewValue);
  startNumberAnimation(overviewStats.value.avgSalary, avgSalaryValue);
  startNumberAnimation(overviewStats.value.totalCompanies, totalCompaniesValue);
  renderCharts();
});

watch(isDark, () => {
  renderCharts();
});

onUnmounted(() => {
  chartInstances.forEach((chart) => chart.destroy());
  chartInstances = [];
});
</script>

<template>
  <Page auto-content-height>
    <div class="job-dashboard p-4" :style="{ backgroundColor: themeColors.dashboardBg }">
      <!-- 顶部标题 -->
      <div class="mb-4 text-center">
        <h1 class="mb-1 text-2xl font-bold" :style="{ color: themeColors.titleColor }">岗位数据分析大屏</h1>
        <p class="text-sm" :style="{ color: themeColors.subtitleColor }">实时监控岗位市场动态，洞察行业趋势</p>
      </div>

      <!-- 概览统计卡片 -->
      <div class="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div class="stat-card stat-card-blue rounded-lg p-4 text-white shadow-md">
          <div class="mb-1 text-sm opacity-80">岗位总数</div>
          <div class="text-3xl font-bold">{{ totalJobsValue.toLocaleString() }}</div>
          <div class="mt-1 text-xs opacity-70">累计发布岗位</div>
        </div>
        <div class="stat-card stat-card-green rounded-lg p-4 text-white shadow-md">
          <div class="mb-1 text-sm opacity-80">今日新增</div>
          <div class="text-3xl font-bold">{{ todayNewValue.toLocaleString() }}</div>
          <div class="mt-1 text-xs opacity-70">今日新增岗位</div>
        </div>
        <div class="stat-card stat-card-orange rounded-lg p-4 text-white shadow-md">
          <div class="mb-1 text-sm opacity-80">平均薪资</div>
          <div class="text-3xl font-bold">¥{{ avgSalaryValue.toLocaleString() }}</div>
          <div class="mt-1 text-xs opacity-70">月平均薪资</div>
        </div>
        <div class="stat-card stat-card-purple rounded-lg p-4 text-white shadow-md">
          <div class="mb-1 text-sm opacity-80">招聘企业</div>
          <div class="text-3xl font-bold">{{ totalCompaniesValue.toLocaleString() }}</div>
          <div class="mt-1 text-xs opacity-70">活跃招聘企业</div>
        </div>
      </div>

      <!-- 第一行图表：趋势 + 行业分布 -->
      <div class="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div class="chart-card rounded-lg p-4 shadow-sm lg:col-span-3" :style="{ backgroundColor: themeColors.cardBg, border: `1px solid ${themeColors.cardBorder}` }">
          <h3 class="chart-card-title mb-2 text-base font-semibold" :style="{ color: themeColors.titleColor }">岗位数量与薪资趋势</h3>
          <div ref="trendChartRef" style="height: 320px" />
        </div>
        <div class="chart-card rounded-lg p-4 shadow-sm lg:col-span-2" :style="{ backgroundColor: themeColors.cardBg, border: `1px solid ${themeColors.cardBorder}` }">
          <h3 class="chart-card-title mb-2 text-base font-semibold" :style="{ color: themeColors.titleColor }">行业岗位分布</h3>
          <div ref="industryChartRef" style="height: 320px" />
        </div>
      </div>

      <!-- 第二行图表：热门岗位 + 城市分布 -->
      <div class="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="chart-card rounded-lg p-4 shadow-sm" :style="{ backgroundColor: themeColors.cardBg, border: `1px solid ${themeColors.cardBorder}` }">
          <h3 class="chart-card-title mb-2 text-base font-semibold" :style="{ color: themeColors.titleColor }">热门岗位 TOP10</h3>
          <div ref="hotJobChartRef" style="height: 320px" />
        </div>
        <div class="chart-card rounded-lg p-4 shadow-sm" :style="{ backgroundColor: themeColors.cardBg, border: `1px solid ${themeColors.cardBorder}` }">
          <h3 class="chart-card-title mb-2 text-base font-semibold" :style="{ color: themeColors.titleColor }">城市岗位分布</h3>
          <div ref="cityChartRef" style="height: 320px" />
        </div>
      </div>

      <!-- 第三行图表：学历 + 经验 + 薪资 + 类型 -->
      <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="chart-card rounded-lg p-4 shadow-sm" :style="{ backgroundColor: themeColors.cardBg, border: `1px solid ${themeColors.cardBorder}` }">
          <h3 class="chart-card-title mb-2 text-base font-semibold" :style="{ color: themeColors.titleColor }">学历要求分布</h3>
          <div ref="educationChartRef" style="height: 280px" />
        </div>
        <div class="chart-card rounded-lg p-4 shadow-sm" :style="{ backgroundColor: themeColors.cardBg, border: `1px solid ${themeColors.cardBorder}` }">
          <h3 class="chart-card-title mb-2 text-base font-semibold" :style="{ color: themeColors.titleColor }">工作经验要求</h3>
          <div ref="experienceChartRef" style="height: 280px" />
        </div>
        <div class="chart-card rounded-lg p-4 shadow-sm" :style="{ backgroundColor: themeColors.cardBg, border: `1px solid ${themeColors.cardBorder}` }">
          <h3 class="chart-card-title mb-2 text-base font-semibold" :style="{ color: themeColors.titleColor }">薪资区间分布</h3>
          <div ref="salaryChartRef" style="height: 280px" />
        </div>
        <div class="chart-card rounded-lg p-4 shadow-sm" :style="{ backgroundColor: themeColors.cardBg, border: `1px solid ${themeColors.cardBorder}` }">
          <h3 class="chart-card-title mb-2 text-base font-semibold" :style="{ color: themeColors.titleColor }">岗位类型分布</h3>
          <div ref="jobTypeChartRef" style="height: 280px" />
        </div>
      </div>
    </div>
  </Page>
</template>

<style>
.job-dashboard {
  min-height: 100%;
}

.stat-card-blue {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-card-green {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.stat-card-orange {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.stat-card-purple {
  background: linear-gradient(135deg, #a855f7, #9333ea);
}

html.dark .stat-card-blue {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
}

html.dark .stat-card-green {
  background: linear-gradient(135deg, #15803d, #166534);
}

html.dark .stat-card-orange {
  background: linear-gradient(135deg, #c2410c, #9a3412);
}

html.dark .stat-card-purple {
  background: linear-gradient(135deg, #7e22ce, #6b21a8);
}
</style>
