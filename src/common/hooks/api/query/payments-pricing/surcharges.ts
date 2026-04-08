import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getSurchargeKpis, listSurchargeRules } from '../../../../services/api';

export const useGetSurchargeKpis = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getSurchargeKpis)],
    queryFn: () => getSurchargeKpis().then((res) => res.data),
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

export const useListSurchargeRules = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listSurchargeRules)],
    queryFn: () => listSurchargeRules().then((res) => res.data),
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
