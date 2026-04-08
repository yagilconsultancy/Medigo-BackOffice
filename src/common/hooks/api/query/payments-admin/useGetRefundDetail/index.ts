import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getRefundDetail } from '../../../../../services/api';

export const useGetRefundDetail = (refundId?: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRefundDetail, refundId), refundId],
    queryFn: () => getRefundDetail(refundId!),
    placeholderData: (previousData) => previousData,
    enabled: !!refundId,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
