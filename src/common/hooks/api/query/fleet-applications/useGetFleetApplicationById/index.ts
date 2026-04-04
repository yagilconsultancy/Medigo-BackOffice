import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getFleetApplicationById } from '../../../../../services';

export const useGetFleetApplicationById = (appId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getFleetApplicationId, appId)],
    queryFn: () => getFleetApplicationById(appId).then((res) => res.data),
    enabled: !!appId,
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
