<script setup lang="ts">
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

interface Props {
  option?: Record<string, any> | null;
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  option: null,
  height: '200px',
});

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

function render() {
  if (props.option) {
    renderEcharts(props.option as any);
  }
}

onMounted(() => {
  render();
});

watch(() => props.option, () => {
  render();
}, { deep: true });
</script>

<template>
  <EchartsUI ref="chartRef" :height="height" />
</template>