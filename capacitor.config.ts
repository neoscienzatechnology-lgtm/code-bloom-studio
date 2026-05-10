import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.capycode.app',
  appName: 'CapyCode',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
