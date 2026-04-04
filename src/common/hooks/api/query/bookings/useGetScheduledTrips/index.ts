import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getScheduledTrips } from '../../../../../services';
import { ScheduledTripsPayload } from '../../../../../types';

export const useGetScheduledTrips = (payload: ScheduledTripsPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getScheduledTrips),
      JSON.stringify(payload),
    ],
    queryFn: () => getScheduledTrips(payload).then((res) => res.data),
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
