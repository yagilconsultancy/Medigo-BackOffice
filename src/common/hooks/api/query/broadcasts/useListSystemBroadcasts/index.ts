import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { listSystemBroadcasts } from '../../../../../services';
import { BroadcastListPayload } from '../../../../../types';

export const useListSystemBroadcasts = (payload: BroadcastListPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listSystemBroadcasts), JSON.stringify(payload)],
    queryFn: () => listSystemBroadcasts(payload).then((res) => res.data),
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
