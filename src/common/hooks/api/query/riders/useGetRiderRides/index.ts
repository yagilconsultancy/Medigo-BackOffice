import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getRiderRides } from '../../../../../services';
import { RiderRidesPayload } from '../../../../../types';

export const useGetRiderRides = (payload: RiderRidesPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.riderRides, payload.riderId),
      JSON.stringify(payload),
    ],
    queryFn: () => getRiderRides(payload).then((res) => res.data),
    enabled: !!payload.riderId,
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
