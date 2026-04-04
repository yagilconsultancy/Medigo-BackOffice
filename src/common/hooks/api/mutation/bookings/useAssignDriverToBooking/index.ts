import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { assignDriverToBooking } from '../../../../../services';

export const useAssignDriverToBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignDriverToBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAllBookings)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getPendingBookings)],
      });
    },
  });
};
