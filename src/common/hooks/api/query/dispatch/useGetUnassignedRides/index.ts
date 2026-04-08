import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getUnassignedRides } from '../../../../../services';
import { UnassignedRidesPayload } from '../../../../../types';

export const useGetUnassignedRides = (payload: UnassignedRidesPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getUnassignedRides),
      JSON.stringify(payload),
    ],
    queryFn: () => getUnassignedRides(payload).then((res) => res.data),
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
