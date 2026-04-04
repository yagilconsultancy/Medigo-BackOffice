import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { createDisciplinaryAction } from '../../../../../services';

export const useCreateDisciplinaryAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDisciplinaryAction,
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
