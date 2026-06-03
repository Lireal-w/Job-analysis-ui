
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Crawler',
    path: '/crawler',
    meta: {
      title: $t('page.crawler.title'),
      icon: 'ant-design:bug-filled',
      order: 0,
    },
    children: [
      {
        name: 'CrawlerManagement',
        path: '/crawler/management',
        component: () => import('#/views/crawler/management/index.vue'),
        meta: {
          title: $t('page.crawler.management'),
          icon: 'ant-design:code-outlined',
        },
      },
      {
        name: 'CrawlerAnalysis',
        path: '/crawler/analysis',
        component: () => import('#/views/crawler/analysis/index.vue'),
        meta: {
          title: $t('page.crawler.analysis'),
          icon: 'ant-design:setting-outlined',
        },
      },
    ],
  },
];

export default routes;
