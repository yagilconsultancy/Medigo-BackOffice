import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getRiderDetail } from '../../../../../services';

export const useGetRiderDetail = (riderId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.riderDetail, riderId)],
    queryFn: () => getRiderDetail(riderId).then((res) => res.data),
    enabled: !!riderId,
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
