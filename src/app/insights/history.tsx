import PageHeader from '@/components/PageHeader';
import { SafeAreaView } from '@/components/SafeAreaView';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/theme';
import { formatCurrency } from '@/lib/utils';
import { useSubscriptions } from '@/modules/subscription/hooks/useSubscriptionQueries';
import dayjs from 'dayjs';
import React from 'react';
import { ActivityIndicator, FlatList, Image, View } from 'react-native';

export default function HistoryPage() {
  const { data: subscriptions = [], isLoading, isError } = useSubscriptions();

  const sorted = [...subscriptions]
    .filter((s) => s.renewalDate)
    .sort((a, b) => dayjs(b.renewalDate!).unix() - dayjs(a.renewalDate!).unix());

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center p-6">
        <Text variant="h4" className="text-center mb-2">
          Failed to load
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-5">
      <PageHeader title="All History" />

      <FlatList
        className="mt-5"
        data={sorted}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <Text className="text-muted-foreground text-sm py-6 text-center">
            No subscriptions yet
          </Text>
        }
        renderItem={({ item }) => {
          const icon =
            typeof item.icon === 'string'
              ? { uri: item.icon }
              : (item.icon as any);
          return (
            <View
              className="rounded-2xl p-4 flex-row items-center justify-between"
              style={{ backgroundColor: item.color ?? colors.card }}
            >
              <View className="flex-row items-center flex-1 min-w-0 gap-3">
                <View
                  className="items-center justify-center rounded-xl overflow-hidden"
                  style={{
                    width: 52,
                    height: 52,
                    backgroundColor: 'rgba(255,255,255,0.35)',
                  }}
                >
                  <Image source={icon} style={{ width: 32, height: 32 }} resizeMode="contain" />
                </View>
                <View className="flex-1 min-w-0">
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 16,
                      fontFamily: 'sans-semibold',
                      color: colors.foreground,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 2 }}>
                    {item.renewalDate ? dayjs(item.renewalDate).format('MMMM D, HH:mm') : ''}
                  </Text>
                </View>
              </View>
              <View className="items-end ml-2 shrink-0">
                <Text
                  style={{ fontSize: 15, fontFamily: 'sans-semibold', color: colors.foreground }}
                >
                  {formatCurrency(Number(item.price), item.currency ?? 'USD')}
                </Text>
                <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 2 }}>
                  {item.billing === 'Yearly' ? 'per year' : 'per month'}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
