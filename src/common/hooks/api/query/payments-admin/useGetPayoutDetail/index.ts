import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getPayoutDetail } from '../../../../../services/api';

export const useGetPayoutDetail = (driverId?: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getPayoutDetail, driverId), driverId],
    queryFn: () => getPayoutDetail(driverId!),
    placeholderData: (previousData) => previousData,
    enabled: !!driverId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
