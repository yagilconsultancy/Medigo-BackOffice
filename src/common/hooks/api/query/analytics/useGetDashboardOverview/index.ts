import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getDashboardOverview } from '../../../../../services';

export const useGetDashboardOverview = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getDashboardOverview)],
    queryFn: () => getDashboardOverview().then((res) => res.data),
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
