import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getRidersActivity } from '../../../../../services';
import { RiderActivityPayload } from '../../../../../types';

export const useGetRidersActivity = (payload: RiderActivityPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRidersActivity), JSON.stringify(payload)],
    queryFn: () => getRidersActivity(payload).then((res) => res.data),
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
