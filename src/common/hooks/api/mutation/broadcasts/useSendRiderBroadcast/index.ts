import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { sendRiderBroadcast } from '../../../../../services';

export const useSendRiderBroadcast = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendRiderBroadcast,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getRiderKpis)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listRiderBroadcasts)],
      });
    },
  });
};
