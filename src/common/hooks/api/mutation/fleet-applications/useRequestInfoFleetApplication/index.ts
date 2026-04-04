import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestInfoFleetApplication } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useRequestInfoFleetApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestInfoFleetApplication,
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
