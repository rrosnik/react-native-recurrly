import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/constants";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import {
  subscriptionCreateSchema,
  subscriptionUpdateSchema,
} from "@/modules/subscription/schema";
import { desc, eq, ilike } from "drizzle-orm";

export const subscriptionRepository = {
  getAll: async (
    query: {
      search?: string;
      pageSize?: number;
      page?: number;
    } = {
      pageSize: DEFAULT_PAGE_SIZE,
      page: DEFAULT_PAGE,
      search: "",
    },
  ): Promise<Subscription[]> => {
    const { search, pageSize = DEFAULT_PAGE_SIZE, page = DEFAULT_PAGE } = query;
    const offset = (page - 1) * pageSize;
    const builder = db.select().from(subscriptions).$dynamic();
    if (search) {
      builder.where(
        ilike(subscriptions.name, `%${search.replace(/%/g, "\\%")}%`),
      );
    }
    return await builder
      .limit(pageSize)
      .offset(offset)
      .orderBy(desc(subscriptions.renewalDate))
      .all();
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
    const validData = subscriptionCreateSchema.parse(payload);
    const [created] = await db
      .insert(subscriptions)
      .values(validData as any)
      .returning();
    return created;
  },

  update: async (
    id: string,
    payload: Subscription_Update,
  ): Promise<Subscription> => {
    const validData = subscriptionUpdateSchema.parse(payload);
    const [updated] = await db
      .update(subscriptions)
      .set(validData as any)
      .where(eq(subscriptions.id, id))
      .returning();
    if (!updated) throw new Error("Subscription not found");
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await db.delete(subscriptions).where(eq(subscriptions.id, id));
  },
};
