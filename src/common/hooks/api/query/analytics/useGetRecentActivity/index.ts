import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getRecentActivity } from '../../../../../services';
import { RecentActivityParams } from '../../../../../types';

export const useGetRecentActivity = (params?: RecentActivityParams) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRecentActivity), params],
    queryFn: () => getRecentActivity(params).then((res) => res.data),
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
