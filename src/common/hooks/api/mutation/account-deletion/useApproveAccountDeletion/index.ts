import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveAccountDeletionRequest } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useApproveAccountDeletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveAccountDeletionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.accountDeletionRequests)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAccountDeletionKpis)],
      });
    },
  });
};
