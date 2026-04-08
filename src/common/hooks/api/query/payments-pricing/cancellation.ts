import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  getCancellationKpis,
  getCancellationPolicies,
} from '../../../../services/api';

export const useGetCancellationKpis = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getCancellationKpis)],
    queryFn: () => getCancellationKpis().then((res) => res.data),
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

export const useGetCancellationPolicies = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getCancellationPolicies)],
    queryFn: () => getCancellationPolicies().then((res) => res.data),
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
