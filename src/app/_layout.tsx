import { useEffect } from 'react';
import { Platform } from 'react-native';

import { DarkTheme, Stack, ThemeProvider } from 'expo-router';

export default function RootLayout() {
  useEffect(() => {
    // Never register the caching service worker during local dev - it would
    // otherwise pin the browser to whatever was first served and mask every
    // subsequent change behind a stale cache-first response.
    if (__DEV__ || Platform.OS !== 'web') return;
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
