import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  resolveRoute,
  ROUTES,
  updateCommissionConfig,
} from '../../../../../..';

export const useUpdateCommissionConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCommissionConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getCommissionConfig)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getCommissionKpis)],
      });
    },
  });
};
