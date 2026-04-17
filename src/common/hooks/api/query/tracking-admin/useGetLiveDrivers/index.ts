import { useQuery } from '@tanstack/react-query';
import { getLiveDrivers } from '../../../../../services/api/query/tracking-admin';
import { resolveRoute, ROUTES } from '../../../../../constants/routes';

export const useGetLiveDrivers = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getLiveDrivers)],
    queryFn: () => getLiveDrivers().then((res) => res.data),
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
