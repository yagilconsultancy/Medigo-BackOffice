import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { sendDriverBroadcast } from '../../../../../services';

export const useSendDriverBroadcast = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendDriverBroadcast,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getDriverKpis)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listDriverBroadcasts)],
      });
    },
  });
};
