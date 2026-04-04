import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { closeInvestigation } from '../../../../../services';

export const useCloseInvestigation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeInvestigation,
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
