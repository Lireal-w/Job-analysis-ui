import type { RouteRecordRaw } from 'vue-router';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'AuditLog',
    path: '/audit-log',
    meta: {
      title: $t('page.auditLog.title'),
      icon: 'ant-design:audit-outlined',
      order: 8,
    },
    children: [
      {
        name: 'AuditLogList',
        path: '/audit-log/list',
        component: () => import('#/views/audit-log/index.vue'),
        meta: {
          title: $t('page.auditLog.list'),
          icon: 'ant-design:file-text-outlined',
        },
      },
    ],
  },
];
export default routes;
