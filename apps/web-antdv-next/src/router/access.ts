import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';

import { message } from 'antdv-next';

import { getAllMenusApi } from '#/api';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = {
    ...import.meta.glob('../views/**/*.vue'),
    ...import.meta.glob('../plugins/**/*.vue'),
  };

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      message.loading({
        content: `${$t('common.loadingMenu')}...`,
        duration: 1.5,
      });
      const menus = await getAllMenusApi();
      // 合并前端自定义菜单
      menus.push({
        meta: {
          title: '岗位数据分析',
          icon: 'ant-design:bar-chart-outlined',
        },
        name: 'JobDashboard',
        path: '/job-dashboard',
        component: '/job-dashboard/index',
      });
      // 合并爬虫管理菜单
      menus.push({
        meta: {
          title: '爬虫管理',
          icon: 'ant-design:bug-filled',
        },
        name: 'Crawler',
        path: '/crawler',
        children: [
          {
            meta: {
              title: '爬虫目录',
              icon: 'ant-design:code-outlined',
            },
            name: 'CrawlerManagement',
            path: '/crawler/management',
            component: '/crawler/management/index',
          },
          {
            meta: {
              title: '数据分析',
              icon: 'ant-design:setting-outlined',
            },
            name: 'CrawlerAnalysis',
            path: '/crawler/analysis',
            component: '/crawler/analysis/index',
          },
        ],
      });
      return menus;
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
