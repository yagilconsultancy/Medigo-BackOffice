import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants/routes';
import { listTripResolutionTickets } from '@/common/services';
import { listTripResolutionTicketsPayload } from '@/common/types';

export const useGetTripResolutionTickets = (
  payload: listTripResolutionTicketsPayload
) => {
  return useQuery({
    queryKey: [resolveRoute(ROUTES.listDisputes), JSON.stringify(payload)],
    queryFn: () => listTripResolutionTickets(payload).then((res) => res.data),
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
