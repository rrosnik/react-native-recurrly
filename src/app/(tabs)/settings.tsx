import { SafeAreaView } from '@/components/SafeAreaView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import images from "@/constants/image";
import { colors } from '@/constants/theme';
import { useAuth, useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, View } from 'react-native';

const Settings = () => {
    const { signOut } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [reminderNotifications, setReminderNotifications] = useState(true);
    const [dataCollection, setDataCollection] = useState(false);
    const [privateProfile, setPrivateProfile] = useState(false);

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            {
                text: 'Logout',
                onPress: async () => {
                    try {
                        await signOut();
                        router.replace('/(auth)/sign-in');
                    } catch (error) {
                        Alert.alert('Error', 'Failed to logout. Please try again.');
                    }
                },
                style: 'destructive',
            },
        ]);
    };

    return (
        <SafeAreaView className='flex-1 bg-background p-5'>
            <ScrollView>
                <View className='gap-5'>
                    <Text className='text-2xl font-bold mb-4 text-foreground'>Settings</Text>

                    <Card>
                        <CardContent className='flex-row items-center'>
                            <Image source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar} className='home-avatar shrink-0' />
                            <View className='gap-2'>
                                <Text className='home-user-name' numberOfLines={1}>{user?.fullName ?? 'Unknown'}</Text>
                                <Text className='home-user-title' numberOfLines={1}>{user?.emailAddresses?.[0]?.emailAddress}</Text>
                            </View>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                        </CardHeader>
                        <CardContent className='gap-4'>
                            <View className='flex-row justify-between w-full'>
                                <Text className='max-w-2/5 w-full'>Account ID</Text>
                                <Text className='max-w-3/5 w-full font-sans-bold text-right' numberOfLines={1}>{user?.id ?? 'Unknown'}</Text>
                            </View>
                            <View className='flex-row justify-between w-full'>
                                <Text className='max-w-2/5 w-full'>Joined</Text>
                                <Text className='max-w-3/5 w-full font-sans-bold text-right' numberOfLines={1}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</Text>
                            </View>
                        </CardContent>
                    </Card>


                    {/* Logout Button */}
                    <Button
                        onPress={handleLogout}
                        className='m-0'
                        size='lg'
                        variant={"accent"}
                    >
                        <Text className='text-white font-semibold'>Logout</Text>
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const SettingRow = ({
    label,
    description,
    value,
    onValueChange,
}: {
    label: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}) => (
    <View className='flex-row justify-between items-center'>
        <View className='flex-1 pr-4'>
            <Text className='text-base font-medium text-foreground'>{label}</Text>
            <Text className='text-sm text-mutedForeground mt-1'>{description}</Text>
        </View>
        <Switch
            checked={value}
            onCheckedChange={onValueChange}
        />
    </View>
);

const Separator = () => (
    <View
        style={{
            height: 1,
            backgroundColor: colors.border,
        }}
    />
);

export default Settings;