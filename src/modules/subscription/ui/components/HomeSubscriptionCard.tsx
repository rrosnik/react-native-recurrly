import { formatCurrency, formatStatusLabel, formatSubscriptionDateTime } from '@/lib/utils';
import clsx from 'clsx';
import React from 'react';
import { Image, ImageSourcePropType, Pressable, Text, View } from 'react-native';

const HomeSubscriptionCard = ({ expanded, onPress, ...data }: SubscriptionCardProps) => {
    const fallback = "Not Provided";
    const icon: ImageSourcePropType = typeof data.icon === 'string' ? { uri: data.icon } : data.icon as ImageSourcePropType;
    return (
        <Pressable onPress={onPress} className={clsx("sub-card",
            expanded ? "sub-card-expanded" : "bg-card"

        )}
            style={!expanded && data.color ? { backgroundColor: data.color } : undefined}

        >
            <View className='sub-head'>
                <View className='sub-main'>
                    <Image source={icon} className='sub-icon' />
                    <View className='sub-copy'>
                        <Text numberOfLines={1} className='sub-title'>{data.name}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' className='sub-meta'>{
                            data.category?.trim() || data.plan?.trim() || (data.renewalDate ? formatSubscriptionDateTime(data.renewalDate) : fallback)

                        }</Text>
                    </View>
                </View>
                <View className='sub-price-box'>
                    <Text className='sub-price'>{formatCurrency(data.price, data.currency ?? "CAD")}</Text>
                    <Text className='sub-billing'>{data.billing}</Text>
                </View>
            </View>

            {expanded && (
                <View className='sub-body'>
                    <View className='sub-details'>
                        <View className='sub-row'>
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>Payment:</Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail' >{data.paymentMethod?.trim() || fallback}</Text>
                            </View>
                        </View>

                        <View className='sub-row'>
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>Category:</Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail' >{data.category?.trim() || data.plan?.trim() || fallback}</Text>
                            </View>
                        </View>
                        <View className='sub-row'>
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>Started:</Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail' >{data.startDate ? formatSubscriptionDateTime(data.startDate) : fallback}</Text>
                            </View>
                        </View>
                        <View className='sub-row'>
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>Renewal data:</Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail' >{data.renewalDate ? formatSubscriptionDateTime(data.renewalDate) : fallback}</Text>
                            </View>
                        </View>

                        <View className='sub-row'>
                            <View className='sub-row-copy'>
                                <Text className='sub-label'>Status:</Text>
                                <Text className='sub-value' numberOfLines={1} ellipsizeMode='tail' >{data.status ? formatStatusLabel(data.status) : fallback}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            )}



        </Pressable>
    )
}

export default HomeSubscriptionCard;