import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getCancelledTrips } from '../../../../../services';
import { CancelledTripsPayload } from '../../../../../types';

export const useGetCancelledTrips = (payload: CancelledTripsPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getCancelledTrips),
      JSON.stringify(payload),
    ],
    queryFn: () => getCancelledTrips(payload).then((res) => res.data),
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
