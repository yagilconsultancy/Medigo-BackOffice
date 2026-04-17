import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants/routes';
import { revokeAdminInvitation } from '../../../../../services/api/mutation';

/**
 * React Query mutation hook to revoke a pending admin invitation
 * Invalidates admin invitations list on success
 */
export const useRevokeAdminInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeAdminInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAdminInvitations)],
      });
    },
  });
};
