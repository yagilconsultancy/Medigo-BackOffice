import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getDriverDocuments } from '../../../../../services';

export const useGetDriverDocuments = (driverId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getDriverDocuments, driverId)],
    queryFn: () => getDriverDocuments(driverId).then((res) => res.data),
    enabled: Boolean(driverId),
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
