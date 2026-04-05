import { numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  icon: text("icon").notNull(),
  name: text("name").notNull(),
  plan: text("plan"),
  category: text("category"),
  paymentMethod: text("payment_method"),
  status: text("status"),
  startDate: text("start_date"),
  price: numeric("price").notNull(),
  currency: text("currency"),
  billing: text("billing").notNull(),
  renewalDate: text("renewal_date"),
  color: text("color"),
});

type Subscription = typeof subscriptions.$inferSelect;
