import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'ETL',
    path: '/etl',
    meta: {
      title: $t('page.etl.title'),
      icon: 'ant-design:deployment-unit-outlined',
      order: 2,
    },
    children: [
      {
        name: 'ETLFlow',
        path: '/etl/flow',
        component: () => import('#/views/etl/flow/index.vue'),
        meta: {
          title: $t('page.etl.flow'),
          icon: 'ant-design:apartment-outlined',
        },
      },
    ],
  },
];

export default routes;
