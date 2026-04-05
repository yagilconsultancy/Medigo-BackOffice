import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDriver } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useCreateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.searchDrivers)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getDriverStatusOverview)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getDriverDocumentOverview)],
      });
    },
  });
};
