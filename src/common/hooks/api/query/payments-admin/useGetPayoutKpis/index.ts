import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getPayoutKpis } from '../../../../../services/api';
import { PayoutKpisQueryPayload } from '../../../../../types';

export const useGetPayoutKpis = (payload?: PayoutKpisQueryPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getPayoutKpis), JSON.stringify(payload)],
    queryFn: () => getPayoutKpis(payload),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
