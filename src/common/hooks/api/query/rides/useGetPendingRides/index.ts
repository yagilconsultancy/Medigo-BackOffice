import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getPendingRides } from '../../../../../services';
import { PendingRidesPayload } from '../../../../../types';

export const useGetPendingRides = (payload: PendingRidesPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getPendingRides), JSON.stringify(payload)],
    queryFn: () => getPendingRides(payload).then((res) => res.data),
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
