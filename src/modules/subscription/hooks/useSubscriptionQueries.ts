/**
 * Subscription Query Hooks
 * React Query hooks for subscription data fetching
 */

import { queryKeys } from "@/lib/query/queryKeys";
import { subscriptionRepository } from "@/repositories/subscription";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Fetch all subscriptions
 */
export const useSubscriptions = () => {
  return useQuery({
    queryKey: queryKeys.subscriptions.lists(),
    queryFn: () => subscriptionRepository.getAll(),
  });
};

/**
 * Fetch single subscription by ID
 */
export const useSubscription = (id: string) => {
  return useQuery({
    queryKey: queryKeys.subscriptions.detail(id),
    queryFn: () => subscriptionRepository.getById(id),
    enabled: Boolean(id),
  });
};

/**
 * Create subscription mutation
 */
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Subscription_Insert) =>
      subscriptionRepository.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.lists(),
      });
    },
  });
};

/**
 * Update subscription mutation
 */
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Subscription_Insert>;
    }) => subscriptionRepository.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.lists(),
      });
    },
  });
};

/**
 * Delete subscription mutation
 */
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => subscriptionRepository.delete(id),
    onSuccess: (_data, variables) => {
      const id = typeof variables === "string" ? variables : undefined;
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.subscriptions.detail(id),
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.subscriptions.lists(),
      });
    },
  });
};
