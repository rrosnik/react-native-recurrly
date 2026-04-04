import { Redirect, Stack } from "expo-router";

import "@/app/global.css";
import { ThemeProvider } from '@/modules/theme/providers/them-provider';
import { useAuth } from '@clerk/expo';

export default function RootLayout() {

    const { isSignedIn, isLoaded } = useAuth()

    if (!isLoaded) {
        return null
    }

    if (isSignedIn) {
        return <Redirect href={'/(tabs)'} />
    }


    return <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>;
}
