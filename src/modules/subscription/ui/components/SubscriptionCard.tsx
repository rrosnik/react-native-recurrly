import { Button } from '@/components/ui/button';
import { formatCurrency, formatSubscriptionDateTime } from '@/lib/utils';
import React from 'react';
import { Image, ImageSourcePropType, Pressable, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    data: Subscription;
    expanded: boolean;
    onPress: () => void;
    onCancel?: () => void;
}

export default function SubscriptionCard({ data, expanded, onCancel, onPress }: Props) {
    const icon: ImageSourcePropType = typeof data.icon === 'string' ? { uri: data.icon } : data.icon as ImageSourcePropType;
    return (
        <Pressable onPress={onPress} className='border border-foreground/20 rounded-tr-4xl rounded-bl-4xl p-4' style={{ backgroundColor: data.color ?? '#fff' }}>

            <View className='flex-row items-center justify-between'>
                <View className='sub-main'>
                    <Image source={icon} className='sub-icon' />
                    <View className='sub-copy'>
                        <Text numberOfLines={1} className='sub-title'>{data.name}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' className='sub-meta'>{
                            data.category?.trim() || data.plan?.trim() || (data.renewalDate ? formatSubscriptionDateTime(data.renewalDate) : "Not Provided")

                        }</Text>
                    </View>
                </View>
                <View className='sub-price-box'>
                    <Text className='sub-price'>{formatCurrency(data.price, data.currency ?? "CAD")}</Text>
                    <Text className='sub-billing'>{data.billing}</Text>
                </View>
            </View>
            {
                expanded && (
                    <View className='mt-4 gap-4'>
                        <View className='flex-row items-center justify-between gap-2'>
                            <View className='flex-row items-center gap-2 shrink overflow-hidden'>
                                <Text className='text-muted-foreground'>Payment info:</Text>
                                <Text className='font-sans-bold shrink' numberOfLines={1} ellipsizeMode='head' >{data.paymentMethod ?? "Not Provided"}</Text>
                            </View>
                            <TouchableOpacity className='border border-foreground  rounded-full px-4 py-2'><Text className='font-sans-bold'>Manage</Text>
                            </TouchableOpacity>
                        </View>
                        <View className='flex-row items-center justify-between gap-2'>
                            <View className='flex-row items-center gap-2 shrink overflow-hidden'>
                                <Text className='text-muted-foreground'>Plan details:</Text>
                                <Text className='font-sans-bold shrink' numberOfLines={1} ellipsizeMode='head' >{data.plan ?? "Not Provided"}</Text>
                            </View>
                            <TouchableOpacity className='border border-foreground  rounded-full px-4 py-2'>
                                <Text className='font-sans-bold'>Change</Text>
                            </TouchableOpacity>
                        </View>
                        <Button onPress={onCancel} className='rounded-full'>
                            <Text className='text-white font-sans-bold text-lg'>Cancel subscription</Text>
                        </Button>
                    </View>
                )
            }
        </Pressable>
    )
}