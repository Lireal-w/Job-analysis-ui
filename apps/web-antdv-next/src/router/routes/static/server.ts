import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Server',
    path: '/server',
    meta: {
      title: $t('page.menu.serverManage'),
      icon: 'ant-design:cloud-server-outlined',
      order: 3,
    },
    children: [
      {
        name: 'ServerList',
        path: '/server/list',
        component: () => import('#/views/server/index.vue'),
        meta: {
          title: $t('page.menu.serverList'),
          icon: 'ant-design:desktop-outlined',
        },
      },
    ],
  },
];

export default routes;
