import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getCaregiverDetail } from '../../../../../services/api';

export const useGetCaregiverDetail = (caregiverId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getCaregiverDetail, caregiverId)],
    queryFn: () => getCaregiverDetail(caregiverId).then((res) => res.data),
    enabled: !!caregiverId,
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
