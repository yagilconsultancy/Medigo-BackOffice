import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getMonthlyDistribution } from '../../../../../services/api';

export const useGetMonthlyDistribution = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getMonthlyDistribution)],
    queryFn: () => getMonthlyDistribution().then((res) => res.data),
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
