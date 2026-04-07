import { ONBOARDING_STORAGE_KEY } from "@/constants/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStore } from "zustand";

type OnboardingStorageState = {
  value: boolean;
  isLoading: boolean;
  isSaving: boolean;
  readError: Error | null;
  writeError: Error | null;
  setSeen: () => void;
  reset: () => void;
};

export const onBoardingStore = createStore<OnboardingStorageState>((set) => {
  const getItem = async (): Promise<string | null> => {
    set({ isLoading: true, readError: null });
    try {
      const raw = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      set({ value: raw === "true", isLoading: false });
      return raw;
    } catch (error) {
      set({ readError: error as Error, isLoading: false });
      return null;
    }
  };

  const setSeen = async (): Promise<void> => {
    set({ isSaving: true, writeError: null });
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
      set({ value: true, isSaving: false });
    } catch (error) {
      set({ writeError: error as Error, isSaving: false });
      throw error;
    }
  };

  const reset = async (): Promise<void> => {
    set({ isSaving: true, writeError: null });
    try {
      await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
      set({ value: false, isSaving: false });
    } catch (error) {
      set({ writeError: error as Error, isSaving: false });
      throw error;
    }
  };

  getItem();

  return {
    value: false,
    isLoading: false,
    isSaving: false,
    readError: null,
    writeError: null,

    setSeen: () => setSeen(),
    reset: () => reset(),
  };
});
