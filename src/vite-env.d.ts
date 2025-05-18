/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.md' {
  import { ComponentOptions } from 'vue';

  const Component: ComponentOptions;
  export default Component;
}

// Расширяем типы для компонентов, чтобы мы могли прокидывать кастомные data-атрибуты
// https://github.com/vuejs/language-tools/issues/1077#issuecomment-1146573602
// for vue components
declare module '@vue/runtime-core' {
  export interface AllowedComponentProps {
    [key: `data${string}`]: any,
    id?: string,
  }
}

// for native html elements
declare module '@vue/runtime-dom' {
  export interface HTMLAttributes {
    // allow any data-* attr
    [key: `data${string}`]: any,
  }
}

export {};
