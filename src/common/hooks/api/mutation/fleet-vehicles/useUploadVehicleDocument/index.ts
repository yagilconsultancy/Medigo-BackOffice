import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadVehicleDocument } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useUploadVehicleDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadVehicleDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getFleetVehicle)],
      });
    },
  });
};
