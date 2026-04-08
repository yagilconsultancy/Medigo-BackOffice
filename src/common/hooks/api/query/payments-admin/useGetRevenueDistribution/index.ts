import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getRevenueDistribution } from '../../../../../services/api';
import { RevenueQueryPayload } from '../../../../../types';

export const useGetRevenueDistribution = (payload?: RevenueQueryPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getRevenueDistribution),
      JSON.stringify(payload),
    ],
    queryFn: () => getRevenueDistribution(payload),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
