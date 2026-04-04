import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVehicleCategory } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useUpdateVehicleCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVehicleCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getFleetCategories)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getFleetCompisition)],
      });
    },
  });
};
