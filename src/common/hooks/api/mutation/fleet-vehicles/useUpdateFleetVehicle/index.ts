import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFleetVehicle } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useUpdateFleetVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFleetVehicle,
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
