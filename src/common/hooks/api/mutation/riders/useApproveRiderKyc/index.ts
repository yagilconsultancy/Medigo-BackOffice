import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveRiderKyc } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useApproveRiderKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveRiderKyc,
    onSuccess: (_data, variables) => {
      // The list carries a kyc_status column, so it goes stale too.
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.searchRiders)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.riderDetail, variables.riderId)],
      });
    },
  });
};
