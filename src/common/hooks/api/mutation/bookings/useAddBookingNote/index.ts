import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { addBookingNote } from '../../../../../services';

export const useAddBookingNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBookingNote,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAllBookings)],
      });
      // The notes list and the booking detail (which renders admin_notes) both
      // go stale the moment a note is added.
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getBookingNotes, variables.rideId)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getBookingDetail, variables.rideId)],
      });
    },
  });
};
