import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updateInvestigationProgress } from '../../../../../services';

export const useUpdateInvestigationProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInvestigationProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listInvestigations)],
      });
    },
  });
};
