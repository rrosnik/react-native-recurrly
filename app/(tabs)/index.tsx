import "@/app/global.css";
import ListHeading from '@/components/ListHeading';
import { SafeAreaView } from '@/components/SafeAreaView';
import SubscriptionCard from '@/components/SubscriptionCard';
import UpcomingSubscriptionCard from '@/components/UpcomingSubscriptionCard';
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from '@/constants/data';
import { icons } from '@/constants/icons';
import images from "@/constants/image";
import { formatCurrency } from '@/lib/utils';
import dayjs from 'dayjs';
import { useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';


export default function App() {

  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  return (
    <SafeAreaView className='flex-1 bg-background p-5'>


      <View className=''>
        <FlatList
          ListHeaderComponent={() => (<>
            <View className='home-header w-full'>
              <View className='home-user shrink'>
                <Image source={images.avatar} className='home-avatar shrink-0' />
                <View className='flex-col shrink'>
                  <Text className='home-user-name'>{HOME_USER.name}</Text>
                  <Text className='home-user-title'>{HOME_USER.title}</Text>

                </View>
              </View>

              <Image source={icons.add} className='home-add-icon shrink-0' />

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
              >


              </FlatList>
            </View>

            <ListHeading title="All Subscriptions" />

          </>)}
          keyExtractor={item => item.id}
          data={HOME_SUBSCRIPTIONS}
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