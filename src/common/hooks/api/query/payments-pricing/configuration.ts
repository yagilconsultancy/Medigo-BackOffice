import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../constants';
import { getConfigKpis, getCurrentConfig } from '../../../../services/api';

export const useGetConfigKpis = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getConfigKpis)],
    queryFn: () => getConfigKpis().then((res) => res.data),
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

export const useGetCurrentConfig = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getCurrentConfig)],
    queryFn: () => getCurrentConfig().then((res) => res.data),
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
