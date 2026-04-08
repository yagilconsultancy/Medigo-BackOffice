import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { manuallyAssignDriver } from '../../../../../services';

export const useManuallyAssignDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: manuallyAssignDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getDispatchDashboard)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getUnassignedRides)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAvailableDispatchDrivers)],
      });
    },
  });
};
