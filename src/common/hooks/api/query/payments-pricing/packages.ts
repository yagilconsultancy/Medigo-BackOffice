import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../constants';
import {
  getPackageKpis,
  listPackages,
  getPackage,
} from '../../../../services/api';
import type { PackageListQueryPayload } from '../../../../types/api';

export const useGetPackageKpis = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getPackageKpis)],
    queryFn: () => getPackageKpis().then((res) => res.data),
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

export const useListPackages = (payload?: PackageListQueryPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listPackages), payload],
    queryFn: () => listPackages(payload).then((res) => res.data),
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

export const useGetPackage = (packageId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getPackage, packageId), packageId],
    queryFn: () => getPackage(packageId).then((res) => res.data),
    enabled: !!packageId,
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
