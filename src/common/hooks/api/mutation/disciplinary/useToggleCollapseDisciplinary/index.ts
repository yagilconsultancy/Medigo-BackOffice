import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { toggleCollapseDisciplinary } from '../../../../../services';

export const useToggleCollapseDisciplinary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCollapseDisciplinary,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getDisciplinaryKpis)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listDisciplinaryActions)],
      });
    },
  });
};
