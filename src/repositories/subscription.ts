import { db } from "@/db";
import type { Subscription, Subscription_Insert } from "@/db/schema";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const subscriptionRepository = {
  getAll: async (): Promise<Subscription[]> => {
    return await db.select().from(subscriptions).all();
  },

  getById: async (id: string): Promise<Subscription> => {
    const sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, id))
      .get();
    if (!sub) throw new Error("Subscription not found");
    return sub;
  },

  create: async (payload: Subscription_Insert): Promise<Subscription> => {
    const [created] = await db
      .insert(subscriptions)
      .values(payload)
      .returning();
    return created;
  },

  update: async (
    id: string,
    payload: Partial<Subscription_Insert>,
  ): Promise<Subscription> => {
    const [updated] = await db
      .update(subscriptions)
      .set(payload)
      .where(eq(subscriptions.id, id))
      .returning();
    if (!updated) throw new Error("Subscription not found");
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await db.delete(subscriptions).where(eq(subscriptions.id, id));
  },
};
