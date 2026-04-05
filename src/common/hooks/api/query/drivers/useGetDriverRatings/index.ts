import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getDriverRatings } from '../../../../../services';
import { DriverRatingsPayload } from '../../../../../types';

export const useGetDriverRatings = (payload: DriverRatingsPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getDriverRatings, payload.driverId),
      JSON.stringify(payload),
    ],
    queryFn: () => getDriverRatings(payload).then((res) => res.data),
    enabled: Boolean(payload.driverId),
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
