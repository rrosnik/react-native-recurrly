import React from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { SafeAreaView } from './SafeAreaView';

import images from "@/constants/image";

const LoadingState = () => {
    return (
        <SafeAreaView className='bg-accent flex-1 gap-2 pt-5'>
            <View className='w-full flex-1 items-center'>
                <Image source={images.splashPattern} className='w-full max-h-8/10' resizeMode='cover' />
                <View className='my-auto gap-7'>
                    <Text className='text-white text-3xl '>Loading...</Text>
                    <ActivityIndicator size="large" color="white" className='' />
                </View>
            </View>

        </SafeAreaView>
    )
}

export default LoadingState;