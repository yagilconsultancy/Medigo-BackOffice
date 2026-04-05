import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reactivateDriver } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useReactivateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reactivateDriver,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.searchDrivers)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getDriverStatusOverview)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.driverDetail, variables.driverId)],
      });
    },
  });
};
