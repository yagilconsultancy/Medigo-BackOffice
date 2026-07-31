import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectRiderKyc } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useRejectRiderKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectRiderKyc,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.searchRiders)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.riderDetail, variables.riderId)],
      });
    },
  });
};
