import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';

import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from '@clerk/expo/token-cache';

import "@/app/global.css";
import ErrorState from '@/components/ErrorState';
import { PostHogProviderWrapper } from '@/lib/posthog/providers/PosthogProvider';
import { AppQueryClientProvider } from '@/lib/query/QueryClientProvider';
import { ThemeProvider } from '@/providers/them-provider';
import { useEffect } from 'react';

import { PortalHost } from '@rn-primitives/portal';
import 'react-native-get-random-values';

export default function RootLayout() {

  const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkPublishableKey) {
    throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }

  return (
    <ThemeProvider>
      <PostHogProviderWrapper>
        <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
          <RootLayoutContent />
        </ClerkProvider>
      </PostHogProviderWrapper>
    </ThemeProvider>
  );
}

const RootLayoutContent = () => {
  // const { success, error: errorMigrations } = useMigrations(db, migrations);
  const { isLoaded: authLoaded } = useAuth();
  const [fontsLoaded, errorFonts] = useFonts({
    'sans-regular': require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    'sans-bold': require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    'sans-medium': require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    'sans-semibold': require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    'sans-extrabold': require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    'sans-light': require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    // prevent the splash screen from auto-hiding until we're ready
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn('Error preventing splash auto hide:', e);
      }
    })();
  }, []);

  useEffect(() => {
    // hide the splash screen once fonts and auth state are loaded
    if (fontsLoaded && authLoaded) {
      (async () => {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.warn('Error hiding splash screen:', e);
        }
      })();
    }
  }, [fontsLoaded, authLoaded]);

  // if (errorMigrations) {
  //   return <ErrorState title="Database Error" message="An error occurred while initializing the database. Please try restarting the app. If the issue persists, contact support." />
  // }

  if (errorFonts) {
    return <ErrorState title="Font Loading Error" message="An error occurred while loading fonts. Please try restarting the app. If the issue persists, contact support." />
  }

  if (!fontsLoaded || !authLoaded) return null;

  return (
    <AppQueryClientProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="subscriptions/create" options={{
          presentation: "modal",
          animation: "fade_from_bottom",
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }} />
      </Stack>
      <PortalHost />
    </AppQueryClientProvider>
  )

}