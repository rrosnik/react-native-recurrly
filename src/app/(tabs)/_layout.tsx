import { tabs } from '@/constants/data';
import clsx from "clsx";
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, StatusBar, Text, View } from 'react-native';

import { SafeAreaView } from '@/components/SafeAreaView';
import { colors, components } from "@/constants/theme";
import { useAuth } from '@clerk/expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabBar = components.tabBar;

const TabLayout = () => {
    const { isSignedIn, isLoaded } = useAuth()

    const insets = useSafeAreaInsets();
    const TabIcon = ({ focused, icon }: TabIconProps) => {
        return (<View className='tabs-icon'>
            <View className={clsx("tabs-pill", focused && "tabs-active")}>
                <Image source={icon} className='tabs-glyph' resizeMode='contain' />
            </View>
        </View>);

    }

    if (!isLoaded) {
        return (
            <SafeAreaView className='flex-1 items-center justify-center bg-accent'>
                <Text className='text-foreground text-2xl'>Loading...</Text>
                <ActivityIndicator className='mt-2' size="large" color="#666666" />
            </SafeAreaView>
        )
    }

    if (!isSignedIn) {
        return <Redirect href="/(auth)/sign-in" />
    }

    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <Tabs screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                    height: tabBar.height,
                    marginHorizontal: tabBar.horizontalInset,
                    borderRadius: tabBar.radius,
                    backgroundColor: colors.primary,
                    borderTopWidth: 0,
                    elevation: 0
                },
                tabBarItemStyle: {
                    paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6

                },
                tabBarIconStyle: {
                    width: tabBar.iconFrame,
                    height: tabBar.iconFrame,
                    alignItems: "center"
                }
            }}>
                {tabs.map(tab => (
                    <Tabs.Screen key={tab.name} name={tab.name} options={{
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={tab.icon} />
                        )
                    }} />
                ))}
            </Tabs>
        </>
    )
}


export default TabLayout;