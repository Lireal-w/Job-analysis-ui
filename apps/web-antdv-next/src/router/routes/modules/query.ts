import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Query',
    path: '/query',
    meta: {
      title: $t('page.query.title'),
      icon: 'ant-design:search-outlined',
      order: 5,
    },
    children: [
      {
        name: 'QueryBuilder',
        path: '/query/builder',
        component: () => import('#/views/query/builder/index.vue'),
        meta: {
          title: $t('page.query.builder'),
          icon: 'ant-design:code-outlined',
        },
      },
    ],
  },
];

export default routes;
