import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

type props = {
    id: string;
}

export default function SubscriptionIdView({ id }: props) {
    return (
        <View>
            <Text>SubscriptionDetails</Text>
            <Link href={"/(tabs)"}>Go back</Link>
        </View>
    )
}

