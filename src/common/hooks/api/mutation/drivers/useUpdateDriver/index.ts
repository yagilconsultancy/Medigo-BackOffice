import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDriver } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDriver,
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
