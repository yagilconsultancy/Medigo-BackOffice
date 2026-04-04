import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectFleetApplication } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useRejectFleetApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectFleetApplication,
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
