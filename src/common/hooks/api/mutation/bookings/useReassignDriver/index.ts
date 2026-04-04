import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { reassignDriver } from '../../../../../services';

export const useReassignDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reassignDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAllBookings)],
      });
    },
  });
};
