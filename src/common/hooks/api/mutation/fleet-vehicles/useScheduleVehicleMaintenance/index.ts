import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleVehicleMaintenance } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useScheduleVehicleMaintenance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scheduleVehicleMaintenance,
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
