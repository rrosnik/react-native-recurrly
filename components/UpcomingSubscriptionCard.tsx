import { formatCurrency } from '@/lib/utils';
import React from 'react';
import { Image, Text, View } from 'react-native';

const UpcomingSubscriptionCard = ({ data: { name, icon, price, daysLeft, currency } }: { data: UpcomingSubscription }) => {
    return (
        <View className='upcoming-card'>
            <View className='upcoming-row'>

                <Image source={icon} className='upcoming-icon' />
                <View>
                    <Text className='upcoming-price'>{formatCurrency(price, currency)}</Text>
                    <Text className='upcoming-meta' numberOfLines={1}>{daysLeft} {daysLeft > 1 ? "days" : "day"} left</Text>
                </View>

            </View>
            <Text className='upcoming-name'>{name}</Text>
        </View>
    )
}

export default UpcomingSubscriptionCard;