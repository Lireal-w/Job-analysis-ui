import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Scheduler',
    path: '/scheduler',
    meta: {
      title: $t('page.menu.scheduler'),
      icon: 'ix:scheduler',
    },
    children: [
      {
        name: 'SchedulerManage',
        path: '/scheduler/manage',
        component: () => import('#/views/scheduler/manage/index.vue'),
        meta: {
          title: $t('page.menu.schedulerManage'),
          icon: 'ix:scheduler',
        },
      },
      {
        name: 'SchedulerRecord',
        path: '/scheduler/record',
        component: () => import('#/views/scheduler/record/index.vue'),
        meta: {
          title: $t('page.menu.schedulerRecord'),
          icon: 'ix:scheduler',
        },
      },
      {
        name: 'SchedulerRegistered',
        path: '/scheduler/registered',
        component: () => import('#/views/scheduler/registered/index.vue'),
        meta: {
          title: $t('page.menu.schedulerRegistered'),
          icon: 'mdi:file-document-multiple-outline',
        },
      },
      {
        name: 'SchedulerDynamic',
        path: '/scheduler/dynamic',
        component: () => import('#/views/scheduler/dynamic/index.vue'),
        meta: {
          title: $t('page.menu.schedulerDynamic'),
          icon: 'material-symbols:schedule',
        },
      },
    ],
  },
];

export default routes;
