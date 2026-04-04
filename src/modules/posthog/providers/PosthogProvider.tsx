import { PostHogProvider } from 'posthog-react-native';

export function PostHogProviderWrapper({ children }: { children: React.ReactNode }) {

    const posthogPublishableKey = process.env.EXPO_PUBLIC_POSTHOG_KEY || '';
    if (!posthogPublishableKey) {
        console.warn('PostHog publishable key is not set. Analytics will be disabled.');
        return <>{children}</>;
    }

    return (
        <PostHogProvider
            apiKey={posthogPublishableKey}
            options={{
                host: "https://us.i.posthog.com",
            }}
        >
            {children}
        </PostHogProvider>
    )
}