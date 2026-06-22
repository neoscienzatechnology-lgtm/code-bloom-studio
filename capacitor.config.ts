import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.codetier.app',
  appName: 'CodeTier',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
