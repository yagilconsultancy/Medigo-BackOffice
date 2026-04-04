import { useMutation, useQueryClient } from '@tanstack/react-query';
import { replaceVehicleDocument } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useReplaceVehicleDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: replaceVehicleDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getFleetVehicle)],
      });
    },
  });
};
