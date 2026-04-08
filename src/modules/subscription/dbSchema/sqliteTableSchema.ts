import {
  customType,
  numeric,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
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
      throw new Error("Missing or empty icon payload in database");
    }
    try {
      const parsed = JSON.parse(value);
      if (!parsed) throw new Error("Invalid parsed icon payload");
      return parsed as ImageSourcePropType;
    } catch {
      if (value.trim() === "") {
        throw new Error("Invalid icon payload in database");
      }
      return { uri: value } as ImageSourcePropType;
    }
  },
  toDriver: (value: ImageSourcePropType) => {
    if (!value) throw new Error("Attempted to persist empty icon payload");
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
  status: text("status").default("active"),
  startDate: text("start_date"),
  price: numeric("price", { mode: "number" }).notNull(),
  currency: text("currency").default("CAD"),
  billing: text("billing").notNull(),
  renewalDate: text("renewal_date"),
  color: text("color"),
});
