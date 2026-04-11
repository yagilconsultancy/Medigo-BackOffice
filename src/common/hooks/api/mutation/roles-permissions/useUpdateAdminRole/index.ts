import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updateAdminRole } from '../../../../../services/api';

export const useUpdateAdminRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminRole,
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
