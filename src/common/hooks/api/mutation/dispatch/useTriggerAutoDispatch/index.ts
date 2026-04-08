import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { triggerAutoDispatch } from '../../../../../services';

export const useTriggerAutoDispatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: triggerAutoDispatch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getDispatchDashboard)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getUnassignedRides)],
      });
    },
  });
};
