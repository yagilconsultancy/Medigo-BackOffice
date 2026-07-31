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
      // The ride has just moved into the assigned list, which is served by the
      // bookings endpoint — without this it wouldn't show up until a reload.
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAllBookings)],
      });
    },
  });
};
