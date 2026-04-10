import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  listServiceTypes,
  getServiceTypeConfig,
  getRoutePricing,
  getCommissionView,
} from '../../../../services/api';

export const useListServiceTypes = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listServiceTypes)],
    queryFn: () => listServiceTypes().then((res) => res.data),
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

export const useGetServiceTypeConfig = (payload: { service_type: string }) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getServiceTypeConfig, payload.service_type),
      payload.service_type,
    ],
    queryFn: () =>
      getServiceTypeConfig(payload.service_type).then((res) => res.data),
    enabled: !!payload.service_type,
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

export const useGetRoutePricing = (serviceType: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getRoutePricing, serviceType), serviceType],
    queryFn: () => getRoutePricing(serviceType).then((res) => res.data),
    enabled: !!serviceType,
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

export const useGetCommissionView = (serviceType: string) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getCommissionView, serviceType),
      serviceType,
    ],
    queryFn: () => getCommissionView(serviceType).then((res) => res.data),
    enabled: !!serviceType,
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
