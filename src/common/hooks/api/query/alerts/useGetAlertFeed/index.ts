import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getAlertFeed } from '../../../../../services';
import { AlertFeedPayload } from '../../../../../types';

export const useGetAlertFeed = (payload: AlertFeedPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getAlertFeed), JSON.stringify(payload)],
    queryFn: () => getAlertFeed(payload).then((res) => res.data),
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
