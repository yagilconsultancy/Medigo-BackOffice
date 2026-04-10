import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getEarningsBreakdown } from '../../../../../services/api';
import { EarningsBreakdownQueryPayload } from '../../../../../types';

export const useGetEarningsBreakdown = (
  payload?: EarningsBreakdownQueryPayload
) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getEarningsBreakdown), payload],
    queryFn: () => getEarningsBreakdown(payload).then((res) => res.data),
    placeholderData: (previousData) => previousData,
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
