import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { addInvestigationNote } from '../../../../../services';

export const useAddInvestigationNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addInvestigationNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listInvestigations)],
      });
    },
  });
};
