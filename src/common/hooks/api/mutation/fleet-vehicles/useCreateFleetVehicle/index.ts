import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFleetVehicle } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useCreateFleetVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFleetVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.fleetVehicles)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getFleetVehicleKpi)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getFleetProfiles)],
      });
    },
  });
};
