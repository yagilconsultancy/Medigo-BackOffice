import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignDriverToVehicle } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useAssignDriverToVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignDriverToVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.fleetVehicles)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getFleetProfiles)],
      });
    },
  });
};
