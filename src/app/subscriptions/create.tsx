import SubscriptionCreateView from '@/modules/subscription/ui/views/SubscriptionCreateView';
import { useRouter } from 'expo-router';
import React from 'react';

export default function Create() {
    const router = useRouter();
    return (
        <SubscriptionCreateView onClose={() => { router.back(); }} onSubmit={() => { }} />
    );
}
