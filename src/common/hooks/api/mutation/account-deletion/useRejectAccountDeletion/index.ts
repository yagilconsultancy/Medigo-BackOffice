import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectAccountDeletionRequest } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useRejectAccountDeletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectAccountDeletionRequest,
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
