/**
 * 应用 UI 主题切换 composable
 *
 * 支持 'zzz' (绝区零) 和 'hsr' (崩坏星穹铁道) 两种风格
 */
import { watch } from 'vue';

import { preferences } from '@vben/preferences';

import { useAccessStore } from '@vben/stores';

type UiTheme = 'zzz' | 'hsr';

const UI_THEME_KEY = 'app-ui-theme';

/**
 * 获取当前 UI 主题
 */
export function getCurrentUiTheme(): UiTheme {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem(UI_THEME_KEY) as UiTheme) || 'zzz';
  }
  return 'zzz';
}

/**
 * 设置 UI 主题
 */
export function setUiTheme(theme: UiTheme): void {
  // 保存到 localStorage
  localStorage.setItem(UI_THEME_KEY, theme);
  // 设置到 html 根元素
  document.documentElement.setAttribute('data-ui-theme', theme);
}

/**
 * 切换 UI 主题 (zzz <-> hsr)
 */
export function toggleUiTheme(): UiTheme {
  const current = getCurrentUiTheme();
  const next: UiTheme = current === 'zzz' ? 'hsr' : 'zzz';
  setUiTheme(next);
  return next;
}

/**
 * 初始化 UI 主题 (在 app 启动时调用)
 */
export function initUiTheme(): void {
  const theme = getCurrentUiTheme();
  document.documentElement.setAttribute('data-ui-theme', theme);
}

/**
 * 获取当前 UI 主题对应的 AntDV theme token 模块
 */
export function getCurrentUiThemeToken() {
  const theme = getCurrentUiTheme();
  if (theme === 'hsr') {
    return import('#/theme/hsr-theme').then((m) => m.hsrTheme);
  }
  return import('#/theme/zzz-theme').then((m) => m.zzzTheme);
}
