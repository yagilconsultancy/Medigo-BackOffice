import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { editBooking } from '../../../../../services';

export const useEditBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editBooking,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAllBookings)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getPendingBookings)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getScheduledTrips)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getBookingDetail, variables.rideId)],
      });
    },
  });
};
