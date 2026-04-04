import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { approveBooking } from '../../../../../services';

export const useApproveBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveBooking,
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
