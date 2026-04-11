import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { toggleRideType } from '../../../../../services';

export const useToggleRideType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleRideType,
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
