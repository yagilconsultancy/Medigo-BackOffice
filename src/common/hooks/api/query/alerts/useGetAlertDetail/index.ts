import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getAlertDetail } from '../../../../../services';

export const useGetAlertDetail = (alertId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getAlertDetail, alertId)],
    queryFn: () => getAlertDetail(alertId).then((res) => res.data),
    enabled: !!alertId,
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
