import { useMutation, useQueryClient } from '@tanstack/react-query';
import { suspendDriver } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useSuspendDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendDriver,
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
