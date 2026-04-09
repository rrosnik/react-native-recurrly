import PageHeader from '@/components/PageHeader';
import { SafeAreaView } from '@/components/SafeAreaView';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { type InsightsHistoryItem, useInsights } from '../../hooks/useInsights';
import Chart from '../components/chart';
import ErrorState from '../components/ErrorState';

// ─── Layout constants ─────────────────────────────────────────────────────────

// ─── Sub-components ───────────────────────────────────────────────────────────

function HistoryCard({ item }: { item: InsightsHistoryItem }) {
  return (
    <View
      className="rounded-2xl p-4 flex-row items-center justify-between mb-3"
      style={{ backgroundColor: item.color ?? colors.card }}
    >
      {/* Left: icon + name + date */}
      <View className="flex-row items-center flex-1 min-w-0 gap-3">
        <View
          className="items-center justify-center rounded-xl overflow-hidden"
          style={{
            width: 52,
            height: 52,
            backgroundColor: 'rgba(255,255,255,0.35)',
          }}
        >
          <Image
            source={item.icon}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 min-w-0">
          <Text
            numberOfLines={1}
            style={{ fontSize: 16, fontFamily: 'sans-semibold', color: colors.foreground }}
          >
            {item.name}
          </Text>
          <Text style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 2 }}>
            {item.date}
          </Text>
        </View>
      </View>

      {/* Right: amount + frequency */}
      <View className="items-end ml-2 shrink-0">
        <Text style={{ fontSize: 15, fontFamily: 'sans-semibold', color: colors.foreground }}>
          {item.amount}
        </Text>
        <Text style={{ fontSize: 12, color: colors.mutedForeground, marginTop: 2 }}>
          {item.frequency}
        </Text>
      </View>
    </View>
  );
}

// ─── Section heading + "View all" pill ────────────────────────────────────────

function SectionHeader({
  title,
  onViewAll,
}: {
  title: string;
  onViewAll?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text className="list-title">{title}</Text>
      {onViewAll && (
        <TouchableOpacity className="list-action" onPress={onViewAll} activeOpacity={0.7}>
          <Text className="list-action-text">View all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Public screen component ──────────────────────────────────────────────────
export function InsightsView() {
  const { bars, highlightIndex, highlightValue, totalMonthly, period, history, isEmpty, isLoading, isError } =
    useInsights();
  const router = useRouter();

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <ErrorState />
    );
  }

  // ── Normal render ─────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      {/* ── Header ── */}
      <PageHeader title="Monthly Insights" />

      <ScrollView showsVerticalScrollIndicator={false} className="mt-3">
        {/* ── Upcoming section ── */}
        <SectionHeader
          title="Upcoming"
          onViewAll={() => router.push('/(tabs)/subscriptions')}
        />

        <View className="mb-4 rounded-4xl overflow-hidden">
            {isEmpty ? (
              <View className="py-8 items-center">
                <Text className="text-muted-foreground text-sm">
                  No subscriptions yet
                </Text>
              </View>
            ) : (
              // <BarChart
              //   bars={bars}
              //   highlightIndex={highlightIndex}
              //   highlightValue={highlightValue}
              // />
              <Chart />
            )}
        </View>

        {/* ── Expenses summary card ── */}
        <Card className="mb-6">
          <CardContent>
            <View className="flex-row items-center justify-between py-1">
              <View>
                <Text
                  style={{ fontSize: 17, fontFamily: 'sans-semibold', color: colors.foreground }}
                >
                  Expenses
                </Text>
                <Text
                  style={{ fontSize: 13, color: colors.mutedForeground, marginTop: 2 }}
                >
                  {period}
                </Text>
              </View>
              <View className="items-end">
                <Text
                  style={{ fontSize: 18, fontFamily: 'sans-bold', color: colors.foreground }}
                >
                  -{totalMonthly}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* ── History section ── */}
        <SectionHeader
          title="History"
          onViewAll={() => router.push('/insights/history' as any)}
        />

        <View className="pb-40">
          {history.length === 0 ? (
            <Text className="text-muted-foreground text-sm py-4">
              No recent history
            </Text>
          ) : (
            history.map((item) => <HistoryCard key={item.id} item={item} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
