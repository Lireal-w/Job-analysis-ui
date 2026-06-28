import type { RouteRecordRaw } from 'vue-router';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'SysWorker',
    path: '/system/worker',
    component: () => import('#/views/system/worker/index.vue'),
    meta: {
      title: $t('page.menu.sysWorker'),
      icon: 'gala:worker',
      order: 2,
    },
  },
];

export default routes;
