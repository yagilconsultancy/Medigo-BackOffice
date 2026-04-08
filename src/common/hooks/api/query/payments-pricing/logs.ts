import { useQuery, useMutation } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../constants';
import { listPricingLogs, exportPricingLogs } from '../../../../services/api';
import type {
  PricingLogsQueryPayload,
  PricingLogsExportQueryPayload,
} from '../../../../types/api';

export const useListPricingLogs = (payload: PricingLogsQueryPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listPricingLogs), payload],
    queryFn: () => listPricingLogs(payload).then((res) => res.data),
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

export const useExportPricingLogs = () => {
  return useMutation({
    mutationFn: (payload?: PricingLogsExportQueryPayload) =>
      exportPricingLogs(payload),
  });
};
