import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getCaregiverKpis } from '../../../../../services/api';

export const useGetCaregiverKpis = () => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getCaregiverKpis)],
    queryFn: () => getCaregiverKpis().then((res) => res.data),
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
