import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'escola-duartina',
  webDir: 'dist/EscolaDuartina/browser'

android: {
    allowMixedContent: true
  }
};

export default config;
