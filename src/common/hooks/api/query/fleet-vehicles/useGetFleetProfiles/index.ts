import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getFleetProfiles } from '../../../../../services';
import { FleetVehicleListPayload } from '../../../../../types';

export const useGetFleetProfiles = (payload: FleetVehicleListPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getFleetProfiles), JSON.stringify(payload)],
    queryFn: () => getFleetProfiles(payload).then((res) => res.data),
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
