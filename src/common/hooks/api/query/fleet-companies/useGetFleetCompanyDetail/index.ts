import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getFleetCompanyDetail } from '../../../../../services';

export const useGetFleetCompanyDetail = (businessId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.fleetCompanyDetail, businessId)],
    queryFn: () => getFleetCompanyDetail(businessId).then((res) => res.data),
    enabled: !!businessId,
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
