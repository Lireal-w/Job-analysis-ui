import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Quality',
    path: '/quality',
    meta: {
      title: $t('page.quality.title'),
      icon: 'ant-design:safety-certificate-filled',
      order: 3,
    },
    children: [
      {
        name: 'QualityRules',
        path: '/quality/rules',
        component: () => import('#/views/quality/rules/index.vue'),
        meta: {
          title: $t('page.quality.rules'),
          icon: 'ant-design:audit-outlined',
        },
      },
    ],
  },
];

export default routes;
