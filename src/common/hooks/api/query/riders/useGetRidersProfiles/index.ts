import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getRidersProfiles } from '../../../../../services';
import { RiderProfileCardsPayload } from '../../../../../types';

export const useGetRidersProfiles = (payload: RiderProfileCardsPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRidersProfiles), JSON.stringify(payload)],
    queryFn: () => getRidersProfiles(payload).then((res) => res.data),
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
