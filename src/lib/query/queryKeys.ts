/**
 * Query Keys Factory
 * Central place to manage all query keys for consistency and invalidation
 */

export const queryKeys = {
  // Subscription queries
  subscriptions: {
    all: ["subscriptions"] as const,
    lists: () => [...queryKeys.subscriptions.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.subscriptions.all, "detail", id] as const,
    upcomingRenewals: () =>
      [...queryKeys.subscriptions.all, "upcoming"] as const,
  },
};
