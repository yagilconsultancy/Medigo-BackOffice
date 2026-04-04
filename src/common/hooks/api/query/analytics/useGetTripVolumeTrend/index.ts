import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getTripVolumeTrend } from '../../../../../services';
import { TripVolumeTrendParams } from '../../../../../types';

export const useGetTripVolumeTrend = (params?: TripVolumeTrendParams) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getTripVolumeTrend), params],
    queryFn: () => getTripVolumeTrend(params).then((res) => res.data),
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
