import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getPayoutSchedule } from '../../../../../services/api';

export const useGetPayoutSchedule = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getPayoutSchedule)],
    queryFn: () => getPayoutSchedule(),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
