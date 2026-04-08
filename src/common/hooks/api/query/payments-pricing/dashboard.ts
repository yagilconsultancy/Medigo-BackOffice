import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  getPricingDashboardKpis,
  getRouteComparison,
  getRecentPricingChanges,
  getPricingHealth,
} from '../../../../services/api';
import type { RecentChangesQueryPayload } from '../../../../types/api';

export const useGetPricingDashboardKpis = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getPricingDashboardKpis)],
    queryFn: () => getPricingDashboardKpis().then((res) => res.data),
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

export const useGetRouteComparison = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRouteComparison)],
    queryFn: () => getRouteComparison().then((res) => res.data),
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

export const useGetRecentPricingChanges = (
  payload?: RecentChangesQueryPayload
) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRecentPricingChanges), payload],
    queryFn: () => getRecentPricingChanges(payload).then((res) => res.data),
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
