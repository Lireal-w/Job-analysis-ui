import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'TodoList',
    path: '/todo/list',
    component: () => import('#/views/todo/index.vue'),
    meta: {
      title: $t('page.menu.todo'),
      icon: 'ant-design:check-square-outlined',
      order: 2,
    },
  },
];

export default routes;
