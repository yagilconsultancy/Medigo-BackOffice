import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getFleetCompanies } from '../../../../../services';
import { FleetCompanyListPayload } from '../../../../../types';

export const useGetFleetCompanies = (payload: FleetCompanyListPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.fleetCompanies), JSON.stringify(payload)],
    queryFn: () => getFleetCompanies(payload).then((res) => res.data),
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
