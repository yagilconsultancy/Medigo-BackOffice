import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getRefundKpis } from '../../../../../services/api';

export const useGetRefundKpis = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRefundKpis)],
    queryFn: () => getRefundKpis(),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
