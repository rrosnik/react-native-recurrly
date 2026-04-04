import PageHeader from '@/components/PageHeader';
import { SafeAreaView } from '@/components/SafeAreaView';
import SubscriptionCard from '@/components/SubscriptionCard';
import { Input } from '@/components/ui/input';
import { HOME_SUBSCRIPTIONS } from '@/constants/data';
import React, { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

const Subscriptions = () => {
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSubscriptions = useMemo(() => {
        if (!searchQuery.trim()) {
            return HOME_SUBSCRIPTIONS;
        }

        const query = searchQuery.toLowerCase();
        return HOME_SUBSCRIPTIONS.filter(subscription =>
            subscription.name.toLowerCase().includes(query) ||
            subscription.category?.toLowerCase().includes(query) ||
            subscription.plan?.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    return (
        <SafeAreaView className='flex-1 bg-background p-5'>

            <PageHeader title="My Subscriptions" className='mb-8 ' />

            <View className='mb-4'>
                <Input
                    placeholder='Search subscriptions...'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor='#9CA3AF'
                />
            </View>

            <FlatList
                keyExtractor={item => item.id}
                data={filteredSubscriptions}
                extraData={expandedSubscriptionId}
                showsVerticalScrollIndicator={false}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='handled'
                ItemSeparatorComponent={() => (<View className='h-4' />)}
                ListEmptyComponent={<Text className='home-empty-state'>{searchQuery.trim() ? 'No subscriptions match your search.' : 'No subscriptions yet.'}</Text>}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        expanded={item.id === expandedSubscriptionId}
                        onPress={() => { setExpandedSubscriptionId(currentId => item.id === currentId ? null : item.id) }}
                    />
                )}
                contentContainerClassName='pb-30'
            />
        </SafeAreaView>
    )
}

export default Subscriptions;