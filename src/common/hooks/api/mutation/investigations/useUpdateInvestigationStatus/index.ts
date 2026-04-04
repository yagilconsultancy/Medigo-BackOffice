import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updateInvestigationStatus } from '../../../../../services';

export const useUpdateInvestigationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInvestigationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getInvestigationKpis)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listInvestigations)],
      });
    },
  });
};
