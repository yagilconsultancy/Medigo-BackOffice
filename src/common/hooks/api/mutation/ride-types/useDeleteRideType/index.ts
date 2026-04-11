import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { deleteRideType } from '../../../../../services';

export const useDeleteRideType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRideType,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listRideTypes)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getRideTypeKpis)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getRideType, variables.rideTypeId)],
      });
    },
  });
};
