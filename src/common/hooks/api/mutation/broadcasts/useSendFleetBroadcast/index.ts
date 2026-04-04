import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { sendFleetBroadcast } from '../../../../../services';

export const useSendFleetBroadcast = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendFleetBroadcast,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getFleetKpis)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listFleetBroadcasts)],
      });
    },
  });
};
