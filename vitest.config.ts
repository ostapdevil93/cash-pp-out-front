import { defineConfig } from 'vitest/config';
import { createMfeVitestConfig } from '@ebp/dev-configs/configs/mfe/mfe-vitest.config.js';
import viteConfig from './vite.config';

const customConfig = defineConfig({
  test: {
    coverage: {
      reporter: ['html', 'json-summary', 'text-summary'],
    },
  },
});

export default ({ command, mode }) => createMfeVitestConfig({
  viteConfig: viteConfig({ command, mode }),
  rootDir: __dirname,
  customConfig,
  mode,
});
