import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { listFleetBroadcasts } from '../../../../../services';
import { BroadcastListPayload } from '../../../../../types';

export const useListFleetBroadcasts = (payload: BroadcastListPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.listFleetBroadcasts),
      JSON.stringify(payload),
    ],
    queryFn: () => listFleetBroadcasts(payload).then((res) => res.data),
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
