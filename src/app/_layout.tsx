import { useFonts } from "expo-font";
import { SplashScreen, Stack, useGlobalSearchParams, usePathname, } from "expo-router";

import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from '@clerk/expo/token-cache';

import "@/app/global.css";
import { PostHogProviderWrapper } from '@/modules/posthog/providers/PosthogProvider';
import { ThemeProvider } from '@/modules/theme/providers/them-provider';
import { useEffect, useRef } from 'react';

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

  if (!fontsLoaded || !authLoaded) return null;
  return (
    <Stack screenOptions={{ headerShown: false }} />
  )
}