import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getPaymentMethodBreakdown } from '../../../../../services';

export const useGetPaymentMethodBreakdown = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getPaymentMethodBreakdown)],
    queryFn: () => getPaymentMethodBreakdown().then((res) => res.data),
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
