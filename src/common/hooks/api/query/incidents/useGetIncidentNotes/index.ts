import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { getIncidentNotes } from '../../../../../services';

export const useGetIncidentNotes = (incidentId: string) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.getIncidentNotes, incidentId)],
    queryFn: () => getIncidentNotes(incidentId).then((res) => res.data),
    enabled: !!incidentId,
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
