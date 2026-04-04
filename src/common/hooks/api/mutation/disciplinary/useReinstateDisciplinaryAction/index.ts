import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { reinstateDisciplinaryAction } from '../../../../../services';

export const useReinstateDisciplinaryAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reinstateDisciplinaryAction,
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
