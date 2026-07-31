import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRider } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useUpdateRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRider,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.searchRiders)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getRidersProfiles)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.riderDetail, variables.riderId)],
      });
    },
  });
};
