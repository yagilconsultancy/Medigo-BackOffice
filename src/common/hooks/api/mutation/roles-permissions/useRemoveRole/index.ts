import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { removeRole } from '../../../../../services/api';

export const useRemoveRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeRole,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listAdminRoles)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getMyPermissions)],
      });
    },
  });
};
