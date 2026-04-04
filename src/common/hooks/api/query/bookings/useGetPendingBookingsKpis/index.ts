import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getPendingBookingsKpis } from '../../../../../services';

export const useGetPendingBookingsKpis = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getPendingBookingsKpis)],
    queryFn: () => getPendingBookingsKpis().then((res) => res.data),
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
