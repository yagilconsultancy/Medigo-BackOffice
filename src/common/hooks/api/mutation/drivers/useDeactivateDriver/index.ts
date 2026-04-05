import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deactivateDriver } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useDeactivateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateDriver,
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
