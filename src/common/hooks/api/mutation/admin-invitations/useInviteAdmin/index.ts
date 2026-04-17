import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants/routes';
import { inviteAdmin } from '../../../../../services/api/mutation';

/**
 * React Query mutation hook to send an admin invitation
 * Invalidates admin invitations list on success
 */
export const useInviteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAdminInvitations)],
      });
    },
  });
};
