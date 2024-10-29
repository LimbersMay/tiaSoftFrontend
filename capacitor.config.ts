import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.latiadekaua.com',
  appName: 'TiaSoftApp',
  webDir: 'dist/latiadekaua/browser',
  android: {
    allowMixedContent: true,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    }
  }
};

export default config;
