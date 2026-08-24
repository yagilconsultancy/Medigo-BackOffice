import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updateSecurityData } from '../../../../../services';

export const useUpdateSecurityData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSecurityData,
    // Without this the save succeeds, toasts success, and the form keeps
    // showing the pre-save values until a hard reload.
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getSecurityData)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getSecurityKpi)],
      });
    },
  });
};
