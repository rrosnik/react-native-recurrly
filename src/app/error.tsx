import ErrorState from '@/components/ErrorState';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';

type Params = {
    title?: string;
    message?: string;
    actionTitle?: string;
    redirectTo?: string;
};

export default function ErrorScreen() {
    const { title, message, actionTitle, redirectTo } = useLocalSearchParams<Params>();
    const router = useRouter();

    const handleAction = useCallback(() => {
        if (redirectTo) {
            router.replace(redirectTo as Parameters<ReturnType<typeof useRouter>["replace"]>[0]);
        } else {
            router.back();
        }
    }, [redirectTo, router]);

    return (
        <ErrorState
            title={title}
            message={message}
            actionTitle={actionTitle}
        />
    );
}
