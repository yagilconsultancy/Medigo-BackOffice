import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { listContactLogs } from '../../../../../services';
import { ContactLogListPayload } from '../../../../../types';

export const useListContactLogs = (payload: ContactLogListPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listContactLogs), JSON.stringify(payload)],
    queryFn: () => listContactLogs(payload).then((res) => res.data),
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
