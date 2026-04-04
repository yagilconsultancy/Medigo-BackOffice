import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { listInvestigations } from '../../../../../services';
import { InvestigationListPayload } from '../../../../../types';

export const useListInvestigations = (payload: InvestigationListPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.listInvestigations),
      JSON.stringify(payload),
    ],
    queryFn: () => listInvestigations(payload).then((res) => res.data),
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
