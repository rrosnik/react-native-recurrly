import {
  customType,
  numeric,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { nanoid } from "nanoid";
import type { ImageSourcePropType } from "react-native";

const iconType = customType<{
  data: ImageSourcePropType;
  driverData: string;
  notNull: true;
}>({
  dataType: () => "text",
  fromDriver: (value: string): ImageSourcePropType => {
    if (!value) {
      return { uri: "" } as ImageSourcePropType;
    } else {
      try {
        const parsed = JSON.parse(value);
        return parsed as ImageSourcePropType;
      } catch {
        return { uri: value } as ImageSourcePropType;
      }
    }
  },
  toDriver: (value: ImageSourcePropType) => {
    if (!value) return "";
    return JSON.stringify(value);
  },
});

// Subscriptions table definition using Drizzle ORM
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  // Icon stored as JSON string or URI, transformed to ImageSourcePropType on retrieval
  icon: iconType("icon").notNull(),
  name: text("name").notNull(),
  plan: text("plan"),
  category: text("category"),
  paymentMethod: text("payment_method"),
  status: text("status"),
  startDate: text("start_date"),
  price: numeric("price").notNull().$type<number>(),
  currency: text("currency"),
  billing: text("billing").notNull(),
  renewalDate: text("renewal_date"),
  color: text("color"),
});

// Zod schemas for validation
export const subscriptionCreateSchema = createInsertSchema(subscriptions);
export const subscriptionUpdateSchema = createUpdateSchema(subscriptions);
export const subscriptionSelectSchema = createSelectSchema(subscriptions);

// Types for subscription records
export type Subscription_Raw = typeof subscriptions.$inferSelect;
export type Subscription_Insert = typeof subscriptions.$inferInsert;
export type Subscription = Subscription_Raw;
