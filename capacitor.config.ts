
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e767e5e8c8354459bae5d5c78e74030d',
  appName: 'budget-questor',
  webDir: 'dist',
  server: {
    url: 'https://e767e5e8-c835-4459-bae5-d5c78e74030d.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
    },
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;
