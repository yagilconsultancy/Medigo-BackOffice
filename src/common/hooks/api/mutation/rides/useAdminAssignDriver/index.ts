import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { adminAssignDriver } from '../../../../../services';

export const useAdminAssignDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminAssignDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAllRides)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getPendingRides)],
      });
    },
  });
};
