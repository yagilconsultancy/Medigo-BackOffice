import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { searchRiders } from '../../../../../services';
import { RiderListPayload } from '../../../../../types';

export const useSearchRiders = (payload: RiderListPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.searchRiders), JSON.stringify(payload)],
    queryFn: () => searchRiders(payload).then((res) => res.data),
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
