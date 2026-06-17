import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Datasource',
    path: '/datasource',
    meta: {
      title: $t('page.datasource.title'),
      icon: 'ant-design:database-filled',
      order: 0,
    },
    children: [
      {
        name: 'DatasourceManagement',
        path: '/datasource/management',
        component: () => import('#/views/datasource/index.vue'),
        meta: {
          title: $t('page.datasource.management'),
          icon: 'ant-design:setting-outlined',
        },
      },
    ],
  },
];

export default routes;
