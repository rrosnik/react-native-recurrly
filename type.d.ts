import type { ImageSourcePropType } from "react-native";

declare global {
  //#region subscription types

  type Subscription = import("@/modules/subscription/types").Subscription;
  type Subscription_Insert =
    import("@/modules/subscription/types").Subscription_Insert;
  type Subscription_Form =
    import("@/modules/subscription/types").Subscription_Form;
  type Subscription_Update =
    import("@/modules/subscription/types").Subscription_Update;

  //#endregion

  interface AppTab {
    name: string;
    title: string;
    icon: ImageSourcePropType;
  }

  interface TabIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
  }

  interface SubscriptionCardProps extends Omit<Subscription, "id"> {
    expanded: boolean;
    onPress: () => void;
    onCancelPress?: () => void;
    isCancelling?: boolean;
  }

  interface UpcomingSubscription {
    id: string;
    icon: ImageSourcePropType;
    name: string;
    price: number;
    currency?: string;
    daysLeft: number;
  }

  interface UpcomingSubscriptionCardProps extends Omit<
    UpcomingSubscription,
    "id"
  > {}
}

export { };

