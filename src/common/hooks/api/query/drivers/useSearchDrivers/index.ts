import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { searchDrivers } from '../../../../../services';
import { DriverListPayload } from '../../../../../types';

export const useSearchDrivers = (payload: DriverListPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.searchDrivers), JSON.stringify(payload)],
    queryFn: () => searchDrivers(payload).then((res) => res.data),
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
