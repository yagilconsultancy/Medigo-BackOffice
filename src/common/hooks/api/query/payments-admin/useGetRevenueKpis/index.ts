import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getRevenueKpis } from '../../../../../services/api';
import { RevenueQueryPayload } from '../../../../../types';

export const useGetRevenueKpis = (payload?: RevenueQueryPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRevenueKpis), payload],
    queryFn: () => getRevenueKpis(payload).then((res) => res.data),
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
