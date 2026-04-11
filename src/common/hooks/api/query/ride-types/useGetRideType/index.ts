import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getRideType } from '../../../../../services';

export const useGetRideType = (rideTypeId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRideType, rideTypeId)],
    queryFn: () => getRideType(rideTypeId).then((res) => res.data),
    enabled: !!rideTypeId,
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
