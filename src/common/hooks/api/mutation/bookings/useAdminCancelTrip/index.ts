import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { adminCancelTrip } from '../../../../../services';

export const useAdminCancelTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminCancelTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAllBookings)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getCancelledTrips)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getCancelledTripsKpis)],
      });
    },
  });
};
