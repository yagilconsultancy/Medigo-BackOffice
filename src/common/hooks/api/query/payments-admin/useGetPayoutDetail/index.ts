import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getPayoutDetail } from '../../../../../services/api';

export const useGetPayoutDetail = (driverId?: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getPayoutDetail, driverId), driverId],
    queryFn: () => getPayoutDetail(driverId!).then((res) => res.data),
    placeholderData: (previousData) => previousData,
    enabled: !!driverId,
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
