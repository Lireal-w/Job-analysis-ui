
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  cityData,
  educationData,
  experienceData,
  hotJobData,
  industryData,
  jobTrendData,
  jobTypeData,
  overviewStats,
  salaryRangeData,
} from './data';

/** 数字滚动动画 */
function useNumberAnimation(target: number, duration = 1500) {
  const current = ref(0);
  let animationFrame: number | null = null;

  function start() {
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      current.value = Math.round(target * eased);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
  }

  function stop() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  }

  return { current, start, stop };
}

const totalJobs = useNumberAnimation(overviewStats.totalJobs);
const todayNew = useNumberAnimation(overviewStats.todayNew);
const avgSalary = useNumberAnimation(overviewStats.avgSalary);
const totalCompanies = useNumberAnimation(overviewStats.totalCompanies);

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

onMounted(async () => {
  totalJobs.start();
  todayNew.start();
  avgSalary.start();
  totalCompanies.start();

  // 动态导入 @antv/g2
  const { Chart } = await import('@antv/g2');

  // 岗位数量趋势 - 双轴图
  const trendChart = new Chart({
    container: trendChartRef.value!,
    autoFit: true,
  });
  trendChart
    .data(jobTrendData)
    .interaction({ tooltip: { shared: true } });

  trendChart
    .interval()
    .encode('x', 'month')
    .encode('y', 'count')
    .encode('color', '#4e79a7')
    .axis('y', { title: '岗位数量', titleFill: '#4e79a7' })
    .style('fillOpacity', 0.85)
    .tooltip({ channel: 'y', valueFormatter: (d: number) => `${d.toLocaleString()} 个` });

  trendChart
    .line()
    .encode('x', 'month')
    .encode('y', 'avgSalary')
    .encode('color', '#e15759')
    .axis('y', { position: 'right', title: '平均薪资(元)', titleFill: '#e15759' })
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
  });
  industryChart
    .data(industryData)
    .coordinate({ type: 'theta', innerRadius: 0.6 })
    .interaction({ tooltip: { shared: true } });

  industryChart
    .interval()
    .encode('y', 'value')
    .encode('color', 'industry')
    .style('stroke', '#fff', 'lineWidth', 2)
    .label({
      text: 'industry',
      position: 'outside',
      style: { fontSize: 11 },
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
  });
  educationChart
    .data(educationData)
    .coordinate({ type: 'theta', innerRadius: 0.2 })
    .interaction({ tooltip: { shared: true } });

  educationChart
    .interval()
    .encode('y', 'value')
    .encode('color', 'education')
    .style('stroke', '#fff', 'lineWidth', 2)
    .label({
      text: (d: any) => `${d.education}: ${d.value.toLocaleString()}`,
      position: 'outside',
      style: { fontSize: 11 },
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
  });
  hotJobChart
    .data(hotJobData)
    .coordinate({ transform: [{ type: 'transpose' }] })
    .interaction({ tooltip: { shared: true } });

  hotJobChart
    .interval()
    .encode('x', 'name')
    .encode('y', 'count')
    .encode('color', '#59a14f')
    .axis('x', { labelAutoRotate: false, labelSpacing: 4, style: { labelFontSize: 11 } })
    .axis('y', { title: '岗位数量' })
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
  });
  cityChart
    .data(cityData)
    .interaction({ tooltip: { shared: true } });

  cityChart
    .interval()
    .encode('x', 'city')
    .encode('y', 'count')
    .encode('color', '#f28e2b')
    .axis('y', { title: '岗位数量' })
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
  });
  experienceChart
    .data(experienceData)
    .coordinate({ type: 'theta', innerRadius: 0.6 })
    .interaction({ tooltip: { shared: true } });

  experienceChart
    .interval()
    .encode('y', 'value')
    .encode('color', 'experience')
    .style('stroke', '#fff', 'lineWidth', 2)
    .label({
      text: (d: any) => `${d.experience}
${d.value.toLocaleString()}`,
      position: 'outside',
      style: { fontSize: 11 },
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
  });
  salaryChart
    .data(salaryRangeData)
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
  });
  jobTypeChart
    .data(jobTypeData)
    .coordinate({ type: 'theta', innerRadius: 0.5 })
    .interaction({ tooltip: { shared: true } });

  jobTypeChart
    .interval()
    .encode('y', 'value')
    .encode('color', 'type')
    .style('stroke', '#fff', 'lineWidth', 2)
    .label({
      text: (d: any) => `${d.type}
${(d.value / jobTypeData.reduce((s, i) => s + i.value, 0) * 100).toFixed(1)}%`,
      position: 'outside',
      style: { fontSize: 11 },
    })
    .tooltip({
      channel: 'y',
      valueFormatter: (d: number) => `${d.toLocaleString()} 个`,
    });

  jobTypeChart.render();
  chartInstances.push(jobTypeChart);
});

onUnmounted(() => {
  chartInstances.forEach((chart) => chart.destroy());
  chartInstances = [];
  totalJobs.stop();
  todayNew.stop();
  avgSalary.stop();
  totalCompanies.stop();
});
</script>

<template>
  <Page auto-content-height>
    <div class="job-dashboard p-4">
      <!-- 顶部标题 -->
      <div class="mb-4 text-center">
        <h1 class="mb-1 text-2xl font-bold text-gray-800">岗位数据分析大屏</h1>
        <p class="text-sm text-gray-500">实时监控岗位市场动态，洞察行业趋势</p>
      </div>

      <!-- 概览统计卡片 -->
      <div class="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div class="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-md">
          <div class="mb-1 text-sm opacity-80">岗位总数</div>
          <div class="text-3xl font-bold">{{ totalJobs.current.toLocaleString() }}</div>
          <div class="mt-1 text-xs opacity-70">累计发布岗位</div>
        </div>
        <div class="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-4 text-white shadow-md">
          <div class="mb-1 text-sm opacity-80">今日新增</div>
          <div class="text-3xl font-bold">{{ todayNew.current.toLocaleString() }}</div>
          <div class="mt-1 text-xs opacity-70">今日新增岗位</div>
        </div>
        <div class="rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white shadow-md">
          <div class="mb-1 text-sm opacity-80">平均薪资</div>
          <div class="text-3xl font-bold">¥{{ avgSalary.current.toLocaleString() }}</div>
          <div class="mt-1 text-xs opacity-70">月平均薪资</div>
        </div>
        <div class="rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 p-4 text-white shadow-md">
          <div class="mb-1 text-sm opacity-80">招聘企业</div>
          <div class="text-3xl font-bold">{{ totalCompanies.current.toLocaleString() }}</div>
          <div class="mt-1 text-xs opacity-70">活跃招聘企业</div>
        </div>
      </div>

      <!-- 第一行图表：趋势 + 行业分布 -->
      <div class="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div class="rounded-lg bg-white p-4 shadow-sm lg:col-span-3">
          <h3 class="mb-2 text-base font-semibold text-gray-700">岗位数量与薪资趋势</h3>
          <div ref="trendChartRef" style="height: 320px" />
        </div>
        <div class="rounded-lg bg-white p-4 shadow-sm lg:col-span-2">
          <h3 class="mb-2 text-base font-semibold text-gray-700">行业岗位分布</h3>
          <div ref="industryChartRef" style="height: 320px" />
        </div>
      </div>

      <!-- 第二行图表：热门岗位 + 城市分布 -->
      <div class="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="rounded-lg bg-white p-4 shadow-sm">
          <h3 class="mb-2 text-base font-semibold text-gray-700">热门岗位 TOP10</h3>
          <div ref="hotJobChartRef" style="height: 320px" />
        </div>
        <div class="rounded-lg bg-white p-4 shadow-sm">
          <h3 class="mb-2 text-base font-semibold text-gray-700">城市岗位分布</h3>
          <div ref="cityChartRef" style="height: 320px" />
        </div>
      </div>

      <!-- 第三行图表：学历 + 经验 + 薪资 + 类型 -->
      <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-lg bg-white p-4 shadow-sm">
          <h3 class="mb-2 text-base font-semibold text-gray-700">学历要求分布</h3>
          <div ref="educationChartRef" style="height: 280px" />
        </div>
        <div class="rounded-lg bg-white p-4 shadow-sm">
          <h3 class="mb-2 text-base font-semibold text-gray-700">工作经验要求</h3>
          <div ref="experienceChartRef" style="height: 280px" />
        </div>
        <div class="rounded-lg bg-white p-4 shadow-sm">
          <h3 class="mb-2 text-base font-semibold text-gray-700">薪资区间分布</h3>
          <div ref="salaryChartRef" style="height: 280px" />
        </div>
        <div class="rounded-lg bg-white p-4 shadow-sm">
          <h3 class="mb-2 text-base font-semibold text-gray-700">岗位类型分布</h3>
          <div ref="jobTypeChartRef" style="height: 280px" />
        </div>
      </div>
    </div>
  </Page>
</template>

<style scoped>
.job-dashboard {
  background-color: #f5f7fa;
  min-height: 100%;
}
</style>
