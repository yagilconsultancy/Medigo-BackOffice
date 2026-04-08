import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getDriverEarningsList } from '../../../../../services/api';
import { DriverEarningsListPayload } from '../../../../../types';

export const useGetDriverEarningsList = (
  payload: DriverEarningsListPayload
) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getDriverEarningsList),
      JSON.stringify(payload),
    ],
    queryFn: () => getDriverEarningsList(payload),
    placeholderData: (previousData) => previousData,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
