import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveFleetApplication } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useApproveFleetApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveFleetApplication,
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
