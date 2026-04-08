import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getEarningsBreakdown } from '../../../../../services/api';
import { EarningsBreakdownQueryPayload } from '../../../../../types';

export const useGetEarningsBreakdown = (
  payload?: EarningsBreakdownQueryPayload
) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getEarningsBreakdown),
      JSON.stringify(payload),
    ],
    queryFn: () => getEarningsBreakdown(payload),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
