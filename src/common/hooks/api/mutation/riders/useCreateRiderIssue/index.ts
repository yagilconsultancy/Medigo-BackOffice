import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRiderIssue } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useCreateRiderIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRiderIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.ridersIssues)],
      });
    },
  });
};
