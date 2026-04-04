import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { sendSystemBroadcast } from '../../../../../services';

export const useSendSystemBroadcast = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendSystemBroadcast,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getSystemKpis)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listSystemBroadcasts)],
      });
    },
  });
};
