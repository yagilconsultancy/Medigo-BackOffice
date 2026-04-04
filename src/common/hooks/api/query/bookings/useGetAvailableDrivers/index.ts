import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getAvailableDrivers } from '../../../../../services';

export const useGetAvailableDrivers = (rideId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getAvailableDrivers, rideId)],
    queryFn: () => getAvailableDrivers(rideId).then((res) => res.data),
    enabled: !!rideId,
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
