import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { addBookingNote } from '../../../../../services';

export const useAddBookingNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBookingNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAllBookings)],
      });
    },
  });
};
