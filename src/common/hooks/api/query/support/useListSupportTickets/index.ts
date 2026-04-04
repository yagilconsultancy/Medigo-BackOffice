import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { listSupportTickets } from '../../../../../services';
import { SupportTicketListPayload } from '../../../../../types';

export const useListSupportTickets = (payload: SupportTicketListPayload) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.listSupportTickets),
      JSON.stringify(payload),
    ],
    queryFn: () => listSupportTickets(payload).then((res) => res.data),
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
