import { tabs } from '@/constants/data';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Redirect, Tabs } from 'expo-router';
import React, { createContext } from 'react';
import { Image, ImageSourcePropType, Pressable, StatusBar, View } from 'react-native';

import LoadingState from '@/components/LoadingState';
import { components } from "@/constants/theme";
import { cn } from '@/lib/utils';
import { onBoardingStore } from '@/modules/onboarding/hooks/useOnBoardingStorage';
import { useAuth } from '@clerk/expo';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

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



type TabIconProps = { focused: boolean; icon: ImageSourcePropType };

const TabIcon = React.memo(({ focused, icon }: TabIconProps) => {
    return (
        <View className='size-14 items-center justify-center rounded-full '>
            <View className={cn('size-full items-center justify-center rounded-full',
                focused && 'bg-accent')}>
                <Image source={icon} className='size-7' resizeMode='contain' />
            </View>
        </View>
    );
}, (prevProps, nextProps) => {
    return prevProps.focused === nextProps.focused && prevProps.icon === nextProps.icon;
});

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const safeInsets = useSafeAreaInsets();

    return (
        <View
            className={cn("absolute h-20  flex-row items-center  mx-5 p-0 rounded-full bg-primary",
                `left-0 right-0 bottom-[${safeInsets.bottom}px]`,
                "shadow-lg shadow-black/10",
                // "overflow-hidden"
            )}
            style={{ bottom: safeInsets.bottom }}
        >
            {state.routes.map((route: any, index: number) => {
                const isFocused = state.index === index;
                const { options } = descriptors[route.key];
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <Pressable
                        key={route.key}
                        onPress={onPress}
                        className="flex-1 items-center justify-center"
                        accessibilityState={{ selected: isFocused }}
                        accessibilityLabel={options.tabBarAccessibilityLabel ?? route.name}
                        testID={options.tabBarButtonTestID ?? route.key}
                        onLongPress={() => {
                            navigation.emit({ type: 'tabLongPress', target: route.key });
                        }}

                    >
                        {options.tabBarIcon ? options.tabBarIcon({ focused: isFocused, color: '#fff', size: tabBar.iconFrame }) : null}
                    </Pressable>
                );
            })}
        </View>
    );
};


const tabScreens = () => tabs.map((tab) => (
    <Tabs.Screen
        key={tab.name}
        name={tab.name}
        options={{
            tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={tab.icon} />,
        }}
    />
))
const TabLayout = () => {
    const { isSignedIn, isLoaded } = useAuth();
    const { value, isLoading } = useStore(onBoardingStore, useShallow(state => ({
        value: state.value,
        isLoading: state.isLoading,
        reset: state.reset,
    })));

    if (!isLoaded) return <LoadingState />;
    if (isLoading) return <LoadingState />;
    if (!value) return <Redirect href='/onboarding' />;
    if (!isSignedIn) return <Redirect href='/(auth)/sign-in' />;

    return (
        <>
            <StatusBar barStyle='dark-content' backgroundColor='white' />
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                }}
                tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}

            >
                {tabScreens()}
            </Tabs>
        </>
    );
};

export default TabLayout;