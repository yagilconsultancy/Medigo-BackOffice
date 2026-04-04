import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getFleetApplications } from '../../../../../services';
import { FleetApplicationListPayload } from '../../../../../types';

export const useGetFleetApplications = (
  payload: FleetApplicationListPayload
) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.fleetApplications),
      JSON.stringify(payload),
    ],
    queryFn: () => getFleetApplications(payload).then((res) => res.data),
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
