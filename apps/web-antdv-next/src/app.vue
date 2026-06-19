<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';

import { useAntdDesignTokens } from '@vben/hooks';
import { preferences, usePreferences } from '@vben/preferences';

import { App, ConfigProvider, theme } from 'antdv-next';

import { getCurrentUiTheme, initUiTheme, setUiTheme } from '#/composables/useAppTheme';
import { hsrTheme } from '#/theme/hsr-theme';
import { zzzTheme } from '#/theme/zzz-theme';
import { antdLocale } from '#/locales';

defineOptions({ name: 'App' });

const { isDark } = usePreferences();
const { tokens } = useAntdDesignTokens();

// 当前 UI 主题
const uiTheme = ref<'zzz' | 'hsr'>('zzz');

// 根据 UI 主题选择对应的 AntDV token
const activeThemeToken = computed(() => {
  return uiTheme.value === 'hsr' ? hsrTheme.token : zzzTheme.token;
});

const tokenTheme = computed(() => {
  const algorithm = isDark.value
    ? [theme.darkAlgorithm]
    : [theme.defaultAlgorithm];

  // antd 紧凑模式算法
  if (preferences.app.compact) {
    algorithm.push(theme.compactAlgorithm);
  }

  return {
    algorithm,
    token: {
      ...tokens,
      ...activeThemeToken.value,
    },
  };
});

watch(
  tokenTheme,
  (themeConfig) => {
    ConfigProvider.config({ theme: themeConfig });
  },
  { immediate: true },
);

// 监听 UI 主题变化，更新 AntDV token
watch(uiTheme, () => {
  // 触发 tokenTheme 重算
  ConfigProvider.config({ theme: tokenTheme.value });
});

// 初始化时读取 localStorage 中的 UI 主题偏好
onMounted(() => {
  initUiTheme();
  uiTheme.value = getCurrentUiTheme();
});
</script>

<template>
  <ConfigProvider :locale="antdLocale" :theme="tokenTheme">
    <App>
      <!-- 全局背景装饰 - 根据主题切换 -->
      <div v-if="uiTheme === 'zzz'" class="zzz-bg-glow"></div>
      <div v-else class="hsr-bg-universe"></div>
      <RouterView />
    </App>
  </ConfigProvider>
</template>
