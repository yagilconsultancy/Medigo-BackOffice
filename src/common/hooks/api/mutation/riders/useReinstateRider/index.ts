import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reinstateRider } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useReinstateRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reinstateRider,
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
