import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getDriverTrips } from '../../../../../services';
import { DriverTripsPayload } from '../../../../../types';

export const useGetDriverTrips = (payload: DriverTripsPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getDriverTrips, payload.driverId),
      JSON.stringify(payload),
    ],
    queryFn: () => getDriverTrips(payload).then((res) => res.data),
    enabled: Boolean(payload.driverId),
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
