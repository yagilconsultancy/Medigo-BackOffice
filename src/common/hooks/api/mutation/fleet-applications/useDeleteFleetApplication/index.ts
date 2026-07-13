import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFleetApplication } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useDeleteFleetApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFleetApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.fleetApplications)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getFleetApplicationsKpi)],
      });
    },
  });
};
