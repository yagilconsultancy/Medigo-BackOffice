import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getFleetCompanyDrivers } from '../../../../../services';
import { FleetCompanyDriversPayload } from '../../../../../types';

export const useGetFleetCompanyDrivers = (
  payload: FleetCompanyDriversPayload
) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.fleetCompanyDrivers, payload.businessId),
      JSON.stringify(payload),
    ],
    queryFn: () => getFleetCompanyDrivers(payload).then((res) => res.data),
    enabled: !!payload.businessId,
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
