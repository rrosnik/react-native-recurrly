import { formatCurrency } from "@/lib/utils";
import { useSubscriptions } from "@/modules/subscription/hooks/useSubscriptionQueries";
import dayjs from "dayjs";
import { useMemo } from "react";
import type { ImageSourcePropType } from "react-native";

export type InsightsHistoryItem = {
  id: string;
  name: string;
  date: string;
  amount: string;
  frequency: string;
  color?: string | null;
  icon: ImageSourcePropType;
};

export type InsightsData = {
  /** 7 values Mon–Sun — amount due on that weekday */
  bars: number[];
  /** index of the bar to highlight; -1 if all zero */
  highlightIndex: number;
  /** formatted currency string for the highlighted bar */
  highlightValue: string;
  /** formatted total monthly spend */
  totalMonthly: string;
  /** human-readable month + year, e.g. "April 2026" */
  period: string;
  history: InsightsHistoryItem[];
  isEmpty: boolean;
  isLoading: boolean;
  isError: boolean;
};

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export function useInsights(): InsightsData {
  const { data: subscriptions = [], isLoading, isError } = useSubscriptions();

  return useMemo(() => {
    const today = dayjs();
    const dow = today.day(); // 0 = Sunday
    // Monday of the current ISO week
    const monday = today
      .subtract(dow === 0 ? 6 : dow - 1, "day")
      .startOf("day");
    const weekDays = Array.from({ length: 7 }, (_, i) => monday.add(i, "day"));

    // Sum subscription prices per day of this week
    const bars = weekDays.map((day) =>
      subscriptions
        .filter((s) => s.renewalDate && dayjs(s.renewalDate).isSame(day, "day"))
        .reduce((sum, s) => sum + Number(s.price), 0),
    );

    const maxBar = Math.max(...bars, 0);
    const highlightIndex = maxBar > 0 ? bars.indexOf(maxBar) : -1;
    const highlightValue = maxBar > 0 ? formatCurrency(maxBar) : "";

    // Normalise yearly billing to a monthly figure
    const monthlyTotal = subscriptions.reduce((sum, s) => {
      const price = Number(s.price);
      return sum + (s.billing === "Yearly" ? price / 12 : price);
    }, 0);

    // Most recent 5 subscriptions by renewal date
    const history: InsightsHistoryItem[] = [...subscriptions]
      .filter((s) => !!s.renewalDate)
      .sort(
        (a, b) => dayjs(b.renewalDate!).unix() - dayjs(a.renewalDate!).unix(),
      )
      .slice(0, 5)
      .map((s) => ({
        id: s.id,
        name: s.name,
        date: dayjs(s.renewalDate!).format("MMMM D, HH:mm"),
        amount: formatCurrency(Number(s.price), s.currency ?? "USD"),
        frequency: s.billing === "Yearly" ? "per year" : "per month",
        color: s.color,
        icon:
          typeof s.icon === "string"
            ? ({ uri: s.icon } as ImageSourcePropType)
            : (s.icon as ImageSourcePropType),
      }));

    return {
      bars,
      highlightIndex,
      highlightValue,
      totalMonthly: formatCurrency(monthlyTotal),
      period: today.format("MMMM YYYY"),
      history,
      isEmpty: subscriptions.length === 0,
      isLoading,
      isError,
    };
  }, [subscriptions, isLoading, isError]);
}

export { WEEK_DAYS };
export default useInsights;
