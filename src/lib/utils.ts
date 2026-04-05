import AsyncStorage from "@react-native-async-storage/async-storage";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number, currency = "USD"): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return value.toFixed(2);
  }
};

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid()
    ? parsedDate.format("MM/DD/YYYY")
    : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const HAS_SEEN_ONBOARDING_KEY = "has_seen_onboarding";
type OnboardingSeenValue = {
  expiresAt: number | null;
};
export const hasSeenOnboarding = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(HAS_SEEN_ONBOARDING_KEY);
    if (!value) return false;
    const parsedValue: OnboardingSeenValue = JSON.parse(value);
    if (!parsedValue.expiresAt) return true;
    return Date.now() < parsedValue.expiresAt;
  } catch {
    return false;
  }
};

export const setOnboardingSeen = async (options: {
  ttl: number;
}): Promise<void> => {
  try {
    const expiresAt = options.ttl ? Date.now() + options.ttl * 1000 : null;
    await AsyncStorage.setItem(
      HAS_SEEN_ONBOARDING_KEY,
      JSON.stringify({ expiresAt }),
    );
  } catch (error) {
    console.error("Failed to set onboarding seen:", error);
    throw error;
  }
};
