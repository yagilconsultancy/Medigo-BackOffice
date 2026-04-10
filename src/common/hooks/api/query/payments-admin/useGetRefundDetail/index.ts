import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getRefundDetail } from '../../../../../services/api';

export const useGetRefundDetail = (refundId?: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRefundDetail, refundId), refundId],
    queryFn: () => getRefundDetail(refundId!).then((res) => res.data),
    placeholderData: (previousData) => previousData,
    enabled: !!refundId,
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
