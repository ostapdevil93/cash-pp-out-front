import { AxiosInstance } from 'axios';
import { Emitter } from 'mitt';
import { EmitterEvents } from '@ebp/mfe-utils';
import { QueryClient } from '@tanstack/query-core';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $emitter: Emitter<EmitterEvents>,
    $axios: AxiosInstance,
    $queryClient: QueryClient,
  }
}
