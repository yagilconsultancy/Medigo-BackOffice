import { useQuery } from '@tanstack/react-query';

import { ROUTES, resolveRoute } from '../../../../../constants';
import { getPricingHealth } from '../../../../../services/api';

export const useGetPricingHealth = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getPricingHealth)],
    queryFn: () => getPricingHealth().then((res) => res.data),
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
