import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updateDispatchSettings } from '../../../../../services';

export const useUpdateDispatchSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDispatchSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getDispatchSettings)],
      });
    },
  });
};
