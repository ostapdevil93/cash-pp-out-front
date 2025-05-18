import { beforeEach, vi } from 'vitest';
import {
  FindByTextPlugin,
  FindByDataTestIdPlugin,
  emitter,
  queryClient,
  axiosInstance,
  mockResizeObserver,
  VueRouterMock,
  testConfig,
} from '@ebp/test-utils';
import MockAdapter from 'axios-mock-adapter';
import { config } from '@vue/test-utils';

vi.stubGlobal('axios', axiosInstance);
vi.stubGlobal('queryClient', queryClient);
vi.stubGlobal('emitter', emitter);

export const mockAxios = new MockAdapter(axiosInstance);

mockResizeObserver();

beforeEach(() => {
  mockAxios.reset();
});

config.plugins.VueWrapper.install(VueRouterMock);
config.plugins.VueWrapper.install(FindByDataTestIdPlugin);
config.plugins.VueWrapper.install(FindByTextPlugin);

testConfig.plugins.VueWrapper.install(VueRouterMock);
testConfig.plugins.VueWrapper.install(FindByDataTestIdPlugin);
testConfig.plugins.VueWrapper.install(FindByTextPlugin);
