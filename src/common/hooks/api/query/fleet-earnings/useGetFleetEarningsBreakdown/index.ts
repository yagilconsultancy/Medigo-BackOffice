import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getFleetEarningsBreakdown } from '../../../../../services';
import { FleetEarningsBreakdownPayload } from '../../../../../types';

export const useGetFleetEarningsBreakdown = (
  payload: FleetEarningsBreakdownPayload
) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getFleetEarningsBreakdown),
      JSON.stringify(payload),
    ],
    queryFn: () => getFleetEarningsBreakdown(payload).then((res) => res.data),
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
