import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getRevenueByCity } from '../../../../../services/api';
import { RevenueQueryPayload } from '../../../../../types';

export const useGetRevenueByCity = (payload?: RevenueQueryPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRevenueByCity), JSON.stringify(payload)],
    queryFn: () => getRevenueByCity(payload),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
