import { useQuery } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants/routes';
import { getAdminInvitations } from '../../../../../services/api/query';
import type { AdminInvitationsListPayload } from '../../../../../types';

/**
 * React Query hook to fetch list of pending admin invitations
 * @param payload - Pagination parameters (offset, limit)
 */
export const useGetAdminInvitations = (
  payload: AdminInvitationsListPayload
) => {
  return useQuery({
    queryKey: [
      resolveRoute(ROUTES.getAdminInvitations),
      JSON.stringify(payload),
    ],
    queryFn: () => getAdminInvitations(payload).then((res) => res.data),
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
