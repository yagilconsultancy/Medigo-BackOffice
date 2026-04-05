import { useMutation, useQueryClient } from '@tanstack/react-query';
import { suspendRider } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useSuspendRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendRider,
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
