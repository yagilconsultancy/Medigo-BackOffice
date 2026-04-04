import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unassignDriverFromVehicle } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useUnassignDriverFromVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unassignDriverFromVehicle,
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
