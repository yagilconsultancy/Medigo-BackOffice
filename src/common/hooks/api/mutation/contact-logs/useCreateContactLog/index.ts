import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resolveRoute, ROUTES } from '../../../../../constants';
import { createContactLog } from '../../../../../services';

export const useCreateContactLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContactLog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.getContactKpis)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.listContactLogs)],
      });
    },
  });
};
