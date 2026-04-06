import { SafeAreaView } from '@/components/SafeAreaView';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { AlertTriangle } from 'lucide-react-native';
import React from 'react';
import { Alert, BackHandler, Platform, View } from 'react-native';

type ErrorStateProps = {
    title?: string;
    message?: string;
    actionTitle?: string;
    secondaryActionTitle?: string;
};

const ErrorState: React.FC<ErrorStateProps> = ({
    title = 'Something went wrong',
    message = 'An unexpected error occurred. Please try again.',
    actionTitle = 'Retry',
    secondaryActionTitle = 'Close',
}) => {
    const router = useRouter();
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 items-center justify-center p-6 gap-6">
                <View className="rounded-full bg-destructive/10 p-5">
                    <Icon as={AlertTriangle} size={48} className="text-destructive" />
                </View>

                <Text variant="h3" className="text-center text-foreground max-w-80">
                    {title}
                </Text>

                <Text className="text-center text-muted-foreground max-w-80">{message}</Text>

                <View className="flex-row gap-3 mt-4">
                    <Button onPress={() => router.replace("/(tabs)")} variant="accent" size="lg">
                        <Text className="text-white font-semibold">{actionTitle}</Text>
                    </Button>
                    <Button
                        onPress={() => {
                            if (Platform.OS === 'android') {
                                BackHandler.exitApp();
                            } else {
                                Alert.alert('Close app', 'Please close the app from the system UI (swipe up or press home).');
                            }
                        }}
                        variant="outline"
                        size="lg"
                    >
                        <Text className="text-foreground">{secondaryActionTitle}</Text>
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ErrorState;
