import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

type Props = {
    id: string;
}

export default function SubscriptionIdView({ id }: Props) {
    return (
        <View>
            <Text>SubscriptionDetails</Text>
            <Link href={"/(tabs)"}>Go back</Link>
        </View>
    )
}

