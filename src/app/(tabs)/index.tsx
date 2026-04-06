import { useSubscriptionModal } from '@/app/(tabs)/_layout';
import "@/app/global.css";
import ListHeading from '@/components/ListHeading';
import { SafeAreaView } from '@/components/SafeAreaView';
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from '@/constants/data';
import { icons } from '@/constants/icons';
import images from "@/constants/image";
import { formatCurrency } from '@/lib/utils';
import SubscriptionCard from '@/modules/subscription/ui/components/SubscriptionCard';
import UpcomingSubscriptionCard from '@/modules/subscription/ui/components/UpcomingSubscriptionCard';
import { useUser } from '@clerk/expo';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';


export default function App() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { openModal, setOnSubmitCallback } = useSubscriptionModal();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);

  useEffect(() => {
    setOnSubmitCallback((newSubscription: Subscription) => {
      setSubscriptions(prevSubs => [newSubscription, ...prevSubs]);
    });
  }, [setOnSubmitCallback]);
2



  return (
    <SafeAreaView  className='flex-1 dark:bg-accent bg-background  p-5' >
      <View className=''>
        <FlatList
          ListHeaderComponent={() => (<>
            <View className='home-header w-full'>
              <View className='home-user shrink'>
                <Image source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar} className='home-avatar shrink-0' />
                <View className='flex-col shrink'>
                  <Text className='home-user-name'>{HOME_USER.name}</Text>
                  <Text className='home-user-title'>{HOME_USER.title}</Text>

                </View>
              </View>

              <Pressable onPress={openModal}>
                <Image source={icons.add} className='home-add-icon shrink-0' />
              </Pressable>

            </View>
            <View className='home-balance-card'>
              <Text className='home-balance-label'>Balance</Text>

              <View className='home-balance-row'>
                <Text className='home-balance-amount'>{formatCurrency(HOME_BALANCE.amount)}</Text>
                <Text className='home-balance-date'>{dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}</Text>
              </View>
            </View>

            <View className=''>
              <ListHeading title="Upcoming" />
              <FlatList
                keyExtractor={(item) => item.id}
                horizontal
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (<UpcomingSubscriptionCard data={item} />)}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<Text className='home-empty-state'>No upcoming renewals yet</Text>}
              />
            </View>

            <ListHeading title="All Subscriptions" />

          </>)}
          keyExtractor={item => item.id}
          data={subscriptions}
          extraData={expandedSubscriptionId}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (<View className='h-4' />)}
          ListEmptyComponent={<Text className='home-empty-state'>No subscriptions yet.</Text>}
          renderItem={({ item }) => (
            <SubscriptionCard
              {...item}
              expanded={item.id === expandedSubscriptionId}
              onPress={() => { setExpandedSubscriptionId(currentId => item.id === currentId ? null : item.id) }}
            />
          )}
          contentContainerClassName='pb-30'

        />

      </View>

    </SafeAreaView>
  );
}