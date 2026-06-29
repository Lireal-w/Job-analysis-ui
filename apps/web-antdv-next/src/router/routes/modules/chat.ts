import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'Chat',
    path: '/chat',
    component: () => import('#/views/chat/index.vue'),
    meta: {
      title: $t('page.menu.chat'),
      icon: 'ant-design:message-outlined',
    },
  },
];

export default routes;
