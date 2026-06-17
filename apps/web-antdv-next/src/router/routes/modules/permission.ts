import type { RouteRecordRaw } from 'vue-router';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Permission',
    path: '/permission',
    meta: {
      title: $t('page.permission.title'),
      icon: 'ant-design:safety-outlined',
      order: 7,
    },
    children: [
      {
        name: 'PermissionManagement',
        path: '/permission/management',
        component: () => import('#/views/permission/index.vue'),
        meta: {
          title: $t('page.permission.management'),
          icon: 'ant-design:lock-outlined',
        },
      },
    ],
  },
];
export default routes;
