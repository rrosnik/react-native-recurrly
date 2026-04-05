import { SafeAreaView } from '@/components/SafeAreaView';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import images from "@/constants/image";
import { setOnboardingSeen } from '@/lib/utils';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, View } from 'react-native';

const OnBoardingPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCompleteOnboarding = async () => {
        setIsLoading(true);
        try {
            // Save onboarding completion
            await setOnboardingSeen({ ttl: 60 })
            // Navigate to main app
            router.replace('/(tabs)');
        } catch (error) {
            // TODO: Handle error (e.g. show toast)
            console.error('Failed to save onboarding state:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className='bg-accent flex-1 gap-2 pt-5'>
            <View className='w-full flex-1 items-center'>
                <Image source={images.splashPattern} className='w-full max-h-8/10' resizeMode='cover' />
                <View className='gap-4 items-center my-auto w-full'>
                    <Text className='text-white text-4xl font-sans-bold text-center'>
                        Gain Financial Clarity
                    </Text>
                    <Text className='text-white/70 text-lg text-center'>
                        Track, analyze and cancel with ease
                    </Text>

                    <Button
                        onPress={handleCompleteOnboarding}
                        disabled={isLoading}
                        className='bg-white rounded-full w-8/10 h-14'
                    >
                        <Text className='font-sans-bold text-xl'>
                            {isLoading ? 'Getting Started...' : 'Get Started'}
                        </Text>
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default OnBoardingPage;