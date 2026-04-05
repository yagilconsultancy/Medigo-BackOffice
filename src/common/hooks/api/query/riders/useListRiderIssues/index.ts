import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { listRiderIssues } from '../../../../../services';
import { RiderIssueListPayload } from '../../../../../types';

export const useListRiderIssues = (payload: RiderIssueListPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.ridersIssues), JSON.stringify(payload)],
    queryFn: () => listRiderIssues(payload).then((res) => res.data),
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
