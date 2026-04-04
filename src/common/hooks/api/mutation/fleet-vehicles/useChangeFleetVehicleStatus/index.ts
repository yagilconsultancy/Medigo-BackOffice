import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeFleetVehicleStatus } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useChangeFleetVehicleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeFleetVehicleStatus,
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
