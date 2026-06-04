import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { assignCareAssistantToBooking } from '../../../../../services';

export const useAssignCareAssistantToBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignCareAssistantToBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAllBookings)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getPendingBookings)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getScheduledTrips)],
      });
    },
  });
};
