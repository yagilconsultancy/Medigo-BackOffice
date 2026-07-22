import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { deleteBooking } from '../../../../../services';

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getCancelledTrips)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getCancelledTripsKpis)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAllBookings)],
      });
    },
  });
};
