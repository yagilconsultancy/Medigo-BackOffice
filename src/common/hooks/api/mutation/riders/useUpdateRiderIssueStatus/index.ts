import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRiderIssueStatus } from '../../../../../services';
import { resolveRoute, ROUTES } from '../../../../../constants';

export const useUpdateRiderIssueStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRiderIssueStatus,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.ridersIssues)],
      });
      queryClient.invalidateQueries({
        queryKey: [resolveRoute(ROUTES.ridersIssuesDetail, variables.issueId)],
      });
    },
  });
};
