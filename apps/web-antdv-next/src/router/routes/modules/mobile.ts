import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'MobileVersion',
    path: '/mobile/version',
    meta: {
      title: $t('page.menu.appVersion'),
      icon: 'material-symbols:system-update',
      order: 10,
    },
    children: [
      {
        name: 'MobileVersionList',
        path: '/mobile/version/list',
        component: () => import('#/views/mobile/version/index.vue'),
        meta: {
          title: $t('page.menu.appVersionList'),
          icon: 'material-symbols:system-update-alt',
        },
      },
    ],
  },
];

export default routes;
