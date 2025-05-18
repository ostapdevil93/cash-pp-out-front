import { defineConfig } from 'vite';
import { createMfeViteConfig } from '@ebp/dev-configs/configs/mfe/mfe-vite.config.js';
import pkg from './package.json';

const customConfig = defineConfig({
});

export default ({ command, mode }) => createMfeViteConfig({
  appName: process.env.VITE_APP_NAME,
  pkg,
  rootDir: __dirname,
  customConfig,
  mode,
});
