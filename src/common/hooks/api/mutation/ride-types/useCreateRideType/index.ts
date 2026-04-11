import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { createRideType } from '../../../../../services';

export const useCreateRideType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRideType,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listRideTypes)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getRideTypeKpis)],
      });
    },
  });
};
