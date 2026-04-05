import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reAssignDriver } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useReAssignDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reAssignDriver,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.searchDrivers)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.driverDetail, variables.driverId)],
      });
    },
  });
};
