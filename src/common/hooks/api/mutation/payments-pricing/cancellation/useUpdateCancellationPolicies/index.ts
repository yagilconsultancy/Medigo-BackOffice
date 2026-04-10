import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  resolveRoute,
  ROUTES,
  updateCancellationPolicies,
} from '../../../../../..';

export const useUpdateCancellationPolicies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCancellationPolicies,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getCancellationPolicies)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getCancellationKpis)],
      });
    },
  });
};
