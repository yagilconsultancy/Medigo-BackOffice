import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { createAdminRole } from '../../../../../services/api';

export const useCreateAdminRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminRole,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listAdminRoles)],
      });
    },
  });
};
