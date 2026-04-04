import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { listIncidents } from '../../../../../services';
import { IncidentListPayload } from '../../../../../types';

export const useListIncidents = (payload: IncidentListPayload) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listIncidents), JSON.stringify(payload)],
    queryFn: () => listIncidents(payload).then((res) => res.data),
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
