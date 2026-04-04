import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getFleetCompanyDocuments } from '../../../../../services';

export const useGetFleetCompanyDocuments = (businessId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.fleetCompanyDocuments, businessId)],
    queryFn: () => getFleetCompanyDocuments(businessId).then((res) => res.data),
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
