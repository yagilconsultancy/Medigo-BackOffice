import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { assignRole } from '../../../../../services/api';

export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignRole,
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
