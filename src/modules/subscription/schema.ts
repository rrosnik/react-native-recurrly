import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import type { ImageSourcePropType } from "react-native";
import z from "zod";
import { subscriptions } from "./dbSchema/sqliteTableSchema";

// Zod schemas for validation
export const subscriptionCreateSchema = createInsertSchema(subscriptions, {
  icon: z.custom<ImageSourcePropType>(),
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  category: z.enum(
    [
      "Entertainment",
      "Productivity",
      "Design",
      "AI Tools",
      "Developer Tools",
      "Cloud",
      "Music",
      "Other",
    ],
    {
      error: "Invalid category",
    },
  ),
  billing: z.enum(["Monthly", "Yearly"], { error: "Invalid billing" }),
});

export const subscriptionUpdateSchema = createUpdateSchema(subscriptions, {});
export const subscriptionSelectSchema = createSelectSchema(subscriptions);

export const subscriptionFormSchema = subscriptionCreateSchema
  .pick({
    name: true,
    category: true,
    billing: true,
  })
  .extend({
    price: z
      .string()
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Price must be a positive number",
      }),
  });
