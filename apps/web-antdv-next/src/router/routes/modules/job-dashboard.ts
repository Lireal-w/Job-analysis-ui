
import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'JobDashboard',
    path: '/job-dashboard',
    component: () => import('#/views/job-dashboard/index.vue'),
    meta: {
      title: $t('page.jobDashboard.title'),
      icon: 'ant-design:bar-chart-outlined',
    },
  },
];

export default routes;
