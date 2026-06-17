import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Dataset',
    path: '/dataset',
    meta: {
      title: $t('page.dataset.title'),
      icon: 'ant-design:database-outlined',
      order: 4,
    },
    children: [
      {
        name: 'DatasetManagement',
        path: '/dataset/management',
        component: () => import('#/views/dataset/index.vue'),
        meta: {
          title: $t('page.dataset.management'),
          icon: 'ant-design:table-outlined',
        },
      },
    ],
  },
];

export default routes;
