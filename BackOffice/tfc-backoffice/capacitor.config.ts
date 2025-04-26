import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'tfc-backoffice',
  webDir: 'public',
  bundledWebRuntime : false,
  server:{
    url: "http://192.168.1.69:3000",
    cleartext:true
  }
};

export default config;
