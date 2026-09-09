import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getAccountDeletionRequests } from '../../../../../services';
import { AccountDeletionListPayload } from '../../../../../types';

export const useGetAccountDeletionRequests = (
  payload: AccountDeletionListPayload
) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.accountDeletionRequests),
      JSON.stringify(payload),
    ],
    queryFn: () => getAccountDeletionRequests(payload).then((res) => res.data),
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
