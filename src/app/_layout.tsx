import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from '@clerk/expo/token-cache';

import "@/app/global.css";
import ErrorState from '@/components/ErrorState';
import { db } from '@/db';
import migrations from '@/drizzle/migrations';
import { PostHogProviderWrapper } from '@/lib/posthog/providers/PosthogProvider';
import { AppQueryClientProvider } from '@/lib/query/QueryClientProvider';
import { ThemeProvider } from '@/providers/them-provider';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  console.log('Rendering RootLayout');

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
  console.log('Rendering RootLayoutContent');
  const { success, error: errorMigrations } = useMigrations(db, migrations);
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
    // hide the splash screen once fonts and auth state are loaded
    if (fontsLoaded && authLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, authLoaded]);

  if (errorMigrations) {
    return <ErrorState title="Database Error" message="An error occurred while initializing the database. Please try restarting the app. If the issue persists, contact support." />
  }

  if (errorFonts) {
    return <ErrorState title="Font Loading Error" message="An error occurred while loading fonts. Please try restarting the app. If the issue persists, contact support." />
  }

  if (!fontsLoaded || !authLoaded || !success) return null;
  return (
    <AppQueryClientProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppQueryClientProvider>
  )
}