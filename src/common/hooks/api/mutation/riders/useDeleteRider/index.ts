import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRider } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useDeleteRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRider,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.searchRiders)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getRidersProfiles)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getRidersActivity)],
      });
      queryClient.removeQueries({
        queryKey: [resolveRoute(ROUTES.riderDetail, variables.riderId)],
      });
    },
  });
};
