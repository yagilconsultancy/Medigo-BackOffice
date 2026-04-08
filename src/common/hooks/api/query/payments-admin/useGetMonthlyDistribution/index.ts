import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getMonthlyDistribution } from '../../../../../services/api';

export const useGetMonthlyDistribution = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getMonthlyDistribution)],
    queryFn: () => getMonthlyDistribution(),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
