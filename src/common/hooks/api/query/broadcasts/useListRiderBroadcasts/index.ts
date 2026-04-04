import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { listRiderBroadcasts } from '../../../../../services';
import { BroadcastListPayload } from '../../../../../types';

export const useListRiderBroadcasts = (payload: BroadcastListPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.listRiderBroadcasts),
      JSON.stringify(payload),
    ],
    queryFn: () => listRiderBroadcasts(payload).then((res) => res.data),
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
