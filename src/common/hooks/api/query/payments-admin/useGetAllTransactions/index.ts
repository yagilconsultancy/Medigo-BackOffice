import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getAllTransactions } from '../../../../../services';
import { TransactionListPayload } from '../../../../../types';

export const useGetAllTransactions = (payload: TransactionListPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getAllTransactions),
      JSON.stringify(payload),
    ],
    queryFn: () => getAllTransactions(payload).then((res) => res.data),
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
