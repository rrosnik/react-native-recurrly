import { useFonts } from "expo-font";
import { SplashScreen, Stack, } from "expo-router";

import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from '@clerk/expo/token-cache';

import "@/app/global.css";
import { ThemeProvider } from '@/modules/theme/providers/them-provider';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!clerkPublishableKey) {
    throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }

  return (
    <ThemeProvider>
      <ClerkProvider publishableKey={clerkPublishableKey} tokenCache={tokenCache}>
        <RootLayoutContent />
      </ClerkProvider>
    </ThemeProvider>
  );
}

const RootLayoutContent = () => {
  const { isLoaded } = useAuth();


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
    if (fontsLoaded && isLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, isLoaded]);

  if (!fontsLoaded || !isLoaded) return null;
  return (
    <Stack screenOptions={{ headerShown: false }} />
  )
}