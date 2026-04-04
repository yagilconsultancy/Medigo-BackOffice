import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getFleetVehicles } from '../../../../../services';
import { FleetVehicleListPayload } from '../../../../../types';

export const useGetFleetVehicles = (payload: FleetVehicleListPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.fleetVehicles), JSON.stringify(payload)],
    queryFn: () => getFleetVehicles(payload).then((res) => res.data),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.status === 403) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
};
