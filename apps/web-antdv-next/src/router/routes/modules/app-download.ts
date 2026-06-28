import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    name: 'AppDownload',
    path: '/app-download',
    component: () => import('#/views/mobile/download/index.vue'),
    meta: {
      title: $t('page.menu.appDownload'),
      icon: 'ant-design:download-outlined',
    },
  },
];

export default routes;
