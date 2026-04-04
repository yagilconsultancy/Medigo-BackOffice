import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getTopDrivers } from '../../../../../services';
import { TopDriversParams } from '../../../../../types';

export const useGetTopDrivers = (params?: TopDriversParams) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getTopDrivers), params],
    queryFn: () => getTopDrivers(params).then((res) => res.data),
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
