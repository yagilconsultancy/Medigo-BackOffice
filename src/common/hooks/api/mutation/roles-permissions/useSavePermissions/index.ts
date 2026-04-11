import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { savePermissions } from '../../../../../services/api';

export const useSavePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getPermissionMatrix)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getMyPermissions)],
      });
    },
  });
};
