import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getRefundRequests } from '../../../../../services/api';
import { RefundListPayload } from '../../../../../types';

export const useGetRefundRequests = (payload: RefundListPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRefundRequests), JSON.stringify(payload)],
    queryFn: () => getRefundRequests(payload),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
