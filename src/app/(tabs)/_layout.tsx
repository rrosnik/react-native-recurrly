import { tabs } from '@/constants/data';
import clsx from "clsx";
import { Redirect, Tabs } from 'expo-router';
import React, { createContext, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, StatusBar, Text, View } from 'react-native';

import CreateSubscriptionModal from '@/components/CreateSubscriptionModal';
import { SafeAreaView } from '@/components/SafeAreaView';
import { colors, components } from "@/constants/theme";
import { HasSeenOnboarding } from '@/lib/utils';
import { useAuth } from '@clerk/expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SubscriptionModalContext = createContext<{
    isModalVisible: boolean;
    openModal: () => void;
    closeModal: () => void;
    setOnSubmitCallback: (callback: (subscription: Subscription) => void) => void;
} | null>(null);

export const useSubscriptionModal = () => {
    const context = React.useContext(SubscriptionModalContext);
    if (!context) {
        throw new Error('useSubscriptionModal must be used within tabs layout');
    }
    return context;
};

const tabBar = components.tabBar;

const TabLayout = () => {
    const { isSignedIn, isLoaded } = useAuth()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [subscriptionCallback, setSubscriptionCallback] = useState<(subscription: Subscription) => void>(() => { });
    const [seenOnboarding, setSeenOnboarding] = useState<boolean | null>(null);

    const insets = useSafeAreaInsets();

    React.useEffect(() => {
        const checkOnboarding = async () => {
            const hasSeen = await HasSeenOnboarding();
            setSeenOnboarding(hasSeen);
        };
        checkOnboarding();
    }, []);
    const TabIcon = ({ focused, icon }: TabIconProps) => {
        return (<View className='tabs-icon'>
            <View className={clsx("tabs-pill", focused && "tabs-active")}>
                <Image source={icon} className='tabs-glyph' resizeMode='contain' />
            </View>
        </View>);

    }

    const handleSetOnSubmitCallback = useCallback((callback: (subscription: Subscription) => void) => {
        setSubscriptionCallback(() => callback);
    }, []);


    if (!isLoaded || seenOnboarding === null) {
        return (
            <SafeAreaView className='flex-1 items-center justify-center bg-accent'>
                <Text className='text-foreground text-2xl'>Loading...</Text>
                <ActivityIndicator className='mt-2' size="large" color="#666666" />
            </SafeAreaView>
        )
    }

    if (!seenOnboarding) {
        return <Redirect href="/onboarding" />
    }

    if (!isSignedIn) {
        return <Redirect href="/(auth)/sign-in" />
    }




    const contextValue = useMemo(() => ({
        isModalVisible,
        openModal: () => setIsModalVisible(true),
        closeModal: () => setIsModalVisible(false),
        setOnSubmitCallback: handleSetOnSubmitCallback,
    }), [isModalVisible, handleSetOnSubmitCallback]);

    return (
        <SubscriptionModalContext.Provider
            value={contextValue}
        >
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
                            <TabIcon key={tab.name} focused={focused} icon={tab.icon} />
                        )
                    }} />
                ))}
            </Tabs>

            <CreateSubscriptionModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={(subscription) => {
                    subscriptionCallback(subscription);
                    setIsModalVisible(false);
                }}
            />
        </SubscriptionModalContext.Provider>
    )
}


export default TabLayout;