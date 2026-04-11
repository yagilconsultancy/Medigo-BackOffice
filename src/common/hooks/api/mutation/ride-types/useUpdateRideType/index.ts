import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { updateRideType } from '../../../../../services';

export const useUpdateRideType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRideType,
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
