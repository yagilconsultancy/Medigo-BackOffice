import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { addIncidentNote } from '../../../../../services';

export const useAddIncidentNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addIncidentNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listIncidents)],
      });
    },
  });
};
