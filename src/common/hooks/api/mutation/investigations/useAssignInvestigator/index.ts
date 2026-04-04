import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { assignInvestigator } from '../../../../../services';

export const useAssignInvestigator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignInvestigator,
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
