import { useFonts } from "expo-font";
import { SplashScreen, Stack, useGlobalSearchParams, usePathname, } from "expo-router";

import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from '@clerk/expo/token-cache';

import "@/app/global.css";
import { db } from '@/db';
import migrations from '@/drizzle/migrations';
import { AppQueryClientProvider } from '@/lib/query/QueryClientProvider';
import { PostHogProviderWrapper } from '@/lib/posthog/providers/PosthogProvider';
import { ThemeProvider } from '@/providers/them-provider';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

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
  const { success, error } = useMigrations(db, migrations);
  const { isLoaded: authLoaded } = useAuth();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);


  useEffect(() => {
    if (previousPathname.current !== pathname) {
      // Filter route params to avoid leaking sensitive data
      const sanitizedParams = Object.keys(params).reduce((acc, key) => {
        // Only include specific safe params
        if (['id', 'tab', 'view'].includes(key)) {
          acc[key] = params[key];
        }
        return acc;
      }, {} as Record<string, string | string[]>);

      // posthog.screen(pathname, {
      //   previous_screen: previousPathname.current ?? null,
      //   ...sanitizedParams,
      // });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);


  const [fontsLoaded] = useFonts({
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

  if (error) {
    console.error("Failed to run migrations:", error);
    return (<View className='flex-1 items-center justify-center bg-white'>
      <Text className='text-destructive text-lg'>An error occurred while initializing the app.</Text>
      <Text className='text-muted-foreground text-sm mt-2'>Please try restarting the app. If the issue persists, contact support. </Text>
      <Text className='text-muted-foreground text-sm mt-1'>Error details: {error.message}</Text>
    </View>)
  }

  if (!fontsLoaded || !authLoaded || !success) return null;
  return (
    <AppQueryClientProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AppQueryClientProvider>
  )
}