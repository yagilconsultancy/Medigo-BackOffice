import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { deleteAdminRole } from '../../../../../services/api';

export const useDeleteAdminRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminRole,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listAdminRoles)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getAdminRoleDetail, variables.roleId)],
      });
    },
  });
};
