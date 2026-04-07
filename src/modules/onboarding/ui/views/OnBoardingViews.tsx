import { SafeAreaView } from '@/components/SafeAreaView';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import images from "@/constants/image";
import React from 'react';
import { Image, View } from 'react-native';

type Ptops = {
    onSkip: () => void;
    onComplete: () => void;
}

const OnBoardingViews = ({ onSkip, onComplete }: Ptops) => {
    return (
        <SafeAreaView className='bg-accent flex-1 gap-2 pt-5'>
            <View className='w-full flex-1 items-center'>
                <Image source={images.splashPattern} className='w-full max-h-8/10' resizeMode='cover' accessible={false} />
                <View className='gap-4 items-center my-auto w-full'>
                    <Text className='text-white text-4xl font-sans-bold text-center'>
                        Gain Financial Clarity
                    </Text>
                    <Text className='text-white/70 text-lg text-center'>
                        Track, analyze and cancel with ease
                    </Text>

                    <Button
                        onPress={onComplete}
                        accessibilityLabel="Get started"
                        className='bg-white rounded-full w-8/10 h-14'
                    >
                        <Text className='font-sans-bold text-xl'>
                            Get Started
                        </Text>
                    </Button>

                    <Button
                        onPress={onSkip}
                        accessibilityLabel="Skip onboarding"
                        variant="link"
                        className='rounded-full w-8/10 h-14 '
                    >
                        <Text className='text-xl'>
                            Skip
                        </Text>
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default OnBoardingViews;