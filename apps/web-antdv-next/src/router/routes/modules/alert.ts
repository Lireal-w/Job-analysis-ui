import type { RouteRecordRaw } from 'vue-router';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Alert',
    path: '/alert',
    meta: {
      title: $t('page.alert.title'),
      icon: 'ant-design:alert-outlined',
      order: 9,
    },
    children: [
      {
        name: 'AlertManagement',
        path: '/alert/management',
        component: () => import('#/views/alert/index.vue'),
        meta: {
          title: $t('page.alert.management'),
          icon: 'ant-design:bell-outlined',
        },
      },
    ],
  },
];
export default routes;
