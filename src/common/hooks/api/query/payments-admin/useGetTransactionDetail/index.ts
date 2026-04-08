import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getTransactionDetail } from '../../../../../services';

export const useGetTransactionDetail = (transactionId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getTransactionDetail, transactionId)],
    queryFn: () => getTransactionDetail(transactionId).then((res) => res.data),
    placeholderData: (previousData) => previousData,
    enabled: !!transactionId,
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
