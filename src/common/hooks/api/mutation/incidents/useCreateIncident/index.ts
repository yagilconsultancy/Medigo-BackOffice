import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { createIncident } from '../../../../../services';

export const useCreateIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getIncidentKpis)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listIncidents)],
      });
    },
  });
};
