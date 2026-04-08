import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getRevenueByRideType } from '../../../../../services/api';
import { RevenueQueryPayload } from '../../../../../types';

export const useGetRevenueByRideType = (payload?: RevenueQueryPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getRevenueByRideType),
      JSON.stringify(payload),
    ],
    queryFn: () => getRevenueByRideType(payload),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
