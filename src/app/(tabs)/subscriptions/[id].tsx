import SubscriptionIdView from '@/modules/subscription/ui/views/SubscriptionIdView';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

const SubscriptionDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    if (!id) {
        return null; // or show a loading/error state if preferred
    }
    return (
        <SubscriptionIdView id={id} />

    )
}

export default SubscriptionDetails;