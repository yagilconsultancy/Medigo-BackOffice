import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getPendingBookings } from '../../../../../services';
import { PendingBookingsPayload } from '../../../../../types';

export const useGetPendingBookings = (payload: PendingBookingsPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getPendingBookings),
      JSON.stringify(payload),
    ],
    queryFn: () => getPendingBookings(payload).then((res) => res.data),
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
