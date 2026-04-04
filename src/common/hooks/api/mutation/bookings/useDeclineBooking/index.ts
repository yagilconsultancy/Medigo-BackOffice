import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { declineBooking } from '../../../../../services';

export const useDeclineBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: declineBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAllBookings)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getPendingBookings)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getPendingBookingsKpis)],
      });
    },
  });
};
