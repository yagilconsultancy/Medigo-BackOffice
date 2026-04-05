import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveDriver } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useApproveDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveDriver,
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
