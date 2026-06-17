import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Report',
    path: '/report',
    meta: {
      title: $t('page.report.title'),
      icon: 'ant-design:bar-chart-outlined',
      order: 6,
    },
    children: [
      {
        name: 'ReportList',
        path: '/report/list',
        component: () => import('#/views/report/list/index.vue'),
        meta: {
          title: $t('page.report.list'),
          icon: 'ant-design:appstore-outlined',
        },
      },
      {
        name: 'ReportDesigner',
        path: '/report/designer/:id?',
        component: () => import('#/views/report/designer/index.vue'),
        meta: {
          title: $t('page.report.designer'),
          icon: 'ant-design:edit-outlined',
          hideInMenu: true,
        },
      },
    ],
  },
];

export default routes;
