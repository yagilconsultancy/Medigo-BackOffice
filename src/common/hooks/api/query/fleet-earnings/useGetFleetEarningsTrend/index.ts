import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getFleetEarningsTrend } from '../../../../../services';
import { FleetEarningsTrendPayload } from '../../../../../types';

export const useGetFleetEarningsTrend = (
  payload: FleetEarningsTrendPayload
) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getFleetEarningsTrend),
      JSON.stringify(payload),
    ],
    queryFn: () => getFleetEarningsTrend(payload).then((res) => res.data),
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
