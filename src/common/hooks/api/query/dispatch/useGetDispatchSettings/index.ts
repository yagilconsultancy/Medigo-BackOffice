import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getDispatchSettings } from '../../../../../services';

export const useGetDispatchSettings = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getDispatchSettings)],
    queryFn: () => getDispatchSettings().then((res) => res.data),
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
