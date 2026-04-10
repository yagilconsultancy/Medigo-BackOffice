import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getDriverEarningsList } from '../../../../../services/api';
import { DriverEarningsListPayload } from '../../../../../types';

export const useGetDriverEarningsList = (
  payload: DriverEarningsListPayload
) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getDriverEarningsList), payload],
    queryFn: () => getDriverEarningsList(payload).then((res) => res.data),
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
