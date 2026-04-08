import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getRevenueTrend } from '../../../../../services/api';
import { RevenueQueryPayload } from '../../../../../types';

export const useGetRevenueTrend = (payload?: RevenueQueryPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRevenueTrend), JSON.stringify(payload)],
    queryFn: () => getRevenueTrend(payload),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
