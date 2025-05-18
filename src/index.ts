/* eslint-disable @ebp/external-modules */
import { createApp, h } from 'vue';
import { createDevApp } from '@ebp/dev-utils';
import { createPinia } from 'pinia';
import { createQueryClient } from '@ebp/mfe-utils';
import { _paths } from '@/shared/config';
import { App } from '@/app';
import { router } from './app/providers/router-provider/router-provider.ts';

if (process.env.NODE_ENV === 'development') {
  const pinia = createPinia();
  const devApp = createDevApp({
    router,
    slots: {
      headerContent: h('div', { style: [{ display: 'flex', gap: '16px', padding: '0 16px', alignItems: 'center', height: '100%' }] }),
      content: App,
    },
    queryClient: createQueryClient(),
    menu: [
      {
        exKey: '1',
        fullName: 'Наличные средства',
        shortName: 'Наличные средства',
        iconName: 'IconCardTick',
        isShowNested: true,
        position: 1,
        url: null,
        section: [
          {
            exKey: '2',
            fullName: 'Поступления',
            shortName: 'Поступления',
            iconName: null,
            isShowNested: false,
            position: 2,
            url: _paths.ORDERS_LIST,
            section: [],
          },
        ],
      },
    ],
  });
  devApp.use(pinia);
  devApp.mount('#app');
} else {
  const app = createApp(App).use(router);
  app.mount('#app');
}
