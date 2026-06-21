import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.capycode.app',
  appName: 'CodeTier',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
