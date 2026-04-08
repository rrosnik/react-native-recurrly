import z from "zod";
import {
    subscriptionCreateSchema,
    subscriptionFormSchema,
    subscriptionSelectSchema,
    subscriptionUpdateSchema,
} from "./schema";

// Types for subscription records
export type Subscription_Update = z.infer<typeof subscriptionUpdateSchema>;
export type Subscription_Insert = z.infer<typeof subscriptionCreateSchema>;
export type Subscription_Form = z.infer<typeof subscriptionFormSchema>;
export type Subscription = z.infer<typeof subscriptionSelectSchema>;
